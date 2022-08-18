<template>
    <Teleport to="body">
        <Transition name="fade" @after-enter="showContent = true">
            <div
                v-show="show"
                class="h-content after-topbar fixed z-50 backdrop-blur backdrop-brightness-50"
                :class="smallScreen ? 'inset-x-0' : uncollapsed ? 'after-sidebar-lg' : 'after-sidebar-sm'"
            >
                <Transition name="from-bottom">
                    <div
                        v-if="showContent"
                        class="absolute inset-x-[15%] top-[10%] bottom-0 z-20 h-[90%] w-[70%]"
                    >
                        <div
                            class="shadow-bottom-sheet bg-0 flex w-full justify-between rounded-t-lg py-4 px-6"
                        >
                            <div class="text-0 w-full text-center text-2xl font-bold">
                                Créez votre formulaire&nbsp; 🎉
                            </div>
                            <i
                                class="fa fa-xmark -mt-1 -mr-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg pl-0.5 text-4xl text-3-light hover:bg-gray-500 dark:text-0-dark"
                                @click="close"
                            />
                        </div>
                        <div class="bg-2 h-full p-10">
                            <component :is="component || 'div'" :="props" @close="close" />
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
    import { ref } from 'vue'

    defineProps({
        show: {
            type: Boolean,
            require: true,
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
    const close = () => {
        emitter.emit('close-bottom-sheet')
        showContent.value = false
    }
</script>

<style lang="scss">
    .shadow-bottom-sheet {
        .dark & {
            box-shadow: inset 0 2px 0 hsl(0deg 0% 100% / 30%), 0 2px 2px hsl(0deg 0% 0% / 30%);
        }
    }
</style>
