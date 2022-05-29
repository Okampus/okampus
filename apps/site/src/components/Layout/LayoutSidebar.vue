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
        class="flex z-50 flex-col shrink-0 w-sidebar-sm sidebar"
    >
        <div v-if="smallScreen && showUncollapsed" class="flex shrink-0 items-center h-topbar">
            <button aria-label="Close Menu" class="w-sidebar-sm" @click="emit('toggle-side-bar')">
                <i class="text-2xl fas fa-times" />
            </button>
            <AppLogo />
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
                    class="mb-2.5 ml-6 text-[0.78rem] font-semibold tracking-wide text-gray-300 uppercase"
                >
                    {{ section.name }}
                </p>
                <template v-for="link of section.links" :key="link">
                    <li>
                        <router-link
                            :to="link.to"
                            class="flex items-center my-1 sidebar-tab reveal"
                            :class="[
                                { active: link.regActive.test($route.path) },
                                showUncollapsed ? 'mx-2 h-9' : 'mx-1.5 py-1',
                            ]"
                        >
                            <div
                                class="flex items-center w-full"
                                :class="[showUncollapsed ? 'flex-row ml-3 gap-4' : 'flex-col mb-1']"
                            >
                                <i :class="`fas fa-${link.icon}`" class="shrink-0 text-base" />
                                <template v-if="showUncollapsed">
                                    <span class="text-sm tracking-normal">{{ link.textLarge }}</span>
                                    <div class="mr-3 ml-auto opacity-0 revealed">
                                        <TipPopper v-if="link.button" :tip="link.button.text">
                                            <router-link :to="link.button.to">
                                                <i class="text-lg" :class="`fa fa-${link.button.icon}`" />
                                            </router-link>
                                        </TipPopper>
                                    </div>
                                </template>
                                <span v-else class="text-xs tracking-tight">{{ link.textSmall }}</span>
                            </div>
                        </router-link>
                    </li>
                </template>
            </ul>

            <div class="flex gap-4 justify-center items-center p-4">
                <p class="text-sm text-bold" :class="{ 'hidden': !showUncollapsed }">Mode Sombre</p>
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
        transition: margin-left 600ms;
    }

    .reveal:hover .revealed {
        @apply opacity-100;

        transition: opacity 300ms;
    }
</style>
