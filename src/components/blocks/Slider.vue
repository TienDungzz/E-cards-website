<template>
    <div
        class="slider-container"
        :class="{ 'stack-mode': stack}"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <div class="slider-wrapper" :style="wrapperStyle" ref="wrapper">
            <div
                v-for="(item, index) in displayItems"
                :key="item.id"
                class="slider-item"
                :class="{ 'visible': visibleItemIndices.has(index), 'hidden': !visibleItemIndices.has(index)}"
                :style="itemStyle(index)"
            >
                <slot :item="item"></slot>
            </div>
        </div>

        <!-- Arrows -->
        <button role="button" v-if="arrows && totalDots > 1" class="nav-btn prev" @click="prev" :disabled="isDragging">
            <Icon name="arrow" />
        </button>
        <button role="button" v-if="arrows && totalDots > 1" class="nav-btn next" @click="next" :disabled="isDragging">
            <Icon name="arrow" />
        </button>

        <!-- Dots -->
        <div class="dots" v-if="dots && totalDots > 1">
            <span
                role="button"
                v-for="n in totalDots"
                :key="n"
                :class="{ active: currentPage === n - 1 }"
                @click="goTo(n - 1)"
            ></span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useSwipe } from '@vueuse/core'
import { useBreakpoints } from '@vueuse/core'
import Icon from '@/components/blocks/Icon.vue'

const props = defineProps({
  items: { type: Array, required: true },
  columns: {
    type: [Number, Object],
    default: () => ({ mobile: 1, tablet: 2, desktop: 3 })
  },
  gap: { type: Number, default: 16 },
  infinite: { type: Boolean, default: true },
  arrows: { type: Boolean, default: true },
  dots: { type: Boolean, default: false },
  draggable: { type: Boolean, default: true },
  stack: { type: Boolean, default: false },
  autoplay: { type: Boolean, default: false }
})

const totalSlides = computed(() => props.items.length)

// === Breakpoints ===
const customBreakpoints = { sm: 576, md: 768, lg: 1024, xl: 1280 }
const breakpoints = useBreakpoints(customBreakpoints)
const isMobile = breakpoints.smaller('sm')
const isTablet = breakpoints.between('sm', 'lg')
const isDesktop = breakpoints.greaterOrEqual('lg')

// === Số cột hiện tại ===
const currentColumns = computed(() => {
  if (typeof props.columns === 'number') return props.columns
  if (isMobile.value) return props.columns.mobile ?? 1
  if (isTablet.value) return props.columns.tablet ?? 2
  return props.columns.desktop ?? 3
})

// === Số trang (dots) = items.length - columns + 1 ===
const totalDots = computed(() => {
  const cols = currentColumns.value
  return Math.max(totalSlides.value - cols + 1, 1)
})

// === Trang hiện tại (0, 1, 2) ===
const currentPage = computed(() => {
  return currentIndex.value % totalDots.value
})

// === State ===
const wrapper = ref(null)
const currentIndex = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const currentTranslate = ref(0)
const prevTranslate = ref(0)
const itemWidth = ref(0)
const displayIndex = ref(0)
const visibleItemIndices = ref(new Set())
const randomCache = new Map()
const isReady = ref(false)
const autoplayTimer = ref(null)

// === displayItems: không clone ===
const displayItems = computed(() => props.items)

// === Cập nhật kích thước ===
const updateDimensions = () => {
  if (!wrapper.value) return
  const container = wrapper.value.parentElement
  const containerWidth = container.offsetWidth
  const cols = currentColumns.value
  itemWidth.value = (containerWidth - props.gap * (cols - 1)) / cols
}

const updateVisibleItems = () => {
  const startIndex = displayIndex.value
  const cols = currentColumns.value
  const endIndex = Math.min(startIndex + cols - 1, props.items.length - 1)
  const newVisible = new Set()
  for (let i = startIndex; i <= endIndex; i++) {
    newVisible.add(i)
  }
  visibleItemIndices.value = newVisible
}

// === wrapperStyle ===
const wrapperStyle = computed(() => {
  if (props.stack) {
    return {
      position: 'relative',
    }
  }

  const step = itemWidth.value + props.gap
  let translateX = isDragging.value ? currentTranslate.value : -(displayIndex.value * step)
  return {
    transform: `translateX(${translateX}px)`,
    transition: isDragging.value
      ? 'none'
      : 'transform 0.4s ease, opacity 0.3s ease',
    display: 'flex',
    gap: `${props.gap}px`
  }
})

const itemStyle = (index) => {
  if (props.stack) {
    if (!randomCache.has(index)) {
      const seed = props.gap
      const top = Math.floor(Math.random() * (seed + 1))
      const left = Math.floor(Math.random() * (seed + 1))
      randomCache.set(index, { top, left })
    }
    const { top, left } = randomCache.get(index)

    return {
      position: `${displayIndex.value === index ? 'unset' : 'absolute'}`,
      width: `${itemWidth.value - left}px`,
      paddingTop: `${top}px`,
      paddingLeft: `${left}px`,
      top: '0px',
      left: '0px',
      zIndex: displayIndex.value === index ? props.items.length : props.items.length - (index + 1)
    }
  } else {
    return {
      width: `${itemWidth.value}px`
    }
  }
}

