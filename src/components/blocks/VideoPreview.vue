<!-- VideoPreview.vue -->
<template>
    <div class="video-preview-container">
        <div v-if="video" class="video-container">
            <!-- Video -->
            <video
                ref="videoElement"
                :src="video.url"
                class="video-player"
                preload="metadata"
                @loadedmetadata="onLoadedMetadata"
                @timeupdate="onTimeUpdate"
                @click="togglePlayPause"
                @ended="onVideoEnded"
            ></video>

            <!-- Overlay -->
            <div
                class="overlay d-flex align-items-center justify-content-center"
                @mouseenter="showOverlay = true"
                @mouseleave="showOverlay = false"
            >
                <Icon name="close" :class="{ show: !isPlaying && showOverlay }" @click.stop="$emit('remove')" />
            </div>

            <!-- Custom Controls -->
            <div class="video-controls" :class="{ show: showControls }">
                <div class="controls-row d-flex align-items-center justify-content-between gap-12">
                    <Icon :name="isPlaying ? 'pause' : 'play'" @click.stop="togglePlayPause" />
                    <span class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
                    <div class="progress-container" @click.stop="seek($event)">
                        <div class="progress-bar">
                            <div class="progress-filled" :style="{ width: progress + '%' }"></div>
                            <div class="progress-handle" :style="{ left: progress + '%' }"></div>
                        </div>
                    </div>
                    <Icon :name="isMuted ? 'volume-mute' : 'volume'" class="volume-btn" @click.stop="toggleMute" />
                    <Icon name="fullscreen" @click.stop="toggleFullscreen" />
                </div>
            </div>
        </div>

        <!-- Không có video -->
        <div v-else class="preview-empty p-20">
            <p class="text-muted">{{ emptyText }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Icon from '@/components/blocks/Icon.vue'

const props = defineProps({
  video: { type: Object, default: null },
  emptyText: { type: String, default: 'No video uploaded yet.' }
})

const emit = defineEmits(['remove'])

const videoElement = ref(null)
const isPlaying = ref(false)
const showOverlay = ref(false)
const showControls = ref(true)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const volume = ref(75)
const isMuted = ref(false)

let controlsTimeout = null

// === Player Logic ===
const onLoadedMetadata = () => {
  duration.value = videoElement.value.duration
  volume.value = videoElement.value.volume * 100
}

const onTimeUpdate = () => {
  currentTime.value = videoElement.value.currentTime
  progress.value = (currentTime.value / duration.value) * 100 || 0
}

const togglePlayPause = () => {
  if (!videoElement.value) return
  isPlaying.value ? videoElement.value.pause() : videoElement.value.play()
  isPlaying.value = !isPlaying.value
}

const seek = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  videoElement.value.currentTime = percent * duration.value
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  videoElement.value.muted = isMuted.value
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    videoElement.value.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// === Auto hide controls ===
const showControlsTemporarily = () => {
  showControls.value = true
  clearTimeout(controlsTimeout)
  controlsTimeout = setTimeout(() => {
    if (isPlaying.value) showControls.value = false
  }, 1000)
}

const onVideoEnded = () => {
  isPlaying.value = false
  videoElement.value.currentTime = 0  // Tua về đầu
  progress.value = 0
}

watch(isPlaying, () => {
  if (isPlaying.value) showControlsTemporarily()
})

// Reset khi đổi video
watch(() => props.video, () => {
  isPlaying.value = false
  currentTime.value = 0
  progress.value = 0
  showControls.value = true
}, { immediate: true })

onUnmounted(() => clearTimeout(controlsTimeout))

// === Utils ===
const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>
