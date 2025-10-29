<template>
    <div ref="container" class="masonry-container" :class="`type-${type}`" :style="containerStyle">
        <!-- BENTO LAYOUT -->
        <template v-if="type === 'bento'">
            <div
                v-for="item in bentoItems"
                :key="item.id"
                class="masonry-item"
                :style="{gridColumn: item.isFirstRow ? 'auto' : `span ${item.colSpan}`,aspectRatio: `${item.ratioWidth} / ${item.ratioHeight}`}"
            >
                <slot :item="item" :index="item.id">
                    <div class="demo-block" :style="{ backgroundColor: item.color }">
                        <span class="demo-label">{{ item.id }}</span>
                    </div>
                </slot>
            </div>
        </template>

        <!-- FLEX LAYOUT: Absolute -->
        <template v-else-if="type === 'flex'">
            <div
                v-for="(item, index) in positionedItems"
                :key="index"
                class="masonry-item"
                :style="{position: 'absolute',left: `${item.left}px`,top: `${item.top}px`,width: `${item.scaledWidth}px`,height: `${item.scaledHeight}px`}"
            >
                <slot :item="item" :index="index">
                    <div class="demo-block" :style="{ backgroundColor: item.color }">
                        <span class="demo-label">{{ index }}</span>
                    </div>
                </slot>
            </div>
        </template>

        <!-- IMAGES LAYOUT: Rows -->
        <template v-else-if="type === 'images'">
            <div v-for="(row, rowIndex) in imageRows" :key="rowIndex" class="masonry-row">
                <div v-for="item in row" :key="item.id" class="masonry-item" :style="getImageItemStyle(item, row)">
                    <slot :item="item.original" :index="item.id">
                        <div class="demo-block" :style="{ backgroundColor: item.color }">
                            <span class="demo-label">{{ item.id }}</span>
                        </div>
                    </slot>
                </div>
            </div>
        </template>

        <!-- DEFAULT & OTHER -->
        <template v-else>
            <div v-for="(item, index) in items" :key="item.id" class="masonry-item" :style="getDefaultItemStyle(item)">
                <slot :item="item" :index="item.id">
                    <div class="demo-block" :style="{ backgroundColor: item.color }">
                        <span class="demo-label">{{ index }}</span>
                    </div>
                </slot>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useBreakpoints } from '@vueuse/core'

// Props
const props = defineProps({
  items: { type: Array, required: true },
  type: {
    type: String,
    default: 'pinterest',
    validator: (v) => ['flex', 'grid', 'images', 'pinterest', 'bento'].includes(v)
  },
  gap: { type: Number, default: 16 },
  relativeHeight: { type: Number, default: 150 },
  maxWidth: { type: Number, default: 300 },
  columns: {
    type: [Number, Object],
    default: () => ({ mobile: 1, tablet: 2, desktop: 3 })
  },
  cellSize: { type: Number, default: 120 }
})

// === Breakpoints ===
const customBreakpoints = { sm: 576, md: 768, lg: 1024, xl: 1280 }
const breakpoints = useBreakpoints(customBreakpoints)
const isMobile = breakpoints.smaller('sm')
const isTablet = breakpoints.between('sm', 'lg')
const isDesktop = breakpoints.greaterOrEqual('lg')

const currentColumns = computed(() => {
  let input = props.columns

  if (typeof input === 'number') {
    if (isMobile.value) return Math.min(input, 2)
    if (isTablet.value) return Math.min(input, 4)
    return input
  }
  if (typeof input === 'object' && input !== null) {
    if (isMobile.value) return Math.min(input.mobile ?? 1, 2)
    if (isTablet.value) return Math.min(input.tablet ?? 2, 4)
    return input.desktop ?? 3
  }

  return isMobile.value ? 1 : isTablet.value ? 2 : 3
})

// Stats
const container = ref(null)
const containerWidth = ref(0)
const positionedItems = ref([])
const bentoItems = ref([])

// === Container ===
const updateWrapper = () => {
  if (container.value) {
    containerWidth.value = container.value.clientWidth
  }
}
const containerStyle = computed(() => ({
  '--columns': currentColumns.value,
  '--gap': `${props.gap}px`,
  '--item-height': `${props.relativeHeight}px`,
  position: props.type === 'flex' ? 'relative' : 'static',
  minHeight: props.type === 'flex' ? '1500px' : 'auto'
}))

