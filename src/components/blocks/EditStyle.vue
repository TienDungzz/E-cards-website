<template>
    <div class="block w-100">
        <div class="block-heading mb-20">
            <h2>{{t('edit_page.page_style.title')}}</h2>
        </div>
        <div class="block-content d-grid  grid-1 grid-m-2 gap-30">
            <div class="form-wrapper d-flex flex-column gap-20">
                <div class="input-row">
                    <InputField
                        :name="'type'"
                        :type="'radio'"
                        :label="t('edit_page.page_style.type.label')"
                        :radio-items="cardType"
                    />
                </div>
                <div class="input-row">
                    <InputField
                        :name="'style'"
                        :type="'radio'"
                        :label="t('edit_page.page_style.style.label')"
                        :radio-items="cardStyle"
                    />
                </div>
            </div>
            <div class="preview-wrapper">
                <div class="form-wrapper d-flex flex-column gap-20">
                    <div class="input-row">
                        <InputField
                            :name="'background_color'"
                            :type="'hex-color'"
                            :label="t('edit_page.page_style.background.label')"
                            :default-color="'#ffffff'"
                            :function="reflectColor"
                        />
                    </div>
                    <div class="input-row">
                        <InputField
                            :name="'heading_color'"
                            :type="'hex-color'"
                            :label="t('edit_page.page_style.heading_color.label')"
                            :function="reflectColor"
                        />
                        <InputField
                            :name="'text_color'"
                            :type="'hex-color'"
                            :label="t('edit_page.page_style.text_color.label')"
                            :function="reflectColor"
                        />
                    </div>
                </div>

                <p class="preview-heading pt-40">Preview</p>

                <div class="preview-content">
                    <div class="preview-color p-30" ref="viewWrapper" data-reflect="background_color">
                        <h1 data-reflect="heading_color">Heading</h1>
                        <p data-reflect="text_color">paragraph</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { provide, ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEditCardStore } from '@/stores/edit-card.js'

import InputField from '@/components/blocks/InputField.vue'
import Icon from '@/components/blocks/Icon.vue'
import ImageResponsive from '@/components/blocks/ImageResponsive.vue'

const { t } = useI18n()
const store = useEditCardStore()
const viewWrapper = ref(null)

const formId = 'card-style'
provide('formContext', {
  formId,
  registerField: (name, data) => store.registerField(formId, name, data)
})

const cardType = [
    {label: 'Birthday', value: 1},
    {label: 'Weding', value: 2},
    {label: 'Lunar new year', value: 3},
    {label: 'Halloween', value: 4}
]
const cardStyle = [
    {label: 'Scroll down', value: 1},
    {label: 'Slider', value: 2},
    {label: 'FlipBook', value: 3},
    {label: 'Mansory', value: 4}
]

const reflectColor = (target, value) => {
    const $el = document.querySelector(`[data-reflect="${target}"]`)

    if (target === 'background_color') {
        $el.style.backgroundColor = value;
    } else {
        $el.style.color = value;
    }
}
</script>
