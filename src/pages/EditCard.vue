<template>
    <section class="page pt-40 pb-40">
        <div class="container">
            <div class="page-heading">
                <h1 class="title">{{ t('edit_page.page_title') }}</h1>
                <p class="desc">{{ t('edit_page.page_desc') }}</p>
            </div>
            <div class="page-content d-flex gap-12 gap-m-24 gap-xl-40">
                <!-- Sidebar -->
                <div
                    class="sidebar-wrapper position-sticky t-0 d-flex flex-column p-30 gap-4"
                    :style="{ '--active-position': currentIndex }"
                    :class="{ 'collapse': collapse }"
                >
                    <Button
                        label="toggle sidebar"
                        :style="'secondary toggle-sidebar d-block d-xl-none'"
                        icon="plus"
                        @click="handleToggle"
                    />
                    <Button
                        v-for="(btn, index) in components"
                        :key="btn.icon"
                        :label="t(btn.label)"
                        :style="'secondary'"
                        :icon="btn.icon"
                        icon-pos="left"
                        @click="handleButtonClick(index)"
                        :class="{ 'active': index === currentIndex }"
                    />
                </div>

                <!-- Main Content -->
                <div class="main-content w-100">
                    <keep-alive>
                        <component :is="activeComponent" />
                    </keep-alive>

                    <div class="button-group mt-20 d-flex justify-content-between">
                        <Button
                            :label="t('edit_page.step.back')"
                            icon="arrow"
                            icon-pos="left"
                            class="prev"
                            v-show="currentIndex > 0"
                            @click="goTo"
                        />
                        <Button
                            :label="currentIndex === components.length - 1 ? t('edit_page.step.finish') : t('edit_page.step.next')"
                            :icon="currentIndex === components.length - 1 ? 'arrow' : 'arrow'"
                            :class="currentIndex === components.length - 1 ? 'finish' : 'next'"
                            @click="goTo"
                            :disabled="currentIndex < components.length - 1 && !isCurrentStepValid"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useEditCardStore } from '@/stores/edit-card'

import EditInfo from '@/components/blocks/EditInfo.vue'
import EditImage from '@/components/blocks/EditImage.vue'
import EditVideo from '@/components/blocks/EditVideo.vue'
import EditAudio from '@/components/blocks/EditAudio.vue'
import EditWishes from '@/components/blocks/EditWishes.vue'
import EditStyle from '@/components/blocks/EditStyle.vue'
import Button from '@/components/blocks/Button.vue'

import '@/assets/styles/edit-card.scss'

const { t } = useI18n()
const route = useRoute()
const cardID = route.params.cardID

const store = useEditCardStore()
const currentIndex = ref(0)
const collapse = ref(false)

// Danh sách các step
const components = [
  { id: 0, form:'card-info', label: 'edit_page.sidebar.about_your_card', icon: 'card', component: EditInfo },
  { id: 1, form:'card-photo', label: 'edit_page.sidebar.photo', icon: 'image', component: EditImage },
  { id: 2, form:'card-video', label: 'edit_page.sidebar.video', icon: 'video', component: EditVideo },
  { id: 3, form:'card-audio', label: 'edit_page.sidebar.audio', icon: 'mic', component: EditAudio },
  { id: 4, form:'card-wishes', label: 'edit_page.sidebar.send_wishes', icon: 'chat-heart', component: EditWishes },
  { id: 5, form:'card-style', label: 'edit_page.sidebar.choose_style', icon: 'palette', component: EditStyle }
]

// Component hiện tại
const activeComponent = computed(() => {
  const comp = components.find(c => c.id === currentIndex.value)
  return comp?.component || EditInfo
})

// Kiểm tra step hiện tại có hợp lệ không
const isCurrentStepValid = computed(() => {
  const formId = components[currentIndex.value].form
  return store.formValid(formId)
})

// Xử lý click sidebar
const handleButtonClick = (index) => {
  currentIndex.value = index
}

// Toggle sidebar (mobile)
const handleToggle = () => {
  collapse.value = !collapse.value
}

// Hàm điều hướng chính
const goTo = (e) => {
  const button = e.target.closest('button')
  const isPrev = button?.classList.contains('prev')
  const isFinish = button?.classList.contains('finish')

  let targetIndex

  if (isPrev) {
    targetIndex = Math.max(currentIndex.value - 1, 0)
  } else if (isFinish || currentIndex.value === components.length - 1) {
    if (!store.allValid) {
      const errorSteps = []

      components.forEach((item, index) => {
        const formId = item.form
        if (store.forms[formId] && !store.formValid(formId)) {
          errorSteps.push(index + 1)
        }
      })

      if (errorSteps.length > 0) {
        // Chuyển về trang lỗi đầu tiên
        const firstErrorIndex = Math.min(...errorSteps) - 1
        currentIndex.value = firstErrorIndex

        alert(`Vui lòng sửa lỗi ở trang: ${errorSteps.join(', ')}`)
        return
      }
    }

    // Tất cả hợp lệ
    alert('Tất cả thông tin đã hợp lệ! Đang gửi...')
    store.submit()
    return
  } else {
    targetIndex = Math.min(currentIndex.value + 1, components.length - 1)
  }

  currentIndex.value = targetIndex
}

// Đảm bảo mỗi step có formId riêng khi mount
onMounted(() => {
  components.forEach((_, index) => {
    const formId = components[index].form
    if (!store.forms[formId]) {
      store.$patch((state) => {
        state.forms[formId] = {}
      })
    }
  })
})
</script>
