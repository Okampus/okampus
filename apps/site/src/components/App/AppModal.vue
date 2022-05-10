<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-show="show" class="absolute top-0 left-0 z-40 w-screen h-screen">
                <div
                    class="fixed top-0 left-0 z-50 rounded-lg"
                    :style="{ 'transform': 'translate(calc(50vw - 50%), calc(50vh - 50%))' }"
                >
                    <div class="rounded-lg modal-content">
                        <slot :close="() => emit('close')" />
                    </div>
                </div>

                <div class="absolute w-full h-full bg-gray-800 opacity-50" @click.prevent="emit('close')" />
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
    import { watchEffect } from 'vue'

    const props = defineProps({
        show: {
            type: Boolean,
            require: true,
        },
    })

    const emit = defineEmits(['close'])

    const closeOnKeydown = (e) => {
        if (e.key === 'Escape') {
            emit('close')
        }
    }

    watchEffect(() => {
        if (props.show) {
            window.addEventListener('keydown', closeOnKeydown)
        } else {
            window.removeEventListener('keydown', closeOnKeydown)
        }
    })
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
