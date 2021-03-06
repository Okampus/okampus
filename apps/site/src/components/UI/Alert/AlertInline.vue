<template>
    <div
        class="relative flex overflow-hidden rounded-lg py-3 px-4"
        :class="[
            background ? 'alert-card' : 'alert',
            fitContent ? 'w-fit' : 'w-full',
            $slots.title ? 'flex-col gap-4 ' : 'gap-3 items-center',
        ]"
        :alert-type="type"
    >
        <slot name="default" />

        <div v-if="$slots.icon || icon || $slots.title" class="title flex items-center gap-3 text-lg">
            <slot v-if="$slots.icon" name="icon" />
            <i v-else-if="icon" class="fas" :class="`fa-${defaultIconList?.[type]}`" />
            <slot name="title" />
        </div>

        <div class="subtitle">
            <slot name="message" />
        </div>

        <div v-if="$slots.actions || dismissable" class="flex gap-3" :class="{ 'ml-auto': !$slots.title }">
            <slot name="actions" class="actions" />

            <!-- TODO: add option for simple "dismiss" button instead of times icon -->
            <button
                v-if="dismissable"
                class="dismiss flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg p-1.5 text-xl focus:ring-1"
                @click="$emit('dismiss')"
            >
                <i class="fas" :class="`fa-${dismissIcon}`" />
            </button>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        dismissable: {
            type: Boolean,
            default: false,
        },
        fitContent: {
            type: Boolean,
            default: false,
        },
        background: {
            type: Boolean,
            default: true,
        },
        icon: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            required: true,
            default: 'info',
        },
    })

    defineEmits(['dismiss'])

    const dismissIcon = 'times'
    const defaultIconList = {
        info: 'info-circle',
        warning: 'exclamation-triangle',
        error: 'exclamation',
        bug: 'bug',
        success: 'check',
        failure: 'times',
    }
</script>

<style lang="scss">
    %alert,
    .alert {
        & .progress-bar {
            @keyframes roundtime {
                to {
                    /* More performant than animating `width` */
                    transform: scaleX(0);
                }
            }

            transform-origin: left center;
            animation: roundtime calc(var(--progress-bar-duration) * 1ms) forwards;
        }

        &[alert-type='info'] {
            & .progress-bar {
                background: linear-gradient(to bottom, rgb(59 130 246), rgb(37 99 235));
            }

            & .title {
                @apply text-blue-600 dark:text-blue-100;
            }

            & .subtitle {
                @apply text-blue-500 dark:text-blue-50;
            }

            & .dismiss {
                @apply hover:bg-blue-200 dark:hover:bg-blue-300 text-blue-500 focus:ring-blue-400;
            }
        }

        &[alert-type='warning'] {
            & .progress-bar {
                background: linear-gradient(to bottom, rgb(234 179 8), rgb(202 138 4));
            }

            & .title {
                @apply text-yellow-600 dark:text-yellow-100;
            }

            & .subtitle {
                @apply text-yellow-500 dark:text-yellow-50;
            }

            & .dismiss {
                @apply hover:bg-yellow-200 dark:hover:bg-yellow-300 text-yellow-500 focus:ring-yellow-400;
            }
        }

        &[alert-type='error'],
        &[alert-type='failure'],
        &[alert-type='bug'] {
            & .progress-bar {
                background: linear-gradient(to bottom, rgb(239 68 68), rgb(220 38 38));
            }

            & .title {
                @apply text-red-600 dark:text-red-100;
            }

            & .subtitle {
                @apply text-red-500 dark:text-red-50;
            }

            & .dismiss {
                @apply hover:bg-red-200 dark:hover:bg-red-300 text-red-500 focus:ring-red-400;
            }
        }

        &[alert-type='success'] {
            & .progress-bar {
                background: linear-gradient(to bottom, rgb(74 222 128), rgb(34 197 94));
            }

            & .title {
                @apply text-green-600 dark:text-green-100;
            }

            & .subtitle {
                @apply text-green-600 dark:text-green-50;
            }

            & .dismiss {
                @apply hover:bg-green-200 dark:hover:bg-green-300 text-green-500 focus:ring-green-400;
            }
        }
    }

    .alert-card {
        @extend %alert;

        &[alert-type='info'] {
            @apply bg-blue-100 dark:bg-blue-700;
        }

        &[alert-type='warning'] {
            @apply bg-yellow-100 dark:bg-yellow-700;
        }

        &[alert-type='error'],
        &[alert-type='failure'],
        &[alert-type='bug'] {
            @apply bg-red-100 dark:bg-red-700;
        }

        &[alert-type='success'] {
            @apply bg-green-100 dark:bg-green-700;
        }
    }
</style>
