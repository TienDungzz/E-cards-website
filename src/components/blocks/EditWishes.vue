<template>
    <div class="block w-100">
        <div class="block-heading mb-20">
            <h2>{{t('edit_page.page_wishes.title')}}</h2>
        </div>
        <div class="block-content d-grid grid-1 grid-m-2 gap-30">
            <div class="form-wrapper d-flex flex-column gap-20">
                <div class="input-row">
                    <div class="input-field">
                        <label for="wishes" class="label"> wishes <span class="required">*</span> </label>

                        <div id="editorjs" class="input" ref="editWrapper"></div>
                    </div>
                </div>
            </div>
            <div class="preview-wrapper">
                <p class="preview-heading">Preview</p>

                <div v-if="!hasData" class="preview-empty p-20 mt-10">
                    <p class="text-muted">No content uploaded yet.</p>
                </div>

                <div class="preview-content">
                    <div class="preview-editor p-20" ref="viewWrapper"></div>
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
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import EditorjsList from '@editorjs/list'
import LinkTool from '@editorjs/link'

import InputField from '@/components/blocks/InputField.vue'
import Icon from '@/components/blocks/Icon.vue'
import ImageResponsive from '@/components/blocks/ImageResponsive.vue'

const { t } = useI18n();
const store = useEditCardStore();
const editWrapper = ref(null)
const viewWrapper = ref(null)
const timeout = ref(null)
const hasData = ref(false)

const formId = 'card-wishes'
const name = 'wishes'

const editor = new EditorJS({
    holder: 'editorjs',
    autofocus: true,
    placeholder: 'Nhập lời chúc của bạn ở đây... ✨',
    tools: {
        header: {
            class: Header,
            inlineToolbar: ['link'],
            config: { placeholder: 'Tiêu đề' },
        },
        list: {
            class: EditorjsList,
            inlineToolbar: true,
        },
        linkTool: {
            class: LinkTool,
            config: {
                endpoint: 'https://api.linkpreview.net/?key=123456&q=',
            }
        }
    },
    onChange: () => {
        clearTimeout(timeout.value);
        timeout.value = setTimeout(async () => {
            let fieldData = {}
            const data = await editor.save();

            viewWrapper.value.innerHTML = renderHTML(data);

            if (data.blocks.length) {
                fieldData = {
                    value: data.blocks,
                    valid: true,
                    required: true
                }
            } else {
                fieldData = {
                    value: null,
                    valid: false,
                    required: false
                }
            }
            store.registerField(formId, name, fieldData)
        }, 1000);
    },
});

function renderHTML(data) {
    if (!data.blocks.length) hasData.value = false
    hasData.value = true

    return data.blocks.map(block => {
        switch (block.type) {
            case 'header':
            return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
            case 'paragraph':
            return `<p>${block.data.text}</p>`;
            case 'list':
            const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
            return `<${tag}>${block.data.items.map(i => `<li>${i}</li>`).join('')}</${tag}>`;
            default:
            return '';
    }}).join('');
}
</script>
