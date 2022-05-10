<template>
    <Teleport to="body">
        <div
            class="fixed z-50"
            :class="{ 'w-content after-sidebar after-topbar': banner }"
            :style="[style, showing ? offsetY : {}]"
        >
            <Transition name="toast" :style="{ '--toast-enter-duration': enterDuration }">
                <AppAlert
                    v-if="active"
                    :icon="icon"
                    :type="type"
                    :dismissable="dismissable"
                    @dismiss="dismissToast"
                >
                    <div
                        class="absolute top-0 left-0 w-full h-1"
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
                </AppAlert>
            </Transition>
        </div>
    </Teleport>
</template>

<script>
    import AppAlert from '@/components/App/AppAlert.vue'
    import { readingTime } from '@/utils/readingTime'

    export default {
        components: { AppAlert },
        props: {
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
        },
        emits: ['update:active', 'close'],
        data() {
            const position = this.position.toLowerCase()
            const transformY = !position.includes('top') && !position.includes('bottom')
            const transformX = !position.includes('left') && !position.includes('right')
            const transform =
                transformX || transformY
                    ? {
                          transform: `translate(${
                              transformX ? 'calc(50vw - 50%)' + (transformY ? ', ' : '') : ''
                          }${transformY ? 'calc(50vh - 50%)' : ''})`,
                      }
                    : {}

            const offsetY = this.banner
                ? {}
                : position.includes('top')
                ? { top: `${this.offset[1]}px` }
                : position.includes('bottom')
                ? { bottom: `${this.offset[1]}px` }
                : {}

            const offsetX = this.banner
                ? {}
                : position.includes('left')
                ? { left: `${this.offset[0]}px` }
                : position.includes('right')
                ? { right: `${this.offset[0]}px` }
                : {}

            const style = {
                ...transform,
                ...offsetX,
            }

            return { style, offsetY, enterDuration: 300, showing: true }
        },
        watch: {
            active(trigger) {
                if (trigger && this.autoToggle) {
                    this.toggleTimeOut()
                }
            },
        },
        methods: {
            dismissToast() {
                this.$emit('update:active', false)
                this.$emit('close')
                // TODO: remove setTimeout on dismiss to avoid dismiss bugs
            },
            toggleTimeOut() {
                if (this.duration > 0) {
                    window.setTimeout(() => {
                        this.dismissToast()
                    }, this.duration)
                }
            },
        },
    }
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
