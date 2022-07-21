<template>
    <div
        class="flex flex-col gap-1 items-center text-lg cursor-pointer"
        @click="favoriteContent({ id: content.id, favorite: !content.interactions.userFavorited })"
    >
        <i
            :class="`${
                content?.interactions?.userFavorited ? 'text-yellow-400 fas' : 'text-4 far'
            } fa-star hover:text-yellow-600`"
        />
        <div v-if="showNumber" class="text-xs text-3">{{ content.favoriteCount }}</div>
    </div>
</template>

<script setup>
    import { useMutation } from '@vue/apollo-composable'
    import { favorite } from '@/graphql/queries/interactions/favoriteContent'

    const { mutate: favoriteContent } = useMutation(favorite)

    defineProps({
        content: {
            type: Object,
            required: true,
        },
        showNumber: {
            type: Boolean,
            default: true,
        },
    })
</script>
