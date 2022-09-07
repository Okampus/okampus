<template>
    <Teleport to="body">
        <Transition name="fade" @after-enter="open">
            <div
                v-show="show"
                class="h-content fixed z-[60] outline-none backdrop-blur backdrop-brightness-50"
                :class="[
                    md ? 'after-topbar' : 'inset-0',
                    localStore.me?.finishedOnboarding
                        ? smallScreen
                            ? 'inset-x-0'
                            : uncollapsed
                            ? 'after-sidebar-lg'
                            : 'after-sidebar-sm'
                        : 'w-[100vw]',
                ]"
            >
                <Transition name="from-bottom">
                    <div
                        v-if="showContent"
                        ref="sheet"
                        class="absolute z-20 outline-none md:inset-x-[7%] md:top-[7%] md:h-[93%] md:w-[86%] md-max:h-full md-max:w-full"
                        tabindex="0"
                        @keydown.escape="close"
                    >
                        <div
                            class="bg-0 flex w-full justify-between py-4 px-6 md:rounded-t-lg"
                            :class="{ 'shadow-bottom-sheet': md }"
                        >
                            <div class="text-0 w-full text-center text-2xl font-bold">
                                {{ title }}
                            </div>
                            <i
                                class="fa fa-xmark -mt-1 -mr-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg pl-0.5 text-4xl text-3-light hover:bg-4-light dark:text-0-dark dark:hover:bg-4-dark"
                                @click="close"
                            />
                        </div>
                        <div class="bg-1 relative md:h-[calc(100%-4rem)] md-max:h-full">
                            <component
                                :is="component || 'div'"
                                ref="content"
                                :="props"
                                class="app-scrollbar overflow-scroll"
                                :class="[
                                    unsaved && showUnsaved ? 'h-[calc(100%-6rem)]' : 'h-full',
                                    { 'p-10': padded },
                                ]"
                                @close="close"
                                @change="() => (unsaved = true)"
                                @save-success="
                                    (doClose) => {
                                        unsaved = false
                                        doClose && close()
                                    }
                                "
                            />
                            <Transition v-if="showUnsaved" name="from-bottom">
                                <div
                                    v-show="unsaved"
                                    :class="isNew ? 'h-16 flex-col' : 'h-24'"
                                    class="bg-0 absolute bottom-0 flex w-full items-center justify-between px-10 py-4 lg-max:flex-col"
                                >
                                    <div class="text-0">Vous avez des changements non-sauvegardés !</div>
                                    <div class="flex items-center gap-4">
                                        <div class="link-blue cursor-pointer" @click="close">
                                            {{ isNew ? 'Annuler' : 'Annuler les changements' }}
                                        </div>
                                        <button class="button-green" @click="content.save">
                                            {{ isNew ? 'Valider' : 'Confirmer' }}
                                        </button>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </Transition>
                <div class="absolute z-10 h-full w-full" @click.prevent="close" />
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
    import { emitter } from '@/shared/modules/emitter'
    import { twBreakpoints } from '@/tailwind'
    import { useBreakpoints } from '@vueuse/core'
    import { ref } from 'vue'

    import localStore from '@/store/local.store'

    const breakpoints = useBreakpoints(twBreakpoints)
    const md = breakpoints.greater('md')

    defineProps({
        show: {
            type: Boolean,
            required: true,
        },
        padded: {
            type: Boolean,
            default: true,
        },
        title: {
            type: String,
            required: true,
        },
        isNew: {
            type: Boolean,
            default: false,
        },
        showUnsaved: {
            type: Boolean,
            default: true,
        },
        component: {
            type: [Object, String],
            required: true,
        },
        props: {
            type: Object,
            required: true,
        },
        uncollapsed: {
            type: Boolean,
            default: false,
        },
        smallScreen: {
            type: Boolean,
            default: false,
        },
    })

    const showContent = ref(false)
    const unsaved = ref(false)
    const content = ref(null)
    const sheet = ref(null)

    const close = () => {
        showContent.value = false
        unsaved.value = false
        emitter.emit('close-bottom-sheet')
    }

    const open = () => {
        showContent.value = true
        setTimeout(() => sheet.value.focus(), 100)
    }
</script>

<style lang="scss">
    .shadow-bottom-sheet {
        .dark & {
            box-shadow: inset 0 2px 0 hsl(0deg 0% 100% / 30%), 0 2px 2px hsl(0deg 0% 0% / 30%);
        }
    }
</style>
