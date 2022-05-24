<template>
    <button class="button" @click="emitter.emit('login')">
        <div class="flex gap-3 items-center">
            <p v-if="!onlyIcon" class="font-semibold uppercase text-md">Se connecter</p>
            <i class="text-lg fas fa-sign-in-alt" />
        </div>
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
