<template>
    <div class="w-full">
        <FormKitSchema :schema="props.schema" />
    </div>
</template>

<script setup>
    import { FormKitSchema } from '@formkit/vue'

    const props = defineProps({
        schema: {
            type: Array,
            required: true,
        },
    })
</script>
