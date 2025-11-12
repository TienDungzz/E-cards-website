<template>
    <div class="input-field d-flex flex-column">
        <label v-if="label" class="label"> {{ label }} <span v-if="required" class="required">*</span> </label>

        <template v-if="type === 'timezone'">
            <select
                :id="id"
                :name="name"
                :value="value"
                @change="handleInput"
                @blur="handleBlur"
                :class="required && touched ? (valid ? 'valid' : 'error') : ''"
                class="input"
            >
                <option value="" disabled>{{ placeholder || 'Auto' }}</option>
                <option v-for="utc in utcOptions" :key="utc.value" :value="utc.value">
                    {{ utc.label }}
                </option>
            </select>
        </template>

        <template v-else-if="type === 'textarea'">
            <textarea
                :id="id"
                :type="type"
                :name="name"
                :value="value"
                @input="handleInput"
                @blur="handleBlur"
                :placeholder="placeholder"
                :class="required && touched ? (valid ? 'valid' : 'error') : ''"
                rows="4"
                class="input"
            />
        </template>

        <template v-else-if="type === 'image' || type === 'video'">
            <div
                class="input-media d-flex flex-column align-items-center justify-content-center gap-20"
                @dragover.prevent="handleDragOver"
                @drop.prevent="handleDrop"
                @click.stop="triggerFileInput"
            >
                <Icon :name="type" />
                <div class="placeholder">
                    <p class="text text-center">{{ t(`edit_page.input.${type}.placeholder`) }}</p>
                    <p class="text text-center">{{ t(`edit_page.input.${type}.second_placeholder`) }}</p>
                </div>
                <input
                    :id="id"
                    :name="name"
                    :value="value"
                    @change="handleChange"
                    type="file"
                    ref="inputHidden"
                    class="input"
                    :class="required && touched ? (valid ? 'valid' : 'error') : ''"
                    hidden
                    :accept="`${type}/*`"
                    :multiple="multiple"
                />
            </div>
        </template>

        <template v-else-if="type === 'audio'">
            <div
                class="input-audio d-flex flex-column align-items-center justify-content-center gap-20"
                @dragover.prevent="handleDragOver"
                @drop.prevent="handleDrop"
            >
                <div class="record-audio d-flex flex-column align-items-center justify-content-center gap-20">
                    <Icon name="mic" @click.stop="startRecording" :class="{ recording: isRecording }" />
                    <p class="text text-center">
                        {{ isRecording ? t('edit_page.input.audio.recording') : t('edit_page.input.audio.start') }}
                    </p>
                </div>
                <div class="divider"></div>
                <div
                    class="placeholder d-flex align-items-center justify-content-center gap-20"
                    @click.stop="triggerFileInput"
                >
                    <Icon name="upload" />{{ t('edit_page.input.audio.upload') }}
                </div>
                <input
                    :id="id"
                    :name="name"
                    :value="value"
                    @change="handleChange"
                    type="file"
                    ref="inputHidden"
                    class="input"
                    :class="required && touched ? (valid ? 'valid' : 'error') : ''"
                    hidden
                    :accept="`${type}/*`"
                    :multiple="multiple"
                />
            </div>
        </template>

        <template v-else-if="type === 'radio'">
            <div class="input-radio">
                <div class="radio-item d-flex align-items-center" v-for="(item, index) in radioItems" :key="item.value">
                    <input
                        :id="name + item.value"
                        :key="index"
                        :name="name"
                        :value="item.value"
                        @change="handleChange"
                        :checked="index === 0"
                        :class="required && touched ? (valid ? 'valid' : 'error') : ''"
                        type="radio"
                        class="input"
                    />
                    <label v-if="item.label" :for="name + item.value" class="label">{{ item.label }}</label>
                </div>
            </div>
        </template>

        <template v-else-if="type === 'hex-color'">
            <div class="input-hex">
                <input
                    :id="id"
                    :name="name"
                    :value="value || defaultColor"
                    @change="handleChange"
                    :class="required && touched ? (valid ? 'valid' : 'error') : ''"
                    type="color"
                    class="input"
                    alpha
                />
            </div>
        </template>

        <template v-else>
            <input
                :id="id"
                :type="type"
                :name="name"
                :value="value"
                @input="handleInput"
                @blur="handleBlur"
                :placeholder="placeholder"
                :class="required && touched ? (valid ? 'valid' : 'error') : ''"
                class="input"
            />
        </template>

        <p v-if="info" class="info">{{ info }}</p>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, watch, onMounted, inject, nextTick, computed } from 'vue'
import { useEditCardStore } from '@/stores/edit-card.js'
import Icon from '@/components/blocks/Icon.vue';

const { t } = useI18n();

