<template>
    <button class="flex gap-3 items-center button-blue" @click="emitter.emit('login')">
        <p v-if="!onlyIcon" class="font-medium uppercase text-md">Se connecter</p>
        <i class="text-lg fas fa-sign-in-alt" />
    </button>
</template>

<script setup>
    import { emitter } from '@/shared/modules/emitter'
    defineProps({
        onlyIcon: {
            type: Boolean,
            default: false,
        },
    })
</script>
