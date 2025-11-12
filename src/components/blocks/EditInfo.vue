<template>
    <div class="block w-100">
        <div class="block-heading mb-20">
            <h2>{{t('edit_page.page_info.title')}}</h2>
        </div>
        <div class="form-wrapper d-flex flex-column gap-20">
            <div class="input-row">
                <InputField
                    :name="'your_name'"
                    :type="'text'"
                    :label="t('edit_page.page_info.your_name.label')"
                    :placeholder="t('edit_page.page_info.your_name.placeholder')"
                    :required="true"
                />

                <InputField
                    :name="'your_email'"
                    :type="'email'"
                    :label="t('edit_page.page_info.your_email.label')"
                    :placeholder="t('edit_page.page_info.your_email.placeholder')"
                    :required="true"
                />
            </div>
            <div class="input-row">
                <InputField
                    :name="'recipient_name'"
                    :type="'text'"
                    :label="t('edit_page.page_info.recipient_name.label')"
                    :placeholder="t('edit_page.page_info.recipient_name.placeholder')"
                    :info="t('edit_page.page_info.recipient_name.info')"
                    :required="true"
                />

                <InputField
                    :name="'recipient_email'"
                    :type="'email'"
                    :label="t('edit_page.page_info.recipient_email.label')"
                    :placeholder="t('edit_page.page_info.recipient_email.placeholder')"
                    :info="t('edit_page.page_info.recipient_email.info')"
                    :required="true"
                />
            </div>
            <div class="input-row">
                <InputField
                    :name="'schedule_delivery'"
                    :type="'date'"
                    :label="t('edit_page.page_info.schedule_delivery.label')"
                    :placeholder="t('edit_page.page_info.schedule_delivery.placeholder')"
                    :info="t('edit_page.page_info.schedule_delivery.info')"
                    :required="true"
                />

                <InputField
                    :name="'recipient_timezone'"
                    :type="'timezone'"
                    :label="t('edit_page.page_info.recipient_timezone.label')"
                    :placeholder="t('edit_page.page_info.recipient_timezone.placeholder')"
                    :info="t('edit_page.page_info.recipient_timezone.info')"
                />
            </div>
            <div class="input-row">
                <InputField
                    :name="'cover_message'"
                    :type="'textarea'"
                    :label="t('edit_page.page_info.cover_message.label')"
                    :placeholder="t('edit_page.page_info.cover_message.placeholder')"
                    :info="t('edit_page.page_info.cover_message.info')"
                />
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

const { t } = useI18n();
const store = useEditCardStore();

const formId = 'card-info'
provide('formContext', {
  formId,
  registerField: (name, data) => store.registerField(formId, name, data)
})
</script>
