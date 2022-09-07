<template>
    <button class="button-blue flex items-center gap-3" @click="emitter.emit('show-login')">
        <p v-if="!onlyIcon" class="text-md font-medium uppercase sm-max:hidden">Se connecter</p>
        <i class="fas fa-sign-in-alt text-lg" />
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
