<template>
    <!-- TODO: Refactor component -->
    <div class="flex flex-col gap-2">
        <div class="flex flex-col gap-1">
            <ThreadComment
                v-for="(comment, i) in shownComments"
                :key="i"
                v-model:active="commentsActive[i]"
                :comment="comment"
                :thread="thread"
            />
        </div>

        <div
            v-if="comments.length > maxCommentsShow"
            class="mb-3 ml-1 cursor-pointer text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
            @click="toggleComments"
        >
            <div v-if="showAll" class="text-xs">
                Cacher ({{ comments.length - maxCommentsShow }})
                {{ comments.length - maxCommentsShow > 1 ? 'commentaires' : 'commentaire' }}
            </div>
            <div v-else>
                Voir <strong>{{ comments.length - maxCommentsShow }}</strong>
                {{ comments.length - maxCommentsShow > 1 ? 'commentaires' : 'commentaire' }}
            </div>
        </div>

        <div v-if="commenting" class="mt-2 flex">
            <MdEditor
                v-model="body"
                :uid="`new-comment-${thread.id}-${parent.id}`"
                class="w-full"
                v-bind="editorConfig"
                :sendable="true"
                :cancellable="true"
                @send="addComment({ child: { parentId: parent.id, contentKind: COMMENT, body } })"
                @cancel="commenting = false"
            />
        </div>
        <div
            v-else-if="parent.isVisible"
            class="group flex w-fit cursor-pointer items-center gap-2 px-1"
            :class="actionClass"
            @click="commenting = true"
        >
            <i class="far fa-comment-alt text-2 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            <p class="text-2 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300">Commenter</p>
        </div>
    </div>
</template>

<script setup>
    import MdEditor from '@/components/Input/Editor/MdEditor.vue'
    import ThreadComment from '@/components/Thread/ThreadComment.vue'

    import { COMMENT } from '@/shared/types/content-kinds.enum'

    import { fullname } from '@/utils/users'
    import { addContent } from '@/graphql/queries/threads/addContent'
    import { useMutation } from '@vue/apollo-composable'

    import { computed, ref, watch } from 'vue'

    import { useAuthStore } from '@/store/auth.store'
    import { useRoute } from 'vue-router'
    import { highlightElement } from '@/utils/domUtils.js'

    const route = useRoute()
    const auth = useAuthStore()

    const props = defineProps({
        thread: {
            type: Object,
            required: true,
        },
        parent: {
            type: Object,
            required: true,
        },
        comments: {
            type: Array,
            default: () => [],
        },
        maxCommentsShow: {
            type: Number,
            default: 2,
        },
        actionClass: {
            type: [String, Array],
            default: '',
        },
    })

    const commentsActive = ref(props.comments.map(() => false))
    watch(
        () => props.comments.length,
        () => props.comments.map(() => false),
    )

    const toggleComments = () => {
        showAll.value = !showAll.value
        if (showAll.value) {
            for (let i = maxCommentsShow; i < props.comments.length; i++) {
                commentsActive.value[i] = true
            }
        }
    }

    const commenting = ref(false)
    const body = ref('')
    const showAll = ref(false)

    const { mutate: addComment, onDone } = useMutation(addContent)
    onDone(() => {
        showAll.value = true
        commentsActive.value = props.comments.map(() => false)
        commentsActive.value[props.comments.length] = true

        commenting.value = false
    })

    const maxCommentsShow = 2

    const editorConfig = {
        charCount: 240,
        textClass: 'text-sm',
        editorClasses: ['text-sm'],
        editorButtons: [],
        placeholder: `${fullname(auth.user)} va commenter...`,
    }

    const shownComments = computed(() =>
        showAll.value ? props.comments : props.comments.slice(0, maxCommentsShow),
    )

    // Handle highlight scroll on hidden comments
    if (route.hash) {
        const commentId = parseInt(route.hash.slice(9))
        const commentIndex = props.comments.findIndex((comment) => comment.id === commentId)
        if (commentIndex >= maxCommentsShow) {
            showAll.value = true
            const el = document.querySelector(route.hash)
            if (el) highlightElement(el)
        }
    }
</script>

<style lang="scss">
    .render-inline {
        display: inline;

        & * {
            display: inline;
        }
    }

    .comment-ellipsis-dropdown {
        &:hover .comment-ellipsis-dropdown-icon {
            @apply text-black dark:text-white;
        }
    }
</style>
