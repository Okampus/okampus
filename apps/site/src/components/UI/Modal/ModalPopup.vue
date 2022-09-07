<template>
    <Teleport to="body">
        <Transition name="modal" @after-enter="content.focus()" @after-leave="emit('closed')">
            <div v-show="show" class="absolute inset-0 z-50 h-screen w-screen">
                <div
                    class="app-scrollbar fixed z-20 overflow-auto rounded-lg md:max-h-[80vh] md:max-w-[60vw] md-max:h-[100vh] md-max:w-[100vw]"
                    :style="{ 'transform': 'translate(calc(50vw - 50%), calc(50vh - 50%))' }"
                >
                    <div
                        ref="content"
                        tabindex="0"
                        class="modal-content relative h-full"
                        :class="cardClass"
                        @keydown.escape="emit('close')"
                    >
                        <div
                            class="link-blue bg-0 sticky top-0 z-20 flex w-full items-center gap-4 self-start py-4 md:hidden"
                            @click="emit('close')"
                        >
                            <div class="fa fa-arrow-left text-2xl" />
                            Revenir au menu précédent
                        </div>
                        <slot :close="() => emit('close')" />
                    </div>
                </div>

                <div
                    class="absolute z-10 h-full w-full bg-gray-800 opacity-50"
                    @click.prevent="emit('close')"
                />
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
    import { ref } from 'vue'

    defineProps({
        show: {
            type: Boolean,
            required: true,
        },
        cardClass: {
            type: [String, Object, Array],
            default: 'card-0 flex flex-col py-8 px-10',
        },
    })

    const emit = defineEmits(['close', 'closed'])
    const content = ref(null)
</script>

<style lang="scss">
    .modal-enter-active,
    .modal-leave-active {
        transition: all 0.25s ease;

        & .modal-content {
            transition: all 0.25s ease;
        }
    }

    .modal-enter-from,
    .modal-leave-to {
        opacity: 0.25;

        & .modal-content {
            transform: scale(0.9);
        }
    }
</style>
