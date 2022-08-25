<template>
    <div
        class="bg-2 text-2 flex h-fit shrink-0 flex-col rounded p-2 shadow-md"
        :class="isMultiTab ? 'py-4' : 'gap-2'"
    >
        <template v-for="(tabParent, i) in tabs" :key="i">
            <div v-if="isMultiTab" class="flex grow-0 flex-col">
                <div class="text-5 title-font mb-2 ml-3 text-xs font-bold uppercase">
                    {{ tabParent.title }}
                </div>
                <div
                    v-for="(tab, j) in tabParent.tabs"
                    :key="j"
                    class="tab mt-0.5 flex h-10 select-none items-center justify-between px-2"
                    :class="tab.id === modelValue ? 'active' : 'text-1'"
                    @click="setTab(tab, true)"
                >
                    <div class="title-font whitespace-nowrap">{{ tab.name }}</div>
                    <LabelSimple
                        v-if="tab.amount || tab.amount === 0"
                        class="ml-6"
                        bg-class="bg-gray-500/50"
                        >{{ abbrNumbers(tab.amount) }}</LabelSimple
                    >
                </div>
                <hr
                    v-if="i !== tabs.length - 1"
                    class="mt-2 mb-4 h-[1px] w-11/12 self-center border-none bg-gray-500/20"
                />
            </div>
            <div
                v-else
                class="tab flex h-10 select-none items-center justify-between px-2"
                :class="tabParent.id === modelValue ? 'active' : ''"
                @click="setTab(tabParent, true)"
            >
                <div>{{ tabParent.name }}</div>
                <div v-if="tabParent.amount || tabParent.amount === 0" class="ml-6">
                    ({{ abbrNumbers(tabParent.amount) }})
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'

    import abbrNumbers from 'approximate-number'

    import { watch } from 'vue'
    import { useRoute } from 'vue-router'

    import { getCurrentPath } from '@/utils/routeUtils'
    import { showInfoToast } from '@/utils/toast.js'

    const props = defineProps({
        tabs: {
            type: Array,
            required: true,
        },
        defaultTabId: {
            type: String,
            default: (props) =>
                Object.prototype.hasOwnProperty.call(props.tabs[0], 'tabs')
                    ? props.tabs[0].tabs[0].id
                    : props.tabs[0].id,
        },
        routeBase: {
            type: String,
            required: true,
        },
        routeName: {
            type: String,
            required: true,
        },
        modelValue: {
            type: [String, null],
            required: true,
        },
    })

    const isMultiTab = Object.prototype.hasOwnProperty.call(props.tabs[0], 'tabs')

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
        const tab = isMultiTab
            ? props.tabs
                  .map((tab) => tab.tabs)
                  .flat()
                  .find(
                      (tab) =>
                          tab.id ===
                              getCurrentPath()
                                  .split(props.routeBase + '/')?.[1]
                                  ?.split('/')?.[0] || getTabRoute(tab) === getCurrentPath(),
                  )
            : props.tabs.find(
                  (tab) =>
                      tab.id ===
                          getCurrentPath()
                              .split(props.routeBase + '/')?.[1]
                              ?.split('/')?.[0] || getTabRoute(tab) === getCurrentPath(),
              )

        if (tab) {
            setTab(tab)
        } else {
            showInfoToast(
                `L'onglet '${getCurrentPath()}' n'existe pas. Redirection sur l'onglet par défaut ↪️`,
                { duration: 5000 },
            )

            const defaultTab = isMultiTab
                ? props.tabs
                      .map((tab) => tab.tabs)
                      .flat()
                      .find((tab) => tab.id === props.defaultTabId)
                : props.tabs.find((tab) => tab.id === props.defaultTabId)

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