const props = defineProps({
  label: String,
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text',
    validator: (v) => ['text', 'email', 'date', 'file', 'image', 'timezone', 'video', 'audio', 'radio', 'hex-color'].includes(v)
  },
  placeholder: String,
  info: String,
  required: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  radioItems: Array,
  defaultColor: String,
  function: {
    type: Function
  }
})

const touched = ref(false)
const error = ref(false)
const valid = ref(props.required ? false : true)
const value = ref(null)
const utcOptions = ref([])
const inputHidden = ref(null)
const isRecording = ref(false)
const isDragging = ref(false)
const mediaRecorder = ref(null)
const audioChunks = ref([])

const store = useEditCardStore()
const formContext = inject('formContext')
const formId = formContext?.formId || 'global-form'

onMounted(() => {
  nextTick(() => {
    register()
  })
  const options = []
  for (let i = -12; i <= 14; i++) {
    const sign = i >= 0 ? '+' : ''
    const hours = String(Math.abs(i)).padStart(2, '0')
    const label = `UTC${sign}${hours}:00`
    const value = `${sign}${hours}:00`
    options.push({ label, value })
  }
  utcOptions.value = options
})

const validators = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(value.replace(/\s/g, '')),
  text: (value) => value.trim().length > 0,
  timezone: (value) => timezones.value.includes(value),
  default: () => true
}

const handleInput = (e) => {
  value.value = e.target.value
  touched.value = false
}

const handleBlur = (e) => {
  const value = e.target.value
  touched.value = true
  validate(value)
  register()
}

const handleClick = (e) => {
  inputHidden.value.click()
}

const handleChange = (e) => {
  const target = e.target
  touched.value = true

  if (!target) return
  const type = target.getAttribute('type')

  if (['file', 'image', 'video', 'audio'].includes(type)) {
    const files = target.files
    if (!files || !files.length) {
      value.value = null
      valid.value = false
      return
    }
    value.value = files
    valid.value = true
    props.function?.(files)
  } else if (type === 'color') {
    const name = target.getAttribute('name')
    const colorValue = target.value

    let finalValue = colorValue
    if (colorValue.length === 9) {
      const r = parseInt(colorValue.slice(1, 3), 16)
      const g = parseInt(colorValue.slice(3, 5), 16)
      const b = parseInt(colorValue.slice(5, 7), 16)
      const a = (parseInt(colorValue.slice(7, 9), 16) / 255).toFixed(2)
      finalValue = `rgba(${r}, ${g}, ${b}, ${a})`
    }

    value.value = finalValue
    valid.value = !!colorValue
    props.function?.(name, finalValue)
    register()
  } else if (type === 'radio') {
    value.value = target.value
    valid.value = !!target.value
    register()
  }
}

const validate = (value) => {
  if (!props.name) return
  if (!props.required) {
    valid.value = true
    return
  }
  if (!value?.trim()) {
    valid.value = false
    return
  }
  const validator = validators[props.type] || validators.default
  valid.value = validator(value)
}

//Audio
const startRecording = async () => {
  if (isRecording.value) {
    stopRecording()
    return
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.value = new MediaRecorder(stream)
    audioChunks.value = []

    mediaRecorder.value.ondataavailable = (e) => {
      audioChunks.value.push(e.data)
    }

    mediaRecorder.value.onstop = () => {
      const blob = new Blob(audioChunks.value, { type: 'audio/webm' })
      const file = new File([blob], `recording_${Date.now()}.webm`, { type: 'audio/webm' })
      const url = URL.createObjectURL(blob)

      props.function([file])
      register()
      stream.getTracks().forEach(track => track.stop())
    }

    mediaRecorder.value.start()
    isRecording.value = true
  } catch (err) {
    alert('Microphone access denied or not available.')
    console.error(err)
  }
}

const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    isRecording.value = false
  }
}

// === 2. UPLOAD FILE ===
const triggerFileInput = () => {
  inputHidden.value.click()
}

// === 3. DRAG & DROP ===
const handleDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDrop = (e) => {
  isDragging.value = false
  const files = e.dataTransfer.files
  if (!files || files.length === 0) return

  const file = files[0]
  const mimePrefix = file.type.split('/')[0] // 'image', 'video', 'audio'

  const validTypes = {
    image: 'image',
    video: 'video',
    audio: 'audio'
  }

  if (validTypes[props.type] && mimePrefix !== validTypes[props.type]) {
    const typeName = props.type === 'image' ? 'image' : props.type === 'video' ? 'video' : 'audio'
    alert(`Please drop a valid ${typeName} file.`)
    return
  }

  props.function(files)
  register()
}

const register = () => {
  const fieldData = {
    value: value.value,
    valid: valid.value,
    required: props.required,
    touched: touched.value
  }
  if (formContext) {
    formContext.registerField(props.name, fieldData)
  } else {
    store.registerField(formId, props.name, fieldData)
  }
}
</script>
