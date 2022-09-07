<template>
    <div
        class="darkmode-slider cursor-pointer"
        :class="{ 'day': localStore.darkMode !== 'dark' }"
        @click="() => (localStore.darkMode = localStore.darkMode === 'dark' ? 'light' : 'dark')"
    >
        <div class="inner-slider" :class="{ 'sun': localStore.darkMode !== 'dark' }" />
    </div>
</template>

<script setup>
    import localStore from '@/store/local.store'
    import { computed } from 'vue'

    const props = defineProps({
        size: {
            type: Number,
            default: 0.9,
        },
    })

    const toggleWidthRatio = 4.5
    const toggleButtonRadiusRatio = 1.4
    const togglePaddingRatio = 0.5

    const toggleHeight = computed(
        () => `${props.size * (toggleButtonRadiusRatio + 2 * togglePaddingRatio)}rem`,
    )
    const toggleWidth = computed(() => `${props.size * toggleWidthRatio}rem`)
    const toggleButtonRadius = computed(() => `${props.size * toggleButtonRadiusRatio}rem`)
    const innerPadding = computed(() => `${props.size * togglePaddingRatio}rem`)

    const sunTopPadding = computed(() => `${props.size * 1.5 * togglePaddingRatio}rem`)
    const sunLeftPadding = computed(
        () => `${props.size * (toggleWidthRatio - toggleButtonRadiusRatio - togglePaddingRatio)}rem`,
    )
    const sunButtonRadius = computed(() => `${props.size * toggleButtonRadiusRatio * 0.75}rem`)

    const moonShadow = computed(
        () => `${props.size * 1.5}em ${props.size * 1.25}em 0 0 #d9fbff inset, rgb(255 255 255 / 10%) 0 -${
            props.size * 3.5
        }em 0 -${props.size * 2.25}em,
            rgb(255 255 255 / 10%) ${props.size * 2}em ${props.size * 3.5}em 0 -${
            props.size * 2.25
        }em, rgb(255 255 255 / 10%) ${props.size * 1}em ${props.size * 6.5}em 0 -${props.size * 2}em,
            rgb(255 255 255 / 10%) ${props.size * 3}em ${props.size * 1}em 0 -${
            props.size * 2.05
        }em, rgb(255 255 255 / 10%) ${props.size * 4}em ${props.size * 4}em 0 -${props.size * 2.25}em,
            rgb(255 255 255 / 10%) ${props.size * 3}em ${props.size * 6.5}em 0 -${
            props.size * 2.25
        }em, rgb(255 255 255 / 10%) -${props.size * 2}em ${props.size * 3.5}em 0 -${props.size * 2.25}em,
            rgb(255 255 255 / 10%) -${props.size * 0.5}em ${props.size * 5}em 0 -${props.size * 2.25}em`,
    )

    const sunShadow = computed(
        () => `${props.size * 1.5}em ${props.size * 1.5}em 0 ${props.size * 2.5}em #fff inset, 0 -${
            props.size * 2.5
        }em 0 -${props.size * 1.35}em #fff, ${props.size * 1.75}em -${props.size * 1.75}em 0 -${
            props.size * 1.5
        }em #fff,
        ${props.size * 2.5}em 0 0 -${props.size * 1.35}em #fff, ${props.size * 1.75}em ${
            props.size * 1.75
        }em 0 -${props.size * 1.5}em #fff, 0 ${props.size * 2.5}em 0 -${props.size * 1.35}em #fff, -${
            props.size * 1.75
        }em ${props.size * 1.75}em 0 -${props.size * 1.5}em #fff,
            -${props.size * 2.5}em 0 0 -${props.size * 1.35}em #fff, -${props.size * 1.75}em -${
            props.size * 1.75
        }em 0 -${props.size * 1.5}em #fff`,
    )
</script>

<style>
    /* stylelint-disable function-no-unknown */
    /* stylelint-disable value-keyword-case */
    .darkmode-slider {
        position: relative;
        width: v-bind(toggleWidth);
        height: v-bind(toggleHeight);

        /* change size of toggle with font-size */
        font-size: 30%;
        background: #423966;
        border-radius: v-bind(toggleHeight);
        transition: all 300ms ease-in-out;
    }

    .day {
        background: #ffc629;
    }

    .inner-slider {
        position: absolute;
        top: v-bind(innerPadding);
        left: v-bind(innerPadding);
        display: block;
        width: v-bind(toggleButtonRadius);
        height: v-bind(toggleButtonRadius);
        background: #423966;
        border-radius: 50%;
        box-shadow: v-bind(moonShadow);
        transition: all 300ms ease-in-out;
        transform: rotate(-75deg);
    }

    .sun {
        top: v-bind(sunTopPadding);
        left: v-bind(sunLeftPadding);
        width: v-bind(sunButtonRadius);
        height: v-bind(sunButtonRadius);
        background: #fff;
        box-shadow: v-bind(sunShadow);
        transform: rotate(0deg);
    }
</style>
