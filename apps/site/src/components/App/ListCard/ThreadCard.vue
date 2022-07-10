<template>
    <div v-if="thread" class="flex flex-row gap-6 py-3 pr-7 pl-5 w-full card-2 text-2 card-hover">
        <VoteInput
            :downvotes="post.downvotes"
            :upvotes="post.upvotes"
            :vote="thread.vote"
            :vote-action="(vote) => threads.voteContent(post.contentId, vote)"
        />
        <!-- <div class="flex flex-col">
            <TipPopper :tip="`${threadTypes[thread.type]?.[$i18n.locale]}`">
                <div
                    class="flex justify-center items-center w-[3.3rem] h-[3.3rem] rounded-lg cursor-pointer"
                    :class="`bg-${threadTypes[thread.type]?.color}-100 dark:bg-${
                        threadTypes[thread.type]?.color
                    }-900`"
                >
                    <i :class="`fas fa-${threadTypes[thread.type]?.icon}`" class="text-xl" />
                </div>
            </TipPopper>
            <TipPopper :tip="`${thread.replyCount} réponse${thread.replyCount > 1 ? 's' : ''}`">
                <div
                    class="flex flex-row gap-2 justify-center items-center p-1 mt-3 rounded cursor-pointer select-none"
                    :class="
                        thread.opValidatedWith || thread.adminValidatedWith ? 'bg-green-500 text-white' : ''
                    "
                >
                    <p>{{ abbrNumbers(thread.replyCount) }}</p>
                    <i
                        v-if="thread.adminValidatedWith && thread.opValidatedWith"
                        class="fa fa-check-double"
                    />
                    <i v-else-if="thread.opValidatedWith" class="fa fa-check" />
                    <i v-else-if="thread.adminValidatedWith" class="fa fa-shield" />
                    <i v-else class="text-sm fa fa-message" />
                </div>
            </TipPopper>
        </div> -->
        <div class="flex flex-col gap-2.5 w-full">
            <div class="flex flex-wrap gap-2">
                <router-link
                    :to="`/forum/post/${thread.contentMasterId}`"
                    class="pr-2 font-semibold hover:underline text-0"
                    :class="small ? 'text-base' : 'text-xl'"
                >
                    {{ thread.title }}
                </router-link>
                <LabelTag
                    v-for="(tag, i) in thread.tags"
                    :key="i"
                    class="inline"
                    :class="small ? 'text-xs' : 'text-sm'"
                    :tag-name="tag.name"
                />
            </div>

            <div class="flex">
                <UserActivity
                    :user="thread._post?._author ?? thread.post.author"
                    action-text="Publié"
                    :action-at="thread.createdAt"
                />
            </div>

            <div class="text-sm text-justify line-clamp-2 text-1">
                {{ thread.post.body }}
            </div>

            <div class="flex gap-6 items-center mt-1 w-full text-xs">
                <!-- <div class="flex gap-2 items-center">
                    <ProfileAvatar
                        :avatar="thread.post.author.avatar"
                        :name="fullname(thread.post.author)"
                        :size="1.8"
                    />
                    <div class="text-xs">
                        {{ fullname(thread.post.author) }}
                        <TipPopper :tip="getRole(thread.post.author)[$i18n.locale]">
                            <i class="ml-1" :class="`fa fa-${getRole(thread.post.author).icon}`" />
                        </TipPopper>
                    </div>
                </div>
                <div class="flex gap-2 items-center">
                    <i class="text-base fa fa-calendar icon-color" />
                    <TipRelativeDate class="ml-2" :date="thread.createdAt" />
                </div>
                <div
                    v-if="thread.createdAt !== thread.post.lastEdit.createdAt"
                    class="flex gap-2 items-center"
                >
                    <i class="text-base fa fa-clock-rotate-left icon-color" />
                    <TipRelativeDate class="ml-2" :date="thread.createdAt" />
                </div> -->
                <!-- <Carousel class="mx-6 w-[calc(100%-4rem)]" :settings="settings" :breakpoints="breakpoints">
                    <Slide v-for="tag in thread.tags" :key="tag">
                        <LabelTag :tag-name="tag.name" />
                    </Slide>

                    <template #addons>
                        <Navigation />
                    </template>
                </Carousel> -->
            </div>
            <!-- <Carousel class="mx-6 w-[calc(100%-4rem)]" :settings="settings" :breakpoints="breakpoints">
                <Slide v-for="tag in thread.tags" :key="tag">
                    <LabelTag :tag-name="tag.name" />
                </Slide>

                <template #addons>
                    <Navigation />
                </template>
            </Carousel> -->
        </div>
    </div>
    <div v-else class="flex py-3 px-5 space-x-2 font-semibold rounded-lg">
        <p class="text-lg text-0">Erreur: Ce post est vide.</p>

        <!-- TODO: Bug report pages -->
        <router-link :to="`/report-bug/threads`" class="text-lg font-semibold line-clamp-1 link-blue">
            Signalez ce bug !
        </router-link>
    </div>

    <!-- <swiper slides-per-view="auto" class="w-[calc(100%-4rem)]">
        <swiper-slide v-for="tag in thread.tags" :key="tag">
            <LabelTag :tag-name="tag.name" />
        </swiper-slide>
    </swiper> -->
</template>

<script setup>
    // Import Swiper Vue.js components
    // import { Swiper, SwiperSlide } from 'swiper/vue'

    // Import Swiper styles
    import 'swiper/css'

    import VoteInput from '@/components/Input/VoteInput.vue'
    import UserActivity from '@/components/App/General/UserActivity.vue'
    // import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import LabelTag from '@/components/UI/Label/LabelTag.vue'
    // import TipPopper from '@/components/UI/Tip/TipPopper.vue'
    // import IconUpvote from '@/icons/IconUpvote.vue'
    // import IconDownvote from '@/icons/IconDownvote.vue'
    // import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'

    // import { fullname, getRole } from '@/utils/users'
    // import TagList from '@/components/List/TagList.vue'
    // import UserPreview from '@/components/App/Preview/UserPreview.vue'

    // import Popper from 'vue3-popper'
    import { useThreadsStore } from '@/store/threads.store'
    import { computed } from 'vue'
    import { POST } from '@/shared/types/content-kinds.enum'

    // import threadTypes from '@/shared/types/thread-types.enum'

    // import { timeAgo } from '@/utils/timeAgo'
    // import { abbrNumbers } from '@/utils/abbrNumbers'

    const props = defineProps({
        thread: {
            type: Object,
            required: true,
        },
        small: {
            type: Boolean,
            default: false,
        },
    })

    const threads = useThreadsStore()
    const post = computed(() => props.thread.contents.find((c) => c.kind === POST))
</script>

<style>
    .icon-color {
        @apply text-gray-300;
    }

    .swiper-slide {
        width: auto;
    }
</style>