// === Bento ===
const updateBento = () => {
  if (props.type !== 'bento' || !container.value) return

  const width = container.value.clientWidth
  containerWidth.value = width
  const gap = parseFloat(props.gap)
  const firstRowCount = Math.min(currentColumns.value, props.items.length)

  // Tính width chính xác cho mỗi item hàng đầu
  const totalGaps = (firstRowCount - 1) * gap
  const columnWidth = (width - totalGaps) / firstRowCount

  bentoItems.value = props.items.map((item, i) => {
    if (!item.width || !item.height) return null

    const isFirstRow = i < firstRowCount
    let ratioWidth, ratioHeight, colSpan = 1

    if (isFirstRow) {
      // 3 item đầu: full width cột, giữ tỉ lệ
      ratioWidth = columnWidth
      ratioHeight = columnWidth * (item.height / item.width)
    } else {
      // Các item sau: dùng cùng columnWidth
      const targetWidth = columnWidth
      const scale = targetWidth / item.width
      ratioWidth = targetWidth
      ratioHeight = item.height * scale
      colSpan = 1
    }

    return {
      ...item,
      id: i + 1,
      isFirstRow,
      ratioWidth,
      ratioHeight,
      colSpan
    }
  }).filter(Boolean)
}

// === Flex ===
const getOrientation = (item) => {
  if (!item.width || !item.height) return 'square'
  const ratio = item.width / item.height
  if (ratio > 1.125) return 'landscape'
  if (ratio < 0.875) return 'portrait'
  return 'square'
}

const placeFirstRow = (firstRow, scaleFirst, maxItemWidth, gap, columnLefts, columnTops, positionedItems) => {
  let curX = 0
  firstRow.forEach((item, i) => {
    const baseW = Math.min(item.width, maxItemWidth)
    const w = baseW * scaleFirst
    const h = item.height * (w / baseW)  // Giữ aspect ratio

    columnLefts[i] = curX
    positionedItems.push({ ...item, id: i, scaledWidth: w, scaledHeight: h, left: curX, top: 0 })
    columnTops[i] = h
    curX += w + gap
  })
}

const findMinColumn = (columnTops, columns) => {
  let minCol = 0
  let minTop = columnTops[0]
  for (let c = 1; c < columns; c++) {
    if (columnTops[c] < minTop) {
      minTop = columnTops[c]
      minCol = c
    }
  }
  return minCol
}

const getColWidth = (minCol, columns, columnLefts, containerWidth, gap) => {
  return minCol === columns - 1
    ? containerWidth - columnLefts[minCol]
    : columnLefts[minCol + 1] - columnLefts[minCol] - gap
}

const placePair = (idx, items, maxItemWidth, gap, colLeft, baseTop, colWidth, positionedItems, columnTops, minCol) => {
  const item1 = items[idx]
  const item2 = items[idx + 1]
  const w1Base = Math.min(item1.width, maxItemWidth)
  const w2Base = Math.min(item2.width, maxItemWidth)
  const totalBase = w1Base + w2Base
  const available = colWidth - gap

  const scaleW = available / totalBase
  const h1 = item1.height * scaleW
  const h2 = item2.height * scaleW
  const targetH = Math.max(h1, h2)

  const s1 = targetH / item1.height
  const s2 = targetH / item2.height
  let w1 = w1Base * s1
  let w2 = w2Base * s2
  let finalH = targetH

  if (w1 + w2 > available) {
    const fix = available / (w1 + w2)
    w1 *= fix
    w2 *= fix
    finalH *= fix
  }

  positionedItems.push(
    { ...item1, id: idx, scaledWidth: w1, scaledHeight: finalH, left: colLeft, top: baseTop },
    { ...item2, id: idx + 1, scaledWidth: w2, scaledHeight: finalH, left: colLeft + w1 + gap, top: baseTop }
  )
  columnTops[minCol] = baseTop + finalH
  return true  // Placed
}

