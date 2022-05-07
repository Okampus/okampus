<template>
    <Popper :hover="onHover" :offset-distance="5">
        <slot />
        <template #content>
            <div class="p-2.5 text-base text-gray-100 bg-gray-900/90 dark:bg-black/90 rounded-md">
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
    })
</script>
