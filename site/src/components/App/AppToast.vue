<template>
    <teleport to="body">
        <div class="absolute right-4 bottom-4 z-50">
            <transition name="toast">
                <AppAlert v-if="triggerToast" :background="true" :icon="icon" :type="type">
                    <template v-if="$slots.icon" #icon>
                        <slot name="icon"></slot>
                    </template>

                    <template #text>
                        <slot name="text"></slot>
                    </template>
                </AppAlert>
            </transition>
        </div>
    </teleport>
</template>

<script>
    import AppAlert from '@/components/App/AppAlert.vue'

    export default {
        components: { AppAlert },
        props: {
            icon: {
                type: Boolean,
                default: () => true,
            },
            type: {
                type: String,
                required: true,
                default: () => 'info',
            },
            duration: {
                type: Number,
                default: () => 5000,
            },
            triggerToast: {
                type: Boolean,
                required: true,
            },
            autoToggle: {
                type: Boolean,
                default: () => true,
            },
        },
        emits: ['close-toast'],
        data() {
            return {}
        },
        watch: {
            triggerToast(newVal) {
                if (newVal && this.autoToggle) {
                    this.toggleTimeOut()
                }
            },
        },
        methods: {
            toggleTimeOut() {
                window.setTimeout(() => {
                    this.$emit('close-toast')
                }, this.duration)
            },
        },
    }
</script>
