<template>
    <aside
        :class="[
            smallScreen || uncollapsed ? 'w-sidebar-lg' : 'w-sidebar-sm',
            collapsing ? 'transition-spacing' : '',
            smallScreen ? 'fixed h-screen' : 'after-topbar sticky h-content',
            smallScreen && ((collapsing && uncollapsed) || (!collapsing && !uncollapsed))
                ? 'hidden-sidebar-lg'
                : '',
        ]"
        class="flex z-30 flex-col shrink-0 w-sidebar-sm sidebar"
    >
        <div v-if="smallScreen && showUncollapsed" class="flex shrink-0 items-center bg-navbar h-topbar">
            <button aria-label="Close Menu" class="w-sidebar-sm" @click="emit('toggle-side-bar')">
                <i class="text-2xl fas fa-times" />
            </button>
            <AppLogo only="dark" />
        </div>

        <div
            :class="[
                showUncollapsed ? '' : 'divide-y dark:divide-gray-700',
                collapsing ? 'overflow-y-hidden' : 'overflow-y-auto scrollbar-none',
            ]"
        >
            <ul v-for="(section, i) in sections" :key="i">
                <p class="py-0.5 pl-4 mt-3 text-sm uppercase" :class="[showUncollapsed ? 'block' : 'hidden']">
                    {{ section.name }}
                </p>
                <template v-for="link of section.links" :key="link">
                    <li>
                        <router-link
                            :to="link.to"
                            class="flex items-center py-2 my-1 mx-auto w-11/12 opacity-80 tab"
                            :class="{ active: link.regActive.test($route.path) }"
                        >
                            <div
                                class="flex items-center w-full"
                                :class="[showUncollapsed ? 'flex-row ml-3 gap-4' : 'flex-col mb-1']"
                            >
                                <i :class="`fas fa-${link.icon}`" class="shrink-0 text-xl" />
                                <span v-if="showUncollapsed" class="text-base tracking-normal">{{
                                    link.textLarge
                                }}</span>
                                <span v-else class="text-xs tracking-tight">{{ link.textSmall }}</span>
                            </div>
                        </router-link>
                    </li>
                </template>
            </ul>

            <div class="flex gap-4 justify-center items-center p-4">
                <p class="text-bold" :class="{ 'hidden': !showUncollapsed }">Mode Sombre</p>
                <SwitchInput :model-value="config.darkMode" @update:model-value="config.switchDarkMode()" />
            </div>
        </div>
    </aside>
</template>

<script setup>
    import AppLogo from '@/components/App/AppLogo.vue'
    import SwitchInput from '@/components/Input/SwitchInput.vue'
    import { sections } from '@/shared/navigation/sidebar-sections.enum'
    import { computed } from 'vue'
    import { useUserConfigStore } from '@/store/user-config.store'

    const props = defineProps({
        uncollapsed: {
            type: Boolean,
            default: false,
        },
        collapsing: {
            type: Boolean,
            default: false,
        },
        smallScreen: {
            type: Boolean,
            default: false,
        },
    })

    const emit = defineEmits(['toggle-side-bar'])

    const showUncollapsed = computed(() => props.uncollapsed || props.collapsing)

    const config = useUserConfigStore()
</script>

<style lang="scss">
    .transition-spacing {
        transition: margin-left 600ms;
    }
</style>
