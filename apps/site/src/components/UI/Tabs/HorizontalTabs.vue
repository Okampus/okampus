<template>
    <Swiper slides-per-view="auto" :space-between="20" class="w-full" @swiper="(s) => (swiper = s)">
        <SwiperSlide v-for="(tab, i) in computedTabs" :key="i" class="!w-fit">
            <div
                class="tab my-2 flex items-center justify-center gap-3 py-2 px-4"
                :class="tab.id === modelValue ? 'active' : 'text-1'"
                @click="setTab(tab, true)"
            >
                <i :class="`fas fa-${tab.icon}`" />
                <p class="title-font">{{ tab.name }}</p>
                <LabelSimple
                    v-if="tab.amount || tab.amount === 0"
                    class="bg-gray-500/50 hover:bg-gray-500/50"
                    >{{ abbrNumbers(tab.amount) }}</LabelSimple
                >
            </div>
        </SwiperSlide>
    </Swiper>
</template>

<script setup>
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'
    import { Swiper, SwiperSlide } from 'swiper/vue'

    import { abbrNumbers } from '@/utils/abbrNumbers'

    import { computed, watch } from 'vue'
    import { useRoute } from 'vue-router'
    import { getCurrentPath } from '@/utils/routeUtils'
    import { showInfoToast } from '@/utils/toast.js'

    const props = defineProps({
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
    }

    setCurrentTab()

    watch(
        () => route.fullPath,
        () => {
            if (route.name === props.routeName && route.fullPath.startsWith(props.routeBase)) {
                setCurrentTab()
            }
        },
    )
</script>