// === Click dots, arrows ===
const next = async () => {
  if (isDragging.value) return

  const maxVisibleIndex = totalDots.value - 1
  const newIndex = currentIndex.value + 1

  if (props.infinite && newIndex > maxVisibleIndex) {
    displayIndex.value = 0
    currentIndex.value = 0
  } else {
    displayIndex.value = newIndex
    currentIndex.value = newIndex
  }

  await nextTick()
  updateVisibleItems()
}

const prev = async () => {
  if (isDragging.value) return

  const maxVisibleIndex = totalDots.value - 1
  const newIndex = currentIndex.value - 1

  if (props.infinite && newIndex < 0) {
    displayIndex.value = maxVisibleIndex
    currentIndex.value = maxVisibleIndex
  } else {
    displayIndex.value = newIndex
    currentIndex.value = newIndex
  }

  await nextTick()
  updateVisibleItems()
}

const goTo = async (index) => {
  const maxVisibleIndex = totalDots.value - 1

  if (props.infinite && index > maxVisibleIndex) {
    displayIndex.value = 0
    currentIndex.value = 0
  } else if (props.infinite && index < 0) {
    displayIndex.value = maxVisibleIndex
    currentIndex.value = maxVisibleIndex
  } else {
    displayIndex.value = index
    currentIndex.value = index
  }

  await nextTick()
  updateVisibleItems()
}

// Hover autoplay pending
const onMouseEnter = () => {
  stopAutoplay()
}
const onMouseLeave = () => {
  startAutoplay()
}

// === Drag & Swipe ===
const onMouseDown = (e) => {
  stopAutoplay()
  const target = e.target
  if (!props.draggable || target.closest('button, a, input, textarea, [role="button"]') || props.stack) return
  e.preventDefault()
  startDrag(e.clientX)
}
const onMouseUp = () => {
  if (isDragging.value) {
    onDragEnd()
    startAutoplay()
  }
}

const startDrag = (clientX) => {
  if (!props.draggable) return
  isDragging.value = true
  startX.value = clientX
  const step = itemWidth.value + props.gap
  const currentPosition = -(displayIndex.value * step)
  currentTranslate.value = currentPosition
  prevTranslate.value = currentPosition
}

const onDrag = (clientX) => {
  if (!isDragging.value) return
  const walk = (clientX - startX.value) * 2
  currentTranslate.value = prevTranslate.value + walk
}

const onDragEnd = async () => {
  if (!isDragging.value || props.stack) return
  isDragging.value = false

  const step = itemWidth.value + props.gap
  const currentPageFloat = -currentTranslate.value / step
  const nearestPage = Math.round(currentPageFloat)
  const maxPage = totalDots.value - 1
  let targetPage = Math.max(0, Math.min(nearestPage, maxPage))

  if (props.infinite && nearestPage > maxPage) {
    await resetToStart()
    targetPage = 0
  } else if (props.infinite && nearestPage < 0) {
    await resetToEnd()
    targetPage = maxPage
  }

  currentIndex.value = targetPage
  displayIndex.value = targetPage
  currentTranslate.value = 0
  prevTranslate.value = 0
}

const resetToStart = async () => {
  isResetting.value = true
  displayIndex.value = 0
  await nextTick()
  wrapper.value.style.transition = 'none'
  wrapper.value.style.transform = 'translateX(0px)'
  await nextTick()
  wrapper.value.style.transition = 'transform 0.4s ease, opacity 0.3s ease'
  isResetting.value = false
}

const resetToEnd = async () => {
  const maxPage = totalDots.value - 1
  const step = itemWidth.value + props.gap
  isResetting.value = true
  displayIndex.value = maxPage
  await nextTick()
  wrapper.value.style.transition = 'none'
  wrapper.value.style.transform = `translateX(-${maxPage * step}px)`
  await nextTick()
  wrapper.value.style.transition = 'transform 0.4s ease, opacity 0.3s ease'
  isResetting.value = false
}

const { lengthX } = useSwipe(wrapper, {
  onSwipe: () => props.draggable && onDrag(startX.value - lengthX.value),
  onSwipeEnd: () => props.draggable && onDragEnd(),
  passive: false
})

const onMouseMove = (e) => onDrag(e.clientX)

// === Autoplay ===
const startAutoplay = () => {
  if (props.autoplay) {
    autoplayTimer.value = setInterval(() => {
      goTo(currentIndex.value + 1)
    }, 5000)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer.value) clearInterval(autoplayTimer.value)
  autoplayTimer.value = null
}

// === Lifecycle ===
onMounted(() => {
  updateDimensions()
  currentIndex.value = 0
  startAutoplay()

  window.addEventListener('resize', updateDimensions)
  if (props.draggable) {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
  window.addEventListener('mouseenter', onMouseEnter)
  window.addEventListener('mouseleave', onMouseLeave)
})

watch([isMobile, isTablet, isDesktop], () => {
  nextTick(() => {
    updateDimensions()
    updateVisibleItems()
    const max = totalDots.value - 1
    currentIndex.value = Math.min(currentIndex.value, max)
  })
}, { immediate: true })

onUnmounted(() => {
  window.removeEventListener('resize', updateDimensions)
  if (props.draggable) {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }
  window.removeEventListener('mouseenter', onMouseEnter)
  window.removeEventListener('mouseleave', onMouseLeave)
  stopAutoplay()
})
</script>
