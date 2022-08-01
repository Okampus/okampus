<template>
    <Popper
        :locked="true"
        :arrow="true"
        :hover="onHover"
        :z-index="100"
        :open-delay="delay"
        :offset-distance="offset"
        :placement="placement"
        @close:popper="$emit('close')"
        @open:popper="$emit('open')"
    >
        <slot />
        <template #content>
            <template v-if="$slots.content">
                <slot name="content" />
            </template>
            <div
                v-else
                class="rounded-md bg-gray-900/90 px-2.5 py-1.5 text-[0.92rem] text-gray-100 dark:bg-black/90"
            >
                <template v-if="$slots.tip">
                    <slot name="tip" />
                </template>
                <template v-else>
                    {{ tip }}
                </template>
            </div>
        </template>
    </Popper>
</template>

<script setup>
    import Popper from 'vue3-popper'

    defineProps({
        onHover: {
            type: Boolean,
            default: true,
        },
        delay: {
            type: Number,
            default: 0,
        },
        tip: {
            type: String,
            default: '',
        },
        offset: {
            type: String,
            default: '5',
        },
        placement: {
            type: String,
            default: 'bottom',
        },
    })

    defineEmits(['close', 'open'])
</script>

<style>
    .popper {
        position: fixed !important;
    }
</style>
