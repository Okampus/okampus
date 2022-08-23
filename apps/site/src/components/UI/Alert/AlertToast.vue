<template>
    <Teleport to="body">
        <div
            class="fixed z-[60]"
            :class="banner ? 'after-topbar' : 'md:max-w-[50rem] lg:max-w-[55rem] xl:max-w-[70rem]'"
            :style="[{ ...transform, ...offsetX, ...offsetY }]"
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
                        :class="[toastDuration > 0 && !resetting ? 'progress-bar' : '']"
                        :style="{ '--progress-bar-duration': toastDuration }"
                    />

                    <template v-if="$slots.title || title" #title>
                        <p v-if="title.length" class="font-semibold">{{ title }}</p>
                        <slot v-else name="title" />
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
    import { computed, nextTick, ref } from 'vue'

    const props = defineProps({
        message: {
            type: String,
            default: '',
        },
        title: {
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
            default: null,
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

    const toastDuration = computed(
        () =>
            props.duration ??
            (props.message || props.title
                ? readingTime((props.title ? props.title + '\n' : '') + props.message, 'medium') * 1000
                : 2000),
    )

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

    // FIXME: improve this
    const offsetY = computed(() =>
        props.banner
            ? {}
            : position.value.includes('top')
            ? { top: `${props.offset[1]}px` }
            : position.value.includes('bottom')
            ? { bottom: `${props.offset[1]}px` }
            : {},
    )

    const offsetX = computed(() =>
        props.banner
            ? {}
            : position.value.includes('left')
            ? { left: `${props.offset[0]}px` }
            : position.value.includes('right')
            ? { right: `${props.offset[0]}px` }
            : {},
    )

    const enterDuration = 300

    const dismissToast = () => (emit('update:active', false), emit('close'))
    const timeOutProcess = ref(null)

    const resetting = ref(false)
    const reset = () => {
        nextTick(() => {
            clearTimeout(timeOutProcess.value)
            if (toastDuration.value > 0) {
                timeOutProcess.value = setTimeout(dismissToast, toastDuration.value)

                // Reset CSS animation (nextTick doesn't work)
                // FIXME: improve this?
                resetting.value = true
                setTimeout(() => (resetting.value = false), 10)
            }
        })
    }
    defineExpose({ reset })
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
