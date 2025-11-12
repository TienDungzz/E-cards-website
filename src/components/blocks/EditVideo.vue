<template>
    <div class="block w-100 d-flex flex-column gap-20">
        <div class="block-heading">
            <h2>{{ t('edit_page.page_video.title') }}</h2>
        </div>

        <div class="block-content d-grid grid-1 grid-m-2 gap-30">
            <!-- Upload Form -->
            <div class="form-wrapper d-flex flex-column gap-20">
                <div class="input-row">
                    <InputField
                        ref="videoInput"
                        :name="'video'"
                        :type="'video'"
                        :label="t('edit_page.page_video.upload_video.label')"
                        :placeholder="t('edit_page.page_video.upload_video.placeholder')"
                        :required="true"
                        :multiple="false"
                        :function="handleVideoUpload"
                    />
                </div>
                <div class="input-row">
                    <InputField
                        :name="'video_caption'"
                        :type="'text'"
                        :label="t('edit_page.page_video.caption.label')"
                        :placeholder="t('edit_page.page_video.caption.placeholder')"
                        :info="t('edit_page.page_video.caption.info')"
                    />
                </div>
            </div>

            <!-- Preview: Dùng component -->
            <div class="preview-wrapper">
                <p class="preview-heading">Preview</p>
                <div class="preview-content">
                    <VideoPreview :video="video" @remove="handleRemove" empty-text="No video uploaded yet." />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEditCardStore } from '@/stores/edit-card.js'
import { v4 as uuidv4 } from 'uuid'
import InputField from '@/components/blocks/InputField.vue'
import VideoPreview from '@/components/blocks/VideoPreview.vue' // Import

const { t } = useI18n()
const store = useEditCardStore()

const video = ref(null)
const videoInput = ref(null)

const formId = 'card-video'
provide('formContext', {
  formId,
  registerField: (name, data) => store.registerField(formId, name, data)
})

// === Upload ===
const handleVideoUpload = (files) => {
  if (!files || !files[0]) return
  const file = files[0]
  if (!file.type.startsWith('video/')) return

  const reader = new FileReader()
  reader.onload = (e) => {
    video.value = {
      id: uuidv4(),
      file,
      name: file.name,
      url: e.target.result
    }
    resetFileInput()
  }
  reader.readAsDataURL(file)
}

const resetFileInput = () => {
  if (videoInput.value?.$el) {
    const input = videoInput.value.$el.querySelector('input[type="file"]')
    if (input) input.value = ''
  }
}

// === Xóa ===
const handleRemove = () => {
  video.value = null
  resetFileInput()
}

// === Form Sync ===
const updateForm = () => {
  const file = video.value ? video.value.file : null
  store.registerField(formId, 'video', {
    value: file ? [file] : [],
    valid: !!file
  })
}

watch(video, updateForm, { deep: true })
onMounted(updateForm)
</script>
