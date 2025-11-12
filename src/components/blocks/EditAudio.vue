<template>
    <div class="block w-100 d-flex flex-column gap-20">
        <div class="block-heading">
            <h2>{{ t('edit_page.page_audio.title') }}</h2>
        </div>

        <div class="block-content d-grid grid-1 grid-m-2 gap-30">
            <!-- Upload Form -->
            <div class="form-wrapper d-flex flex-column gap-20">
                <div class="input-row">
                    <InputField
                        ref="audioInput"
                        :name="'audio'"
                        :type="'audio'"
                        :label="t('edit_page.page_audio.upload_audio.label')"
                        :placeholder="t('edit_page.page_audio.upload_audio.placeholder')"
                        :required="true"
                        :multiple="false"
                        :function="handleAudioUpload"
                    />
                </div>
                <div class="input-row">
                    <InputField
                        :name="'audio_caption'"
                        :type="'text'"
                        :label="t('edit_page.page_audio.caption.label')"
                        :placeholder="t('edit_page.page_audio.caption.placeholder')"
                    />
                </div>
            </div>

            <!-- Preview: Dùng component -->
            <div class="preview-wrapper">
                <p class="preview-heading">Preview</p>
                <div class="preview-content">
                    <AudioPreview :audio="audio" @remove="handleRemove" empty-text="No audio uploaded yet." />
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
import AudioPreview from '@/components/blocks/AudioPreview.vue'

const { t } = useI18n()
const store = useEditCardStore()

const audio = ref(null)
const audioInput = ref(null)

const formId = 'card-audio'
provide('formContext', {
  formId,
  registerField: (name, data) => store.registerField(formId, name, data)
})

// === Upload ===
const handleAudioUpload = (files) => {
  if (!files || !files[0]) return
  const file = files[0]
  if (!file.type.startsWith('audio/')) {
    alert('Please select a valid audio file.')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    audio.value = {
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
  if (audioInput.value?.$el) {
    const input = audioInput.value.$el.querySelector('input[type="file"]')
    if (input) input.value = ''
  }
}

// === Xóa ===
const handleRemove = () => {
  audio.value = null
  resetFileInput()
}

// === Form Sync ===
const updateForm = () => {
  const file = audio.value ? audio.value.file : null
  store.registerField(formId, 'audio', {
    value: file ? [file] : [],
    valid: !!file
  })
}

watch(audio, updateForm, { deep: true })
onMounted(updateForm)
</script>
