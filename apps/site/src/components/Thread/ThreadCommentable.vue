<template>
    <div
        class="flex gap-5 items-stretch p-4 rounded-none shadow-md md:rounded-lg bg-card-within-1 content-parent"
    >
        <div class="flex flex-col gap-1 items-center">
            <UpvoteIcon
                :full="content.interactions.voted === 1"
                :width="'2rem'"
                :height="'2rem'"
                class="hover:text-blue-500 cursor-pointer"
                :class="[content.interactions.voted === 1 ? 'text-green-600' : 'text-5']"
                @click="
                    content.interactions.voted === 1
                        ? threads.voteContent(content.contentId, 0)
                        : threads.voteContent(content.contentId, 1)
                "
            />
            <div class="text-xl">
                {{ abbrNumbers(content.upvotes - content.downvotes) }}
            </div>
            <DownvoteIcon
                :full="content.interactions.voted === -1"
                :width="'2rem'"
                :height="'2rem'"
                class="hover:text-blue-500 cursor-pointer"
                :class="[content.interactions.voted === -1 ? 'text-red-600' : 'text-5']"
                @click="
                    content.interactions.voted === -1
                        ? threads.voteContent(content.contentId, 0)
                        : threads.voteContent(content.contentId, -1)
                "
            />
        </div>
        <!-- <div
            class="flex flex-col shrink-0 gap-2 p-4 w-[12rem] text-lg rounded-none md:rounded-lg md:rounded-r-none bg-card-meta"
        >
            <div class="flex items-center self-center">
                <UpvoteIcon
                    :full="true"
                    :width="'2.5rem'"
                    :height="'2.5rem'"
                    class="p-2 hover:text-blue-500 cursor-pointer"
                    :class="[content.interactions.voted === 1 ? 'text-green-600' : 'text-5']"
                    @click="
                        content.interactions.voted === 1
                            ? threads.voteContent(content.contentId, 0)
                            : threads.voteContent(content.contentId, 1)
                    "
                />

                <div class="text-lg text-center">
                    {{ content.upvotes - content.downvotes }}
                </div>

                <DownvoteIcon
                    :full="true"
                    :width="'2.5rem'"
                    :height="'2.5rem'"
                    class="p-2 hover:text-blue-500 cursor-pointer"
                    :class="[content.interactions.voted === -1 ? 'text-red-600' : 'text-5']"
                    @click="
                        content.interactions.voted === -1
                            ? threads.voteContent(content.contentId, 0)
                            : threads.voteContent(content.contentId, -1)
                    "
                />
            </div>
            <UserPreview :user="content._author" mode="vertical" />
        </div> -->

        <div class="flex flex-col gap-4 w-full">
            <div class="flex flex-row justify-between items-center">
                <div class="flex gap-3 items-center">
                    <UserAvatar
                        :img-src="content._author.avatar"
                        :size="2.5"
                        :username="fullname(content._author)"
                    />
                    <div>
                        {{ fullname(content._author) }}
                    </div>
                    <DatePreview class="text-sm text-2" :date="content.createdAt" />
                </div>
                <div class="flex gap-2 items-center text-3" :class="unfocusedContentClass">
                    <div
                        v-for="(action, i) in actionsShown"
                        :key="i"
                        class="group flex gap-1 items-center px-1 rounded-lg transition cursor-pointer"
                        @click="action.action"
                    >
                        <i class="fas" :class="[`fa-${action.icon}`, action.class]" />
                        <p :class="action.class" class="text-sm">
                            {{ action.name }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="rounded-lg text-0">
                <slot name="content" />
                <div class="flex" :class="unfocusedContentClass">
                    <slot name="actions" />
                </div>
            </div>

            <ThreadCommentList
                :thread-id="content.contentMasterId"
                :parent-id="content.contentId"
                :parent-visible="content.isVisible"
                :comments="content.comments"
                :action-class="unfocusedContentClass"
            />
        </div>

        <!-- <div
            :id="`content-${content.contentId}`"
            class="flex flex-col gap-3 p-4 w-[calc(100%-12rem)] rounded-none md:rounded-lg md:rounded-l-none bg-card-within-1"
        >
            <div class="flex justify-between items-center" :class="unfocusedContentClass">
                <div class="flex gap-1 items-center text-sm text-4">
                    Posté
                    <AppDateAndModified
                        :created-at="content.createdAt"
                        :modified-at="content.lastEdit.createdAt"
                    />
                    <div v-if="content.hidden" class="flex gap-1 items-center ml-4 text-yellow-500">
                        <i class="fas fa-eye-slash" />
                        <div>
                            {{ capitalize(getContentDemonstrative(content.kind)) }}
                            est masqué{{ isContentFeminine(content.kind) ? 'e' : '' }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="rounded-lg text-0">
                <slot name="content" />
                <div class="flex" :class="unfocusedContentClass">
                    <slot name="actions" />
                </div>
            </div>

            <ThreadCommentList
                :thread-id="content.contentMasterId"
                :parent-id="content.contentId"
                :parent-visible="content.isVisible"
                :comments="content.comments"
                :action-class="unfocusedContentClass"
            />
        </div> -->
    </div>
</template>

<script setup>
    // import AppDateAndModified from '../App/AppDateAndModified.vue'
    // import UserPreview from '../App/Preview/UserPreview.vue'
    import ThreadCommentList from './ThreadCommentList.vue'
    import UpvoteIcon from '../App/Icon/UpvoteIcon.vue'
    import DownvoteIcon from '../App/Icon/DownvoteIcon.vue'
    import { fullname } from '@/utils/users'
    import { abbrNumbers } from '@/utils/abbrNumbers'

    import { useThreadsStore } from '@/store/threads.store'

    import { getLinkContent, report } from '@/shared/actions/thread.actions'
    import { computed } from 'vue'

    // import { getContentDemonstrative, isContentFeminine } from '@/shared/types/content-kinds.enum'
    // import { capitalize } from 'lodash'
    import UserAvatar from '../User/UserAvatar.vue'
    import DatePreview from '../App/Preview/DatePreview.vue'

    const threads = useThreadsStore()
    const unfocusedContentClass = ['opacity-60', 'content-show-focused']

    const props = defineProps({
        content: {
            type: Object,
            required: true,
        },
    })

    const actions = [report, getLinkContent]
    const actionsShown = computed(() =>
        actions.map((action) => action(props.content)).filter((action) => action.condition),
    )
</script>

<style lang="scss">
    .content-show-focused {
        transition: opacity 0.5s ease;

        .content-parent:hover & {
            opacity: 1;
        }
    }
</style>
