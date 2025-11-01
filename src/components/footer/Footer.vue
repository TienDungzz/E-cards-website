<template>
    <footer class="footer-wrapper pt-40 pb-40">
        <div class="footer">
            <div class="container">
                <div class="footer-top d-flex gap-15 pb-40">
                    <div class="footer-col d-flex flex-column w-40 gap-30">
                        <div class="logo-wrapper">
                            <ImageResponsive
                                :imageName="'logo'"
                                :width="200"
                                :widths="[320, 400]"
                                :alt="'Logo E-cards website'"
                            />
                        </div>
                        <p class="footer-text">{{ t('footer.text') }}</p>
                        <div class="social-media d-flex gap-20">
                            <Icon name="facebook" />
                            <Icon name="youtube" />
                            <Icon name="instagram" />
                        </div>
                    </div>
                    <div class="footer-col d-flex flex-column w-20 gap-20">
                        <h3 class="footer-heading">{{ t('footer.company') }}</h3>
                        <a href="#" role="link" class="footer-link"
                            ><span class="text-underline">{{ t('footer.about') }}</span></a
                        >
                        <a href="#" role="link" class="footer-link"
                            ><span class="text-underline">{{ t('footer.contact') }}</span></a
                        >
                    </div>
                    <div class="footer-col d-flex flex-column w-20 gap-20">
                        <h3 class="footer-heading">{{ t('footer.product') }}</h3>
                        <a href="#" role="link" class="footer-link"
                            ><span class="text-underline">{{ t('footer.about') }}</span></a
                        >
                        <a href="#" role="link" class="footer-link"
                            ><span class="text-underline">{{ t('footer.contact') }}</span></a
                        >
                    </div>
                    <div class="footer-col d-flex flex-column w-20 gap-20">
                        <h3 class="footer-heading">{{ t('footer.blogs') }}</h3>
                        <a href="#" role="link" class="footer-link"
                            ><span class="text-underline">{{ t('footer.about') }}</span></a
                        >
                        <a href="#" role="link" class="footer-link"
                            ><span class="text-underline">{{ t('footer.contact') }}</span></a
                        >
                    </div>
                </div>
                <div class="footer-bottom d-flex justify-content-between pt-20">
                    <p class="footer-copyright">@Copyright</p>
                    <p class="footer-other-link d-flex gap-20">
                        <a href="#" role="link" class="footer-link"
                            ><span class="text-underline">{{ t('footer.privacy_policy') }}</span></a
                        ><a href="#" role="link" class="footer-link"
                            ><span class="text-underline">{{ t('footer.terms') }}</span></a
                        >
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import '@/assets/styles/footer.scss';
import ImageResponsive from '@/components/blocks/ImageResponsive.vue';
import Icon from '@/components/blocks/Icon.vue';

const { t } = useI18n();
</script>
