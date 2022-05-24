<template>
    <div class="flex flex-col shrink-0 p-2 h-fit rounded bg-2 text-2" :class="isMultiTab ? 'py-4' : 'gap-2'">
        <template v-for="(tabParent, i) in tabs" :key="i">
            <div v-if="isMultiTab" class="flex flex-col grow-0">
                <div class="mb-2 ml-3 text-xs font-bold uppercase text-5">{{ tabParent.title }}</div>
                <div
                    v-for="(tab, j) in tabParent.tabs"
                    :key="j"
                    class="flex justify-between items-center px-2 mt-0.5 h-10 select-none tab"
                    :class="[
                        tab.id === modelValue ? 'active' : 'text-1',
                        j === 0 ? 'rounded-t' : '',
                        j === tabParent.tabs.length - 1 ? 'rounded-b' : '',
                    ]"
                    @click="setTab(tab, true)"
                >
                    <div class="whitespace-nowrap">{{ tab.name }}</div>
                    <LabelSimple v-if="tab.amount" class="ml-6 bg-gray-500/50 hover:bg-gray-500/50">{{
                        abbrNumbers(tab.amount)
                    }}</LabelSimple>
                </div>
                <hr
                    v-if="i !== tabs.length - 1"
                    class="self-center mt-2 mb-4 w-11/12 h-[1px] bg-gray-500/20 border-none"
                />
            </div>
            <div
                v-else
                class="flex justify-between items-center px-2 h-10 select-none tab"
                :class="[
                    tabParent.id === modelValue ? 'active' : '',
                    i === 0 ? 'rounded-t' : '',
                    i === tabs.length - 1 ? 'rounded-b' : '',
                ]"
                @click="setTab(tabParent, true)"
            >
                <div>{{ tabParent.name }}</div>
                <div v-if="tabParent.amount" class="ml-6">({{ tabParent.amount }})</div>
            </div>
        </template>
    </div>
</template>

<script setup>
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'

    import { emitter } from '@/shared/modules/emitter'
    import { watch } from 'vue'
    import { useRoute } from 'vue-router'

    import { abbrNumbers } from '@/utils/abbrNumbers'

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
        baseRoute: {
            type: String,
            required: true,
        },
        routeName: {
            type: String,
            required: true,
        },
        modelValue: {
            type: String,
            default: (props) => props.defaultTab,
        },
    })

    const isMultiTab = Object.prototype.hasOwnProperty.call(props.tabs[0], 'tabs')

    const emit = defineEmits(['update:modelValue'])

    const route = useRoute()

    const setTab = (tab, force = false) => {
        emit('update:modelValue', tab.id)
        if (tab.strict || force) {
            history.pushState(
                {},
                null,
                (import.meta.env.DEV ? '/#' : '') + (tab.route ? tab.route : `${props.baseRoute}/${tab.id}`),
            )
        }
    }

    const setCurrentTab = () => {
        const tab = isMultiTab
            ? props.tabs
                  .map((tab) => tab.tabs)
                  .flat()
                  .find(
                      (tab) =>
                          '/' + tab.id === route.fullPath.split(props.baseRoute)[1] ||
                          tab.route === route.fullPath,
                  )
            : props.tabs.find(
                  (tab) =>
                      '/' + tab.id === route.fullPath.split(props.baseRoute)[1] ||
                      tab.route === route.fullPath,
              )

        if (tab) {
            setTab(tab)
        } else {
            emitter.emit('show-toast', {
                message: `L'onglet '${route.fullPath
                    .split(props.baseRoute)[1]
                    .slice(1)}' n'existe pas. Redirection sur l'onglet par défaut ↪️`,
                type: 'warning',
                duration: 5000,
            })

            const defaultTab = isMultiTab
                ? props.tabs
                      .map((tab) => tab.tabs)
                      .flat()
                      .find((tab) => tab.id === props.defaultTabId)
                : props.tabs.find((tab) => tab.id === props.defaultTabId)

            setTab(defaultTab, true)
        }
    }

    setTab(
        isMultiTab
            ? props.tabs
                  .map((tab) => tab.tabs)
                  .flat()
                  .find(
                      (tab) =>
                          '/' + tab.id === route.fullPath.split(props.baseRoute)[1] ||
                          tab.route === route.fullPath,
                  ) ??
                  props.tabs
                      .map((tab) => tab.tabs)
                      .flat()
                      .find((tab) => tab.id === props.defaultTabId)
            : props.tabs.find(
                  (tab) =>
                      '/' + tab.id === route.fullPath.split(props.baseRoute)[1] ||
                      tab.route === route.fullPath,
              ) ?? props.tabs.find((tab) => tab.id === props.defaultTabId),
    )

    setCurrentTab()

    watch(
        () => route.fullPath,
        () => {
            if (route.name === props.routeName) {
                setCurrentTab()
            }
        },
    )
</script>
