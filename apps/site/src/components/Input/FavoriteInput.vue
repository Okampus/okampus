<template>
    <div
        class="group flex cursor-pointer flex-col items-center gap-1 text-lg"
        @click="favoriteContent({ id: content.id, favorite: !content.interactions.userFavorited })"
    >
        <i
            :class="`${
                content?.interactions?.userFavorited ? 'text-yellow-400 fas' : 'text-4 far'
            } fa-star group-hover:text-yellow-600`"
        />
        <div v-if="showNumber" class="text-3 text-xs">{{ content.favoriteCount }}</div>
    </div>
</template>

<script setup>
    import { useMutation } from '@vue/apollo-composable'
    import { favorite } from '@/graphql/queries/interactions/createFavorite'

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
