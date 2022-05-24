<template>
    <Popper
        :locked="true"
        :arrow="true"
        :hover="onHover"
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
            <div v-else class="p-2.5 text-base text-gray-100 bg-gray-900/90 dark:bg-black/90 rounded-md">
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
