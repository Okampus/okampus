<template>
    <div class="flex gap-2">
        <div
            v-for="(tab, i) in tabs"
            :key="i"
            class="flex gap-3 justify-center items-center py-2 px-4 my-2 tab"
            :class="tab.id === modelValue ? 'active' : 'text-1'"
            @click="setTab(tab, true)"
        >
            <i class="fas" :class="`fa-${tab.icon}`" />
            <p>{{ tab.name }}</p>
        </div>
    </div>
</template>

<script setup>
    import { emitter } from '@/shared/modules/emitter'
    import { watch } from 'vue'
    import { useRoute } from 'vue-router'
    import { getCurrentPath } from '@/utils/routeUtils'

    const props = defineProps({
        tabs: {
            type: Object,
            default: () => {},
        },
        defaultTabId: {
            type: String,
            default: (props) => props.tabs[0].id,
        },
        mode: {
            type: String,
            default: 'tabs',
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

    const emit = defineEmits(['update:modelValue'])

    const route = useRoute()
    const getTabRoute = (tab) => tab.route?.value ?? tab.route ?? `${props.routeBase}/${tab.id}`

    const setTab = (tab, force = false) => {
        emit('update:modelValue', tab.id)
        if (tab.strict || force) {
            history.pushState({}, null, (import.meta.env.DEV ? '/#' : '') + getTabRoute(tab))
        }
    }

    const setCurrentTab = () => {
        const tab = props.tabs.find(
            (tab) =>
                '/' + tab.id === getCurrentPath().split(props.routeBase)?.[1] ||
                getTabRoute(tab) === getCurrentPath(),
        )

        if (tab) {
            setTab(tab)
        } else {
            emitter.emit('show-toast', {
                message: `L'onglet '${getCurrentPath()
                    .split(props.routeBase)[1]
                    .slice(1)}' n'existe pas. Redirection sur l'onglet par défaut ↪️`,
                type: 'warning',
                duration: 5000,
            })

            const defaultTab = props.tabs.find((tab) => tab.id === props.defaultTabId)

            setTab(defaultTab, true)
        }
    }

    setTab(
        props.tabs.find(
            (tab) =>
                '/' + tab.id === getCurrentPath().split(props.routeBase)?.[1] ||
                getTabRoute(tab) === getCurrentPath(),
        ) ?? props.tabs.find((tab) => tab.id === props.defaultTabId),
    )

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