const placeTriplePortraitLandscape = (idx, items, orientations, maxItemWidth, gap, colLeft, baseTop, colWidth, positionedItems, columnTops, minCol) => {
  const pRelIdx = orientations.indexOf('portrait')
  const pIdx = idx + pRelIdx
  const lRelIndices = orientations.map((o, i) => o === 'landscape' ? i : -1).filter(i => i !== -1)
  const l1Idx = idx + lRelIndices[0]
  const l2Idx = idx + lRelIndices[1]

  const p = items[pIdx]
  const l1 = items[l1Idx]
  const l2 = items[l2Idx]

  const pW = Math.min(p.width, maxItemWidth)
  const pH = p.height
  const l1W = Math.min(l1.width, maxItemWidth)
  const l1H = l1.height
  const l2W = Math.min(l2.width, maxItemWidth)
  const l2H = l2.height

  const p_ar = pH / pW
  const l1_ar = l1H / l1W
  const l2_ar = l2H / l2W
  const s = l1_ar + l2_ar

  const g = gap
  const numerator = p_ar * (colWidth - g) - g
  let lW_final = 0
  let pW_final = 0
  let blockH = 0

  if (numerator > 0) {
    lW_final = numerator / (p_ar + s)
    pW_final = colWidth - lW_final - g
    if (pW_final > 0 && lW_final > 0) {
      blockH = p_ar * pW_final
      const finalL1H = l1_ar * lW_final
      const finalL2H = l2_ar * lW_final

      const isLeftPortrait = orientations[0] === 'portrait'
      let pLeft = colLeft
      let rightX = colLeft + pW_final + g
      if (!isLeftPortrait) {
        pLeft = colLeft + lW_final + g
        rightX = colLeft
      }

      positionedItems.push(
        { ...p, id: pIdx, scaledWidth: pW_final, scaledHeight: blockH, left: pLeft, top: baseTop },
        { ...l1, id: l1Idx, scaledWidth: lW_final, scaledHeight: finalL1H, left: rightX, top: baseTop },
        { ...l2, id: l2Idx, scaledWidth: lW_final, scaledHeight: finalL2H, left: rightX, top: baseTop + finalL1H + g }
      )

      columnTops[minCol] = baseTop + blockH
      return true  // Handled
    }
  }
  return false
}

const placeTripleSquares = (idx, items, gap, colLeft, baseTop, colWidth, positionedItems, columnTops, minCol) => {
  const itemSize = (colWidth - gap * 2) / 3
  items.slice(idx, idx + 3).forEach((item, i) => {
    positionedItems.push({
      ...item,
      id: idx + i,
      scaledWidth: itemSize,
      scaledHeight: itemSize,
      left: colLeft + i * (itemSize + gap),
      top: baseTop,
    })
  })
  columnTops[minCol] = baseTop + itemSize
  return true  // Handled
}

const placeSingle = (idx, items, maxItemWidth, colLeft, baseTop, colWidth, positionedItems, columnTops, minCol) => {
  const item = items[idx]
  const baseW = Math.min(item.width, maxItemWidth)
  const scale = colWidth / baseW
  const h = item.height * scale

  positionedItems.push({
    ...item,
    id: idx,
    scaledWidth: colWidth,
    scaledHeight: h,
    left: colLeft,
    top: baseTop,
  })
  columnTops[minCol] = baseTop + h
}

const updateFlexLayout = () => {
  if (!container.value || props.type !== 'flex') return
  positionedItems.value = []

  const gap = props.gap
  const maxItemWidth = props.maxWidth
  const columns = Math.max(1, currentColumns.value)
  const containerWidth = container.value.clientWidth

  const firstRow = props.items.slice(0, columns)
  const totalBaseWidth = firstRow.reduce((s, it) => s + Math.min(it.width, maxItemWidth), 0)
  const totalGaps = gap * (columns - 1)
  const scaleFirst = totalBaseWidth > 0 ? (containerWidth - totalGaps) / totalBaseWidth : 1

  const columnTops = new Array(columns).fill(0)
  const columnLefts = new Array(columns).fill(0)

  placeFirstRow(firstRow, scaleFirst, maxItemWidth, gap, columnLefts, columnTops, positionedItems.value)

  let idx = columns
  while (idx < props.items.length) {
    const minCol = findMinColumn(columnTops, columns)
    const colLeft = columnLefts[minCol]
    const colWidth = getColWidth(minCol, columns, columnLefts, containerWidth, gap)
    const baseTop = columnTops[minCol] + (columnTops[minCol] > 0 ? gap : 0)

    let placed = false

    // GHÉP ĐÔI
    if (!placed && idx + 1 < props.items.length) {
      const ori1 = getOrientation(props.items[idx])
      const ori2 = getOrientation(props.items[idx + 1])
      if (ori1 === ori2 && ori1 !== 'square') {
        placed = placePair(idx, props.items, maxItemWidth, gap, colLeft, baseTop, colWidth, positionedItems.value, columnTops, minCol)
        if (placed) idx += 2
      }
    }

    // KHỐI 3 ITEMS
    if (!placed && idx + 2 < props.items.length && colWidth >= 220) {
      const tripleItems = props.items.slice(idx, idx + 3)
      if (tripleItems.length === 3) {
        const orientations = tripleItems.map(getOrientation)
        const portraitCount = orientations.filter(o => o === 'portrait').length
        const landscapeCount = orientations.filter(o => o === 'landscape').length
        const squareCount = orientations.filter(o => o === 'square').length

        let handled = false
        if (portraitCount === 1 && landscapeCount === 2 && squareCount === 0) {
          handled = placeTriplePortraitLandscape(idx, props.items, orientations, maxItemWidth, gap, colLeft, baseTop, colWidth, positionedItems.value, columnTops, minCol)
        } else if (squareCount === 3) {
          handled = placeTripleSquares(idx, props.items, gap, colLeft, baseTop, colWidth, positionedItems.value, columnTops, minCol)
        }
        if (handled) {
          idx += 3
          placed = true
        }
      }
    }

    // FALLBACK
    if (!placed) {
      placeSingle(idx, props.items, maxItemWidth, colLeft, baseTop, colWidth, positionedItems.value, columnTops, minCol)
      idx++
    }
  }

  nextTick(() => {
    if (!container.value) return
    const max = positionedItems.value.reduce((m, it) => Math.max(m, it.top + it.scaledHeight), 0)
    container.value.style.minHeight = `${max + 200}px`
  })
}

