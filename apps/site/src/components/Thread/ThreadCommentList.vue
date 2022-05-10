<template>
    <!-- TODO: Refactor component -->
    <div>
        <template v-for="(comment, i) in shownComments" :key="i">
            <div
                :id="`content-${comment.contentId}`"
                class="flex items-center py-1 px-2.5 mb-1.5 w-full text-sm rounded text-1 bg-1"
                :class="{ 'highlight-active': comment.active }"
            >
                <div
                    class="flex shrink-0 gap-0.5 items-center w-[2.5rem] cursor-pointer text-5"
                    @click="
                        comment.interactions.voted === 1
                            ? threads.voteContent(comment.contentId, 0)
                            : threads.voteContent(comment.contentId, 1)
                    "
                >
                    <UpvoteIcon
                        :full="true"
                        :width="12"
                        :class="comment.interactions.voted === 1 ? 'fill-green-500' : 'fill-gray-500'"
                    />
                    {{ comment.upvotes }}
                </div>

                <div class="w-[calc(100%-2.5rem)]">
                    <div v-if="comment.hidden" class="flex gap-1 items-center text-yellow-500">
                        <i class="fas fa-eye-slash" />
                        <div>
                            {{ capitalize(getContentName(comment.kind)) }}
                            masqué{{ isContentFeminine(comment.kind) ? 'e' : '' }}
                        </div>
                    </div>
                    <span class="flex flex-wrap items-center w-full">
                        <MdEditableRender
                            v-model:edit="editing[i].value"
                            :content="comment.body"
                            class="p-0 mr-1.5"
                            :class="[!comment.editing ? 'render-inline' : 'w-full']"
                            v-bind="editorConfig"
                            :uid="`comment-${threadId}-${comment.contentId}`"
                            @send="editComment($event, i)"
                        />
                        <span v-if="!comment.editing" class="inline-flex gap-1 items-center tracking-tight">
                            <span class="link-blue">{{ comment._author.fullname }}</span>
                            <AppDateAndModified
                                :created-at="comment.createdAt"
                                :modified-at="comment.lastEdit.createdAt"
                            />
                            <span class="inline-flex gap-10 items-center">
                                <div class="flex items-center">
                                    <div
                                        v-for="(action, actionName) in actions(i)"
                                        :key="actionName"
                                        class="group py-1 px-2 text-sm rounded-lg cursor-pointer text-5"
                                        @click="action.action()"
                                    >
                                        <Popper
                                            :hover="true"
                                            placement="top"
                                            :arrow="true"
                                            offset-distance="3"
                                        >
                                            <i :class="[action.icon, action.class]" />
                                            <template #content>
                                                <div class="card-tip">{{ action.name }}</div>
                                            </template>
                                        </Popper>
                                    </div>
                                    <div
                                        class="text-sm rounded-lg cursor-pointer comment-ellipsis-dropdown text-5"
                                    >
                                        <DropDownInput :buttons="hiddenActions(i)">
                                            <i
                                                class="py-1 px-2 fas fa-ellipsis-h comment-ellipsis-dropdown-icon"
                                            />
                                        </DropDownInput>
                                    </div>
                                </div>
                            </span>
                        </span>
                    </span>
                </div>
            </div>
        </template>

        <div
            v-if="comments.length > maxCommentsShow"
            class="mb-1 ml-1 text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
            @click="toggleComments"
        >
            <div v-if="showAll" class="text-xs">Cacher les commentaires</div>
            <div v-else>
                Voir <strong>{{ comments.length - maxCommentsShow }}</strong>
                {{ comments.length - maxCommentsShow > 1 ? 'commentaires' : 'commentaire' }}
            </div>
        </div>

        <div v-if="commenting" class="flex mt-2">
            <MdEditor
                v-model="newComment"
                :uid="`new-comment-${threadId}-${parentId}`"
                class="w-full"
                v-bind="editorConfig"
                :sendable="true"
                :cancellable="true"
                @send="sendComment"
                @cancel="commenting = false"
            />
        </div>
        <div
            v-else-if="parentVisible"
            class="group flex gap-2 items-center mt-2 w-fit cursor-pointer"
            :class="actionClass"
            @click="commenting = true"
        >
            <i class="group-hover:text-gray-700 dark:group-hover:text-gray-300 far fa-comment-alt text-5" />
            <p class="text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 text-5">Commenter</p>
        </div>
    </div>
</template>

<script setup>
    import MdEditableRender from '@/components/App/Editor/MdEditableRender.vue'
    import MdEditor from '@/components/App/Editor/MdEditor.vue'

    import DropDownInput from '@/components/Input/DropDownInput.vue'
    import UpvoteIcon from '@/components/App/Icon/UpvoteIcon.vue'

    import Popper from 'vue3-popper'

    import { edit, removeContent, favorite, getLinkContent, report } from '@/shared/actions/thread.actions'
    import { COMMENT } from '@/shared/types/content-kinds.enum'
    import { isContentFeminine, getContentName } from '@/shared/types/content-kinds.enum'

    import { useAuthStore } from '@/store/auth.store'
    import { useThreadsStore } from '@/store/threads.store'

    import { capitalize } from 'lodash'

    import { computed, ref } from 'vue'
    import AppDateAndModified from '../App/AppDateAndModified.vue'

    const auth = useAuthStore()
    const threads = useThreadsStore()

    const props = defineProps({
        threadId: {
            type: Number,
            required: true,
        },
        parentId: {
            type: Number,
            required: true,
        },
        parentVisible: {
            type: Boolean,
            default: false,
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

    const actions = computed(
        () => (i) =>
            [favorite, edit].map((action) => action(props.comments[i])).filter((action) => action.condition),
    )
    const hiddenActions = computed(
        () => (i) => [removeContent, report, getLinkContent].map((action) => action(props.comments[i], true)),
    )

    const maxCommentsShow = 2

    const commentLimit = 240
    const editorConfig = {
        charCount: commentLimit,
        textClass: 'text-sm',
        editorClasses: ['text-sm'],
        editorButtons: [],
        placeholder: `${auth.user?.fullname} va commenter...`,
    }

    const showAll = ref(false)
    const shownComments = computed(() =>
        showAll.value ? props.comments : props.comments.slice(0, maxCommentsShow),
    )

    const editing = computed(() =>
        shownComments.value.map((comment) =>
            computed({
                get: () => comment.editing,
                set: (v) => threads.editingContent(comment.contentId, v),
            }),
        ),
    )
    const commenting = ref(false)
    const newComment = ref('')

    const sendComment = () => {
        threads.addContent(props.threadId, { parentId: props.parentId, body: newComment.value }, COMMENT)
        newComment.value = ''
        commenting.value = false
    }

    const editComment = (body, i) => {
        threads.updateContent(props.threadId, {
            parentId: props.parentId,
            contentId: props.comments[i].contentId,
            body,
        })
    }

    const toggleComments = () => {
        showAll.value = !showAll.value
        shownComments.value.slice(maxCommentsShow, props.comments.length).forEach((comment) => {
            comment.active = showAll.value
        })
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
