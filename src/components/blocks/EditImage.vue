<template>
    <div class="block w-100 d-flex flex-column gap-20">
        <div class="block-heading">
            <h2>{{t('edit_page.page_image.title')}}</h2>
        </div>
        <div class="block-content d-grid  grid-1 grid-m-2 gap-30">
            <div class="from-wrapper d-flex flex-column gap-20">
                <div class="input-row">
                    <InputField
                        ref="photoInput"
                        :name="'photo'"
                        :type="'image'"
                        :label="t('edit_page.page_image.upload_photo.label')"
                        :placeholder="t('edit_page.page_image.upload_photo.placeholder')"
                        :required="true"
                        :multiple="true"
                        :function="previewImages"
                    />
                </div>
                <div class="input-row">
                    <InputField
                        :name="'photo_caption'"
                        :type="'text'"
                        :label="t('edit_page.page_image.caption.label')"
                        :placeholder="t('edit_page.page_image.caption.placeholder')"
                        :info="t('edit_page.page_image.caption.info')"
                    />
                </div>
            </div>
            <div class="preview-wrapper">
                <p class="preview-heading">Preview</p>
                <div v-if="images.length" class="preview-content d-grid grid-3 gap-15">
                    <div
                        v-for="(item, index) in images"
                        :key="index"
                        class="preview-item"
                        :draggable="true"
                        @dragstart="handleDragStart($event, index)"
                        @dragover.prevent
                        @dragenter.prevent
                        @drop="handleDrop($event, index)"
                        @touchstart="handleTouchStart($event, index)"
                        @touchmove.prevent
                        @touchend="handleTouchEnd"
                    >
                        <img v-if="item.type.startsWith('image/')" :src="item.url" class="media" alt="Preview" />
                        <div class="overlay d-flex align-items-center justify-content-center">
                            <Icon name="close" @click="handleRemove(index)" />
                        </div>
                    </div>
                </div>

                <div v-else class="preview-empty p-20 mt-10">
                    <p class="text-muted">No photo uploaded yet.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { provide, ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEditCardStore } from '@/stores/edit-card.js'
import { v4 as uuidv4 } from 'uuid'
import InputField from '@/components/blocks/InputField.vue'
import Icon from '@/components/blocks/Icon.vue'
import ImageResponsive from '@/components/blocks/ImageResponsive.vue'

const { t } = useI18n();
const store = useEditCardStore();
const images = ref([])
const photoInput = ref(null)

const formId = 'card-photo'
provide('formContext', {
  formId,
  registerField: (name, data) => store.registerField(formId, name, data)
})

const previewImages = (files) => {
    const filePromises = Array.from(files).map(file => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => {
                resolve({
                    id: uuidv4(),
                    file,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: e.target.result
                });
            };
            reader.readAsDataURL(file);
        });
    });
    Promise.all(filePromises).then(results => {
        images.value.push(...results)
        updateInputValidation();
    });
}

const handleRemove = (index) => {
    images.value.splice(index, 1)
    updateInputValidation()
}

const updateInputValidation = () => {
    if (!photoInput.value?.$el) return;

    const $input = photoInput.value.$el.querySelector('input[type="file"]');
    if (!$input) return;

    const hasFiles = images.value.length > 0;

    $input.classList.toggle('valid', hasFiles);
    $input.classList.toggle('error', !hasFiles);

    $input.files - null
};

// Thêm vào cuối script
let draggedIndex = null

const handleDragStart = (e, index) => {
    draggedIndex = index
    e.dataTransfer.setData('text/plain', index)
    e.target.classList.add('dragging')
}

const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newImages = [...images.value]
    const [draggedItem] = newImages.splice(draggedIndex, 1)
    newImages.splice(dropIndex, 0, draggedItem)

    images.value = newImages
    draggedIndex = null
    updateFormPhotoField()
}

const handleTouchStart = (e, index) => {
    draggedIndex = index
    const touch = e.touches[0]
    touchStartX = touch.clientX
    touchStartY = touch.clientY
    e.target.classList.add('dragging')
}

const handleTouchEnd = (e) => {
    if (draggedIndex === null) return

    const touch = e.changedTouches[0]
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY)
    const dropItem = dropTarget?.closest('.preview-item')

    if (dropItem) {
        const dropIndex = Array.from(dropItem.parentNode.children).indexOf(dropItem)
        handleDrop({ preventDefault: () => {} }, dropIndex)
    }

    draggedIndex = null
    document.querySelectorAll('.preview-item').forEach(el => el.classList.remove('dragging'))
}

const updateFormPhotoField = () => {
    const files = images.value.map(img => img.file)
    store.registerField(formId, 'photo', {
        value: files,
        valid: files.length > 0
    })
}

// Cập nhật form khi images thay đổi
watch(images, () => {
    updateFormPhotoField()
}, { deep: true })
</script>