// === Items with ID (không mutate) ===
const itemsWithId = computed(() =>
  props.items.map((item, i) => ({
    ...item,
    id: item.id ?? i + 1
  }))
)

// === IMAGE ROWS: Tính scale 1 lần duy nhất ===
const imageRows = computed(() => {
  if (props.type !== 'images' || !containerWidth.value) return []

  const gap = parseFloat(props.gap) || 0
  const rowHeight = props.relativeHeight || 300
  const targetWidth = containerWidth.value
  const rows = []
  let currentRow = []

  itemsWithId.value.forEach((item) => {
    const aspectRatio = item.width && item.height ? item.width / item.height : 1
    const estimatedWidth = aspectRatio * rowHeight

    const currentTotal = currentRow.reduce((sum, it) => sum + it.estimatedWidth, 0)
    const totalGaps = currentRow.length > 0 ? currentRow.length * gap : 0
    const wouldExceed = currentTotal + estimatedWidth + totalGaps > targetWidth

    if (currentRow.length > 0 && wouldExceed) {
      rows.push(finalizeRow(currentRow, targetWidth, gap))
      currentRow = []
    }

    currentRow.push({
      ...item,
      estimatedWidth,
      aspectRatio
    })
  })

  if (currentRow.length > 0) {
    rows.push(finalizeRow(currentRow, targetWidth, gap))
  }

  return rows
})
const finalizeRow = (row, targetWidth, gap) => {
  const totalGaps = row.length > 1 ? (row.length - 1) * gap : 0
  const totalEstimated = row.reduce((sum, it) => sum + it.estimatedWidth, 0)
  const scale = totalEstimated > 0 ? (targetWidth - totalGaps) / totalEstimated : 1

  return row.map(item => {
    const finalWidth = item.estimatedWidth * scale
    const finalHeight = props.relativeHeight * scale

    return {
      ...item,
      finalWidth,
      finalHeight,
    }
  })
}
const getImageItemStyle = (item, row) => {
  if (props.type !== 'images') return {}

  return {
    width: `${item.finalWidth}px`,
    height: `${item.finalHeight}px`,
    flex: `0 0 ${item.finalWidth}px`
  }
}

// === Other style ===
const getDefaultItemStyle = (item) => {
  const base = {}

  switch (props.type) {
    case 'images':
      const ratio = item.width && item.height ? item.width / item.height : 1
      const estimatedHeight = props.relativeHeight
      const estimatedWidth = ratio * estimatedHeight
      const scale = row ? getRowScale(row) : 1
      const finalHeight = estimatedHeight * scale
      const finalWidth = estimatedWidth * scale
      return {
        ...base,
        width: `${finalWidth}px`,
        height: `${finalHeight}px`,
        flex: `0 0 ${finalWidth}px`
      }

    case 'grid':
      return {
        ...base,
        aspectRatio: '1 / 1',
        width: '100%'
      }

    case 'pinterest':
      return {
        ...base,
        width: '100%',
        height: item.height ? `${item.height}px` : 'auto'
      }

    default:
      return base
  }
}

// === Life cycle ===
onMounted(() => {
  nextTick(() => {
    updateWrapper()
    if (props.type === 'flex') {
      updateFlexLayout()
    } else if (props.type === 'bento') {
      updateBento()
    }
  })
  window.addEventListener('resize', () => {
    updateWrapper()
    if (props.type === 'flex') {
      updateFlexLayout()
    } else if (props.type === 'bento') {
      updateBento()
    }
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', updateWrapper)
  if (props.type === 'flex') {
    window.removeEventListener('resize', updateFlexLayout)
  } else if (props.type === 'bento') {
    window.removeEventListener('resize', updateBento)
  }
})
</script>
