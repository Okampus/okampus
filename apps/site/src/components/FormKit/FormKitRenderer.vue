<template>
    <div class="w-full">
        <FormKit type="form" @submit="submit">
            <FormKitSchema :schema="props.schema" />
        </FormKit>
    </div>
</template>

<script setup>
    import { FormKitSchema } from '@formkit/vue'

    const emit = defineEmits(['submit'])
    const props = defineProps({
        schema: {
            type: Array,
            required: true,
        },
    })

    const submit = () => {
        emit('submit')
    }
</script>
