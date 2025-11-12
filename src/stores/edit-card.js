import { defineStore } from "pinia";

export const useEditCardStore = defineStore("edit-card", {
    // ==================== STATE ====================
    state: () => ({
        forms: {},
    }),

    // ==================== ACTIONS ====================
    actions: {
        registerField(formId, fieldName, data) {
            if (!this.forms[formId]) {
                this.$patch((state) => {
                    state.forms[formId] = {};
                });
            }
            this.$patch((state) => {
                state.forms[formId][fieldName] = { ...data };
            });

            // console.log(this.forms[formId]);
        },
        clearForm(formId) {
            this.$patch((state) => {
                delete state.forms[formId];
            });
        },
        resetAll() {
            this.$patch({ forms: {} });
        },
        submit() {
            console.log("form", this.forms);
        },
    },

    // ==================== GETTERS ====================
    getters: {
        formValid: (state) => (formId) => {
            const form = state.forms[formId];
            if (!form) return false;
            return Object.values(form).every((f) => f.valid);
        },

        formErrors: (state) => (formId) => {
            const form = state.forms[formId];
            if (!form) return [];
            return Object.entries(form)
                .filter(([, v]) => v.touched && v.error)
                .map(([k]) => `${k} không hợp lệ`);
        },

        allValid: (state) => {
            return Object.values(state.forms).every((form) => Object.values(form).every((f) => f.valid));
        },

        allErrors: (state) => {
            const errors = [];
            for (const form of Object.values(state.forms)) {
                for (const [fieldName, field] of Object.entries(form)) {
                    if (field.touched && field.error) {
                        errors.push(`${fieldName} không hợp lệ`);
                    }
                }
            }
            return errors;
        },
    },
});
