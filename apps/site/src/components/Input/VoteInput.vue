<template>
    <div class="flex flex-col gap-2 items-center w-6">
        <IconUpvote
            :full="displayedVote === 1"
            :width="`${width}rem`"
            :height="`${width * (7 / 6)}rem`"
            class="hover:text-blue-500 cursor-pointer"
            :class="[displayedVote === 1 ? 'text-green-600' : 'text-5']"
            @click="() => (displayedVote === 1 ? unvote(1) : upvote())"
        />
        <div :class="numberTextClass">
            {{ abbrNumbers(displayedUpvotes - displayedDownvotes) }}
        </div>
        <IconDownvote
            :full="displayedVote === -1"
            :width="`${width}rem`"
            :height="`${width * (7 / 6)}rem`"
            class="hover:text-blue-500 cursor-pointer"
            :class="[displayedVote === -1 ? 'text-red-600' : 'text-5']"
            @click="() => (displayedVote === -1 ? unvote(-1) : downvote())"
        />
    </div>
</template>

<script setup>
    import { emitter } from '@/shared/modules/emitter'

    import IconUpvote from '@/icons/IconUpvote.vue'
    import IconDownvote from '@/icons/IconDownvote.vue'

    import { abbrNumbers } from '@/utils/abbrNumbers'
    import { ref, watchEffect } from 'vue'

    const props = defineProps({
        downvotes: {
            type: Number,
            required: true,
        },
        upvotes: {
            type: Number,
            required: true,
        },
        vote: {
            type: Number,
            required: true,
        },
        width: {
            type: Number,
            default: 1,
        },
        numberTextClass: {
            type: String,
            default: 'text-lg font-semibold',
        },
        voteAction: {
            type: Function,
            required: true,
        },
    })

    const tryVote = async (vote) => {
        await props.voteAction(vote).catch((err) => {
            displayedUpvotes.value = props.upvotes
            displayedDownvotes.value = props.downvotes
            displayedVote.value = props.vote
            emitter.emit('show-toast', {
                message: `Échec du vote ! Erreur : ${err.message}`,
                type: 'error',
            })
        })
    }

    const displayedUpvotes = ref(props.upvotes)
    const displayedDownvotes = ref(props.downvotes)
    const displayedVote = ref(props.vote)

    watchEffect(() => {
        displayedUpvotes.value = props.upvotes
        displayedDownvotes.value = props.downvotes
        displayedVote.value = props.vote
    })

    const unvote = async (vote) => {
        if (vote === 1) {
            displayedUpvotes.value -= 1
        } else {
            displayedDownvotes.value -= 1
        }
        displayedVote.value = 0
        await tryVote(0)
    }

    const upvote = async () => {
        if (displayedVote.value === -1) {
            displayedDownvotes.value -= 1
        }
        displayedUpvotes.value += 1
        displayedVote.value = 1
        await tryVote(1)
    }

    const downvote = async () => {
        if (displayedVote.value === 1) {
            displayedUpvotes.value -= 1
        }
        displayedDownvotes.value += 1
        displayedVote.value = -1
        await tryVote(-1)
    }
</script>
