<template>
    <div>
        <template v-for="(comment, i) in commentItems" :key="i">
            <div
                :id="`content-${comment.contentId}`"
                class="flex items-center py-1 px-2.5 mb-1.5 w-full text-sm rounded text-1 bg-1"
                :class="{ 'highlight-active': comment.active }"
            >
                <div
                    class="flex shrink-0 gap-0.5 items-center w-[2rem] cursor-pointer text-5"
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

                <div class="w-[calc(100%-2rem)]">
                    <div v-if="comment.hidden" class="flex gap-1 items-center text-yellow-500">
                        <font-awesome-icon icon="exclamation-triangle" />
                        <div>
                            {{ capitalize(contentTypeDemonstrative[comment.kind][i18n.global.locale]) }}
                            est masqué{{
                                i18n.global.locale == 'fr' &&
                                contentTypeDemonstrative[comment.kind].frFeminine
                                    ? 'e'
                                    : ''
                            }}
                        </div>
                    </div>
                    <span class="w-full">
                        <!-- Violating props immutability? -->
                        <TipTapEditableRender
                            v-model:edit="comments[i].editing"
                            :content="comment.body"
                            class="p-0 mr-1.5"
                            :class="[!comment.editing ? 'render-inline' : 'w-full']"
                            :="editorConfig"
                            @send="
                                threads.updateContent(threadId, {
                                    contentId: comment.contentId,
                                    body: $event,
                                })
                            "
                        />
                        <span v-if="!comment.editing" class="inline-flex gap-1 items-center tracking-tight">
                            <span class="link-blue">{{ comment._author.fullnameShort }}</span>
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
                                            <font-awesome-icon :icon="action.icon" :class="action.class" />
                                            <template #content>
                                                {{ action.name }}
                                            </template>
                                        </Popper>
                                    </div>
                                    <div
                                        class="text-sm rounded-lg cursor-pointer comment-ellipsis-dropdown text-5"
                                    >
                                        <DropDownInput :buttons="hiddenActions(i)">
                                            <font-awesome-icon
                                                icon="ellipsis-h"
                                                class="py-1 px-2 comment-ellipsis-dropdown-icon"
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
            <div v-if="commentsShow" class="text-xs">Cacher les commentaires</div>
            <div v-else>
                Voir <strong>{{ comments.length - maxCommentsShow }}</strong>
                {{ comments.length - maxCommentsShow > 1 ? 'commentaires' : 'commentaire' }}
            </div>
        </div>

        <div v-if="commenting" class="flex mt-2">
            <TipTapEditor
                v-model="newComment"
                class="w-full"
                :="editorConfig"
                :sendable="true"
                :cancellable="true"
                @send="threads.addContent(threadId, { parentId, body: newComment }, COMMENT)"
                @cancel="commenting = false"
            />
        </div>

        <div
            v-else
            class="group flex gap-2 items-center pl-2 mt-2 w-fit cursor-pointer"
            :class="actionClass"
            @click="commenting = true"
        >
            <font-awesome-icon
                :icon="['far', 'comment-alt']"
                class="group-hover:text-gray-700 dark:group-hover:text-gray-300 text-5"
            />
            <p class="text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 text-5">Commenter</p>
        </div>
    </div>
</template>

<script setup>
    import TipTapEditableRender from '@/components/TipTap/TipTapEditableRender.vue'
    import TipTapEditor from '@/components/TipTap/TipTapEditor.vue'

    import DropDownInput from '@/components/Input/DropDownInput.vue'
    import UpvoteIcon from '@/components/App/Icon/UpvoteIcon.vue'

    import Popper from 'vue3-popper'

    import { defaultTipTapText } from '@/utils/tiptap'

    import { i18n } from '@/shared/modules/i18n'

    import { edit, removeContent, favorite, getLinkContent, report } from '@/shared/actions/thread.actions'
    import { COMMENT } from '@/shared/types/content-kinds.enum'
    import { contentTypeDemonstrative } from '@/shared/types/content-kinds.enum'

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
            [edit, removeContent]
                .map((action) => action(props.comments[i]))
                .filter((action) => action.condition),
    )
    const hiddenActions = computed(
        () => (i) => [favorite, report, getLinkContent].map((action) => action(props.comments[i], true)),
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

    const commentsShow = ref(false)
    const commentItems = computed(() => {
        const items = props.comments.map((comment) => ({
            ...comment,
            edit: false,
        }))
        return commentsShow.value ? items : items.slice(0, maxCommentsShow)
    })

    const commenting = ref(false)
    const newComment = ref(defaultTipTapText)

    const toggleComments = () => {
        commentsShow.value = !commentsShow.value
        commentItems.value.slice(maxCommentsShow, props.comments.length).forEach((comment) => {
            comment.active = commentsShow.value
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
