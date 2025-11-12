<!-- components/blocks/AudioPreview.vue -->
<template>
    <div class="audio-container">
        <div class="audio-player">
            <div v-if="audio" class="audio-player-simple d-flex align-items-center gap-12">
                <div class="play-btn-wrapper">
                    <div class="progress-ring" :style="{ '--progress': progressPercent }">
                        <div class="progress-mask"></div>
                        <div class="progress-fill"></div>
                    </div>
                    <button class="play-btn" @click="togglePlay">
                        <Icon :name="isPlaying ? 'pause' : 'play'" />
                    </button>
                </div>

                <div class="file-info d-flex flex-column gap-8">
                    <span class="file-name">{{ audio.name }}</span>
                    <span class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
                </div>

                <Icon name="close" @click="$emit('remove')" />
            </div>

            <!-- Không có audio -->
            <div v-else class="preview-empty p-20">
                <p class="text-muted">{{ emptyText }}</p>
            </div>

            <!-- Audio element (ẩn) -->
            <audio
                v-if="audio"
                ref="audioElement"
                :src="audio.url"
                @timeupdate="onTimeUpdate"
                @ended="onEnded"
                @loadedmetadata="onLoadedMetadata"
            ></audio>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Icon from '@/components/blocks/Icon.vue'

const props = defineProps({
  audio: Object,
  emptyText: { type: String, default: 'No audio uploaded yet.' }
})
const emit = defineEmits(['remove'])

const audioElement = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// === Progress % ===
const progressPercent = computed(() => {
  if (!duration.value) return 0
  return Math.min((currentTime.value / duration.value) * 100, 100)
})

// === Events ===
const onLoadedMetadata = () => { duration.value = audioElement.value.duration }
const onTimeUpdate = () => { currentTime.value = audioElement.value.currentTime }
const onEnded = () => { isPlaying.value = false }

// === Play / Pause ===
const togglePlay = () => {
  isPlaying.value ? audioElement.value.pause() : audioElement.value.play()
  isPlaying.value = !isPlaying.value
}

// === Format time ===
const formatTime = (s) => {
  if (!s) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

watch(() => props.audio, () => {
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
})
</script>
