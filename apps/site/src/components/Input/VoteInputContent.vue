<template>
    <VoteInput
        :downvotes="content.downvoteCount"
        :upvotes="content.upvoteCount"
        :vote="content.interactions.userVoted"
        :vote-action="(vote) => voteContent({ id: content.id, value: vote })"
    />
</template>

<script setup>
    import VoteInput from '@/components/Input/VoteInput.vue'
    import { useMutation } from '@vue/apollo-composable'
    import { vote } from '@/graphql/queries/interactions/voteContent'

    defineProps({
        content: {
            type: Object,
            required: true,
        },
    })

    const { mutate: voteContent } = useMutation(vote)
</script>
