<template>
    <Teleport to="body">
        <div
            class="fixed z-50"
            :class="{ 'w-content after-sidebar after-topbar': banner }"
            :style="[{ ...transform, ...offsetX }, showing ? offsetY : {}]"
        >
            <Transition name="toast" :style="{ '--toast-enter-duration': enterDuration }">
                <AlertInline
                    v-if="active"
                    :icon="icon"
                    :type="type"
                    :dismissable="dismissable"
                    @dismiss="dismissToast"
                >
                    <div
                        class="absolute top-0 left-0 h-1 w-full"
                        :class="[duration > 0 ? 'progress-bar' : '']"
                        :style="{ '--progress-bar-duration': duration }"
                    />

                    <template v-if="$slots.title" #title>
                        <slot name="title" />
                    </template>

                    <template v-if="$slots.icon" #icon>
                        <slot name="icon" />
                    </template>

                    <template #message>
                        <p v-if="message.length">{{ message }}</p>
                        <slot v-else name="message" />
                    </template>

                    <template v-if="$slots.actions" #actions>
                        <slot name="actions" />
                    </template>
                </AlertInline>
            </Transition>
        </div>
    </Teleport>
</template>

<script setup>
    import AlertInline from '@/components/UI/Alert/AlertInline.vue'
    import { readingTime } from '@/utils/readingTime'
    import { computed, ref, watchEffect } from 'vue'

    const props = defineProps({
        message: {
            type: String,
            default: '',
        },
        banner: {
            type: Boolean,
            default: false,
        },
        offset: {
            type: Array,
            default: () => [0, 10],
        },
        position: {
            type: String,
            default: 'bottom',
        },
        icon: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            default: 'info',
        },
        duration: {
            type: Number,
            default: (props) => (props.message ? readingTime(props.message, 'slow') * 1000 : 2000),
        },
        dismissable: {
            type: Boolean,
            default: true,
        },
        active: {
            type: Boolean,
            required: true,
        },
        autoToggle: {
            type: Boolean,
            default: true,
        },
    })

    const emit = defineEmits(['update:active', 'close'])

    const position = computed(() => props.position.toLowerCase())

    const transform = computed(() =>
        (!position.value.includes('left') && !position.value.includes('right')) ||
        (!position.value.includes('top') && !position.value.includes('bottom'))
            ? {
                  transform: `translate(${
                      !position.value.includes('left') && !position.value.includes('right')
                          ? 'calc(50vw - 50%)' +
                            (!position.value.includes('top') && !position.value.includes('bottom')
                                ? ', '
                                : '')
                          : ''
                  }${
                      !position.value.includes('top') && !position.value.includes('bottom')
                          ? 'calc(50vh - 50%)'
                          : ''
                  })`,
              }
            : {},
    )

    const offsetY = computed(() =>
        this.banner
            ? {}
            : position.value.includes('top')
            ? { top: `${this.offset[1]}px` }
            : position.value.includes('bottom')
            ? { bottom: `${this.offset[1]}px` }
            : {},
    )

    const offsetX = computed(() =>
        this.banner
            ? {}
            : position.value.includes('left')
            ? { left: `${this.offset[0]}px` }
            : position.value.includes('right')
            ? { right: `${this.offset[0]}px` }
            : {},
    )

    const showing = ref(true)
    const enterDuration = 300

    const dismissToast = () => {
        emit('update:active', false)
        emit('close')
    }

    const toggleTimeOut = () => {
        if (props.duration) {
            setTimeout(() => {
                showing.value = false
            }, props.duration)
        }
    }

    watchEffect(() => {
        if (props.active && props.autoToggle) {
            toggleTimeOut()
        }
    })
</script>

<style>
    .toast-enter-active,
    .toast-leave-active {
        transition: all calc(var(--toast-enter-duration) * 1ms) ease;
    }

    .toast-enter-from,
    .toast-leave-to {
        transform: translateY(120%) scale(0.9);
    }
</style>
