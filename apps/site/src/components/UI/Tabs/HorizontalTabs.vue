<template>
    <Swiper
        :modules="modules"
        navigation
        slides-per-view="auto"
        :space-between="20"
        class="my-3 w-full"
        @swiper="(s) => (swiper = s)"
    >
        <SwiperSlide v-for="(tab, i) in computedTabs" :key="i" class="!w-fit py-2">
            <div
                class="tab-swiper select-none"
                :class="tab.id === modelValue ? 'bg-0-alt text-0-alt' : 'bg-4 text-1 hover:brightness-125'"
                @click="setTab(tab, true)"
            >
                <i :class="`fas fa-${tab.icon}`" />
                <p class="title-font">{{ tab.name }}</p>
                <LabelSimple v-if="tab.amount || tab.amount === 0" bg-class="bg-gray-500/50">{{
                    abbrNumbers(tab.amount)
                }}</LabelSimple>
            </div>
        </SwiperSlide>
    </Swiper>
</template>

<script setup>
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'
    import { Swiper, SwiperSlide } from 'swiper/vue'

    import { Navigation } from 'swiper'

    import { computed, ref, watch } from 'vue'
    import { useRoute } from 'vue-router'

    import abbrNumbers from 'approximate-number'

    import { getCurrentPath } from '@/utils/routeUtils'
    import { showInfoToast } from '@/utils/toast.js'
    import { twColors } from '@/tailwind'

    const props = defineProps({
        backgroundVariant: {
            type: Number,
            default: 0,
        },
        tabs: {
            type: Object,
            default: () => {},
        },
        defaultTabId: {
            type: String,
            default: (props) =>
                Object.prototype.hasOwnProperty.call(props.tabs[0], 'tabs')
                    ? props.tabs[0].tabs[0].id
                    : props.tabs[0].id,
        },
        modelValue: {
            type: [String, null],
            required: true,
        },
        routeBase: {
            type: String,
            required: true,
        },
        routeName: {
            type: String,
            required: true,
        },
    })

    const getBg = (color) => ({
        left: `linear-gradient(to right, ${color.light} 20%, ${color.light}${
            color.light.length > 5 ? '0' : ''
        }0 80%)`,
        leftDark: `linear-gradient(to right, ${color.dark} 20%, ${color.dark}${
            color.dark.length > 5 ? '0' : ''
        }0 80%)`,
        right: `linear-gradient(to left, ${color.light} 20%, ${color.light}${
            color.light.length > 5 ? '0' : ''
        }0 80%)`,
        rightDark: `linear-gradient(to left, ${color.dark} 20%, ${color.dark}${
            color.dark.length > 5 ? '0' : ''
        }0 80%)`,
    })

    const swiper = ref(null)

    const prevBackground = computed(() => getBg(twColors[props.backgroundVariant]).left)
    const nextBackground = computed(() => getBg(twColors[props.backgroundVariant]).right)
    const prevBackgroundDark = computed(() => getBg(twColors[props.backgroundVariant]).leftDark)
    const nextBackgroundDark = computed(() => getBg(twColors[props.backgroundVariant]).rightDark)

    const computedTabs = computed(() =>
        props.tabs.map((tab) => (Array.isArray(tab?.tabs) ? tab.tabs : [tab])).flat(),
    )

    const emit = defineEmits(['update:modelValue'])

    const route = useRoute()
    const getTabRoute = (tab) => `${props.routeBase}/${tab.id}`

    const setTab = (tab, force = false) => {
        emit('update:modelValue', tab.id)
        if (tab.strict || force) {
            history.pushState({}, null, (import.meta.env.DEV ? '/#' : '') + getTabRoute(tab))
        }
    }

    const setCurrentTab = () => {
        const tab = computedTabs.value.find(
            (tab) =>
                tab.id ===
                    getCurrentPath()
                        .split(props.routeBase + '/')?.[1]
                        ?.split('/')?.[0] ||
                tab.route?.value === getCurrentPath() ||
                tab.route === getCurrentPath() ||
                getTabRoute(tab) === getCurrentPath(),
        )

        if (tab) {
            setTab(tab)
        } else {
            showInfoToast(
                `L'onglet '${getCurrentPath()}' n'existe pas. Redirection sur l'onglet par défaut ↪️`,
                { duration: 5000 },
            )

            const defaultTab = computedTabs.value.find((tab) => tab.id === props.defaultTabId)

            setTab(defaultTab, true)
        }

        if (swiper.value) swiper.value.slideTo(computedTabs.value.indexOf(tab))
    }

    setCurrentTab()

    const modules = [Navigation]

    watch(
        () => route.fullPath,
        () => {
            if (route.name === props.routeName && route.fullPath.startsWith(props.routeBase)) {
                setCurrentTab()
            }
        },
    )
</script>

<style lang="scss">
    /* stylelint-disable function-no-unknown */
    /* stylelint-disable value-keyword-case */

    .swiper-button-disabled {
        opacity: 0 !important;
    }

    .swiper-button-prev {
        @apply rounded-xl;

        left: -2px !important;
        width: 6rem;
        background: v-bind(prevBackground);

        .dark & {
            background: v-bind(prevBackgroundDark);
        }

        &::after {
            @apply text-base text-0-light dark:text-0-dark absolute left-4;
        }
    }

    .swiper-button-next {
        @apply rounded-xl;

        right: -2px !important;
        width: 6rem;
        background: v-bind(nextBackground);

        .dark & {
            background: v-bind(nextBackgroundDark);
        }

        &::after {
            @apply text-base text-0-light dark:text-0-dark absolute right-4;
        }
    }
</style>
