<template>
    <div
        class="flex gap-5 items-stretch p-4 rounded-none shadow-md md:rounded-lg bg-card-within-1 content-parent"
        :class="
            thread.adminValidatedWith?.contentId === content.contentId
                ? 'border-2 border-orange-600'
                : thread.opValidatedWith?.contentId === content.contentId
                ? 'border-2 border-green-600'
                : ''
        "
    >
        <div class="flex flex-col gap-1 items-center">
            <VoteInput
                :downvotes="content.downvotes"
                :upvotes="content.upvotes"
                :vote="content.interactions.voted"
                :vote-action="(vote) => threads.voteContent(content.contentId, vote)"
            />
        </div>

        <div class="flex flex-col gap-4 w-full">
            <div class="flex flex-row justify-between items-center">
                <div class="flex gap-3 items-center">
                    <UserActivity
                        :user="content._author"
                        :action-at="content.createdAt"
                        action-text="Publié"
                    />
                    <!-- <ProfileAvatar
                        :avatar="content._author.avatar"
                        :size="2.5"
                        :name="fullname(content._author)"
                    />
                    <div>
                        {{ fullname(content._author) }}
                    </div>
                    <TipRelativeDate class="text-sm text-2" :date="content.createdAt" /> -->

                    <template v-if="thread.post.contentId !== content.contentId">
                        <i
                            v-if="thread.opValidatedWith?.contentId === content.contentId"
                            class="text-base text-green-600 fa fa-check"
                        />
                        <i
                            v-else-if="thread.post.author === auth.user.userId"
                            class="text-sm cursor-pointer fa fa-check text-5"
                            @click="
                                threads.validateThreadWithContent(content.contentMasterId, content.contentId)
                            "
                        />

                        <LabelTag
                            v-if="thread.adminValidatedWith?.contentId === content.contentId"
                            tag-name="Officiel"
                            tag-color="orange"
                        />
                        <i
                            v-else-if="auth.user.roles.includes('admin')"
                            class="text-sm cursor-pointer fa fa-check-double text-5"
                            @click="
                                threads.validateThreadWithContent(
                                    content.contentMasterId,
                                    content.contentId,
                                    true,
                                )
                            "
                        />
                    </template>
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
                    <TipRelativeDateModified
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
    // import TipRelativeDateModified from '@/components/UI/Tip/TipRelativeDateModified.vue'
    // import UserPreview from '../App/Preview/UserPreview.vue'
    import ThreadCommentList from './ThreadCommentList.vue'
    import LabelTag from '@/components/UI/Label/LabelTag.vue'
    import VoteInput from '@/components/Input/VoteInput.vue'
    import UserActivity from '../App/General/UserActivity.vue'

    import { computed } from 'vue'

    import { getLinkContent, report } from '@/shared/actions/thread.actions'

    import { useThreadsStore } from '@/store/threads.store'
    import { useAuthStore } from '@/store/auth.store'

    // import { getContentDemonstrative, isContentFeminine } from '@/shared/types/content-kinds.enum'
    // import { capitalize } from 'lodash'

    const threads = useThreadsStore()
    const auth = useAuthStore()

    const props = defineProps({
        content: {
            type: Object,
            required: true,
        },
    })

    const thread = threads.threads.find((thread) => thread.contentMasterId === props.content.contentMasterId)
    const unfocusedContentClass = ['opacity-60', 'content-show-focused']

    const actions = [report, getLinkContent]
    const actionsShown = computed(() =>
        actions.map((action) => action(props.content)).filter((action) => action.condition),
    )
</script>
