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
        class="w-sidebar-sm sidebar z-[60] flex shrink-0 flex-col"
    >
        <div v-if="smallScreen && showUncollapsed" class="h-topbar flex shrink-0 items-center">
            <button aria-label="Close Menu" class="w-sidebar-sm" @click="emit('toggle-side-bar')">
                <i class="fas fa-times text-2xl" />
            </button>
            <AppLogo only="dark" />
        </div>

        <div
            :class="[
                'flex flex-col py-4',
                collapsing ? 'overflow-y-hidden' : 'overflow-y-auto scrollbar-none',
                showUncollapsed ? 'gap-6' : 'gap-0.5',
            ]"
        >
            <ul v-for="(section, i) in sections" :key="i">
                <p
                    v-if="showUncollapsed"
                    class="title-font mb-2.5 ml-6 text-[0.8rem] font-semibold uppercase text-gray-200"
                >
                    {{ section.name }}
                </p>
                <template v-for="link of section.links" :key="link">
                    <li>
                        <router-link
                            :to="link.to"
                            class="sidebar-tab reveal my-1 flex items-center text-gray-200"
                            :class="[
                                { active: link.regActive.test($route.path) },
                                showUncollapsed ? 'mx-2 h-9' : 'mx-1.5 py-1',
                            ]"
                            @click="
                                () => {
                                    if (smallScreen && showUncollapsed) {
                                        emit('toggle-side-bar')
                                    }
                                }
                            "
                        >
                            <div
                                class="flex w-full items-center"
                                :class="[showUncollapsed ? 'flex-row ml-3 gap-4' : 'flex-col mb-1']"
                            >
                                <div class="flex w-4 items-center justify-center">
                                    <i :class="`fas fa-${link.icon}`" class="shrink-0 text-base" />
                                </div>

                                <template v-if="showUncollapsed">
                                    <span class="title-font text-base">{{ link.textLarge }}</span>
                                    <div class="revealed mr-3 ml-auto opacity-0">
                                        <TipPopper v-if="link.button" :tip="link.button.text">
                                            <router-link :to="link.button.to">
                                                <i class="text-lg" :class="`fa fa-${link.button.icon}`" />
                                            </router-link>
                                        </TipPopper>
                                    </div>
                                </template>
                                <span v-else class="title-font text-xs tracking-tight">{{
                                    link.textSmall
                                }}</span>
                            </div>
                        </router-link>
                    </li>
                </template>
            </ul>

            <div class="flex items-center justify-center gap-4 p-4">
                <p class="text-bold text-sm" :class="{ 'hidden': !showUncollapsed }">Mode Sombre</p>
                <SwitchInput :model-value="config.darkMode" @update:model-value="config.switchDarkMode()" />
            </div>
        </div>
    </aside>
</template>

<script setup>
    import AppLogo from '@/components/App/AppLogo.vue'
    import SwitchInput from '@/components/Input/SwitchInput.vue'
    import TipPopper from '@/components/UI/Tip/TipPopper.vue'

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
        transition: margin-left 0.3s;
    }

    .reveal:hover .revealed {
        @apply opacity-100;

        transition: opacity 0.2s;
    }
</style>
