<template>
    <div v-if="thread" class="card-2 text-2 card-hover flex w-full flex-row gap-6 py-3 pr-7 pl-5">
        <div class="flex flex-col gap-4">
            <VoteInputContent :content="thread.post" />
            <FavoriteInput :content="thread.post" />
        </div>
        <!-- <div class="flex flex-col">
            < :tip="`${threadTypes[thread.type]?.[locale]}`">
                <div
                    class="flex justify-center items-center w-[3.3rem] h-[3.3rem] rounded-lg cursor-pointer"
                    :class="`bg-${threadTypes[thread.type]?.color}-100 dark:bg-${
                        threadTypes[thread.type]?.color
                    }-900`"
                >
                    <i :class="`fas fa-${threadTypes[thread.type]?.icon}`" class="text-xl" />
                </div>
            </>
            < :tip="`${thread.replyCount} réponse${thread.replyCount > 1 ? 's' : ''}`">
                <div
                    class="flex flex-row gap-2 justify-center items-center p-1 mt-3 rounded cursor-pointer select-none"
                    :class="
                        thread.opValidatedWith || thread.adminValidatedWith ? 'bg-green-500 text-white' : ''
                    "
                >
                    <p>{{ (thread.replyCount) }}</p>
                    <i
                        v-if="thread.adminValidatedWith && thread.opValidatedWith"
                        class="fa fa-check-double"
                    />
                    <i v-else-if="thread.opValidatedWith" class="fa fa-check" />
                    <i v-else-if="thread.adminValidatedWith" class="fa fa-shield" />
                    <i v-else class="text-sm fa fa-message" />
                </div>
            </>
        </div> -->
        <div class="flex w-full flex-col gap-2.5">
            <div v-if="!thread.post.isVisible" class="flex items-center gap-1 text-yellow-500">
                <i class="fas fa-eye-slash" />
                <div>
                    {{ capitalize(getContentDemonstrative(POST)) }}
                    est masqué{{ isContentFeminine(POST) ? 'e' : '' }}
                </div>
            </div>

            <div class="flex flex-wrap gap-2">
                <router-link
                    :to="`/forum/post/${thread.id}`"
                    class="text-0 pr-2 font-semibold hover:underline"
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
                <UserActivity :user="thread.post.author">
                    <template #subtitle>
                        <div class="text-4 text-sm">
                            <TipRelativeDateModified
                                action="Publié"
                                :created-at="thread.createdAt"
                                :modified-at="thread.updatedAt"
                            />
                        </div>
                    </template>
                </UserActivity>
            </div>

            <router-link :to="`/forum/post/${thread.id}`" class="text-1 text-justify text-sm line-clamp-2">
                {{ thread.post.body }}
            </router-link>

            <div class="mt-1 flex w-full items-center gap-6 text-xs">
                <!-- <div class="flex gap-2 items-center">
                    <ProfileAvatar
                        :avatar="thread.post.author.avatar"
                        :name="fullname(thread.post.author)"
                        :size="1.8"
                    />
                    <div class="text-xs">
                        {{ fullname(thread.post.author) }}
                        < :tip="getRole(thread.post.author)[locale]">
                            <i class="ml-1" :class="`fa fa-${getRole(thread.post.author).icon}`" />
                        </>
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
            </div>
        </div>
    </div>
    <div v-else class="flex space-x-2 rounded-lg py-3 px-5 font-semibold">
        <p class="text-0 text-lg">Erreur: Ce post est vide.</p>

        <!-- TODO: Bug report pages -->
        <router-link :to="`/report-bug/threads`" class="link-blue text-lg font-semibold line-clamp-1">
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
    import VoteInputContent from '@/components/Input/VoteInputContent.vue'
    import UserActivity from '@/components/App/General/UserActivity.vue'
    import LabelTag from '@/components/UI/Label/LabelTag.vue'

    import { POST } from '@/shared/types/content-kinds.enum'

    import { getContentDemonstrative, isContentFeminine } from '@/shared/types/content-kinds.enum'
    import { capitalize } from 'lodash'
    import FavoriteInput from '@/components/Input/FavoriteInput.vue'
    import TipRelativeDateModified from '@/components/UI/Tip/TipRelativeDateModified.vue'

    // import { useI18n } from 'vue-i18n'

    // const { locale } = useI18n({ useScope: 'global' })

    defineProps({
        thread: {
            type: Object,
            required: true,
        },
        small: {
            type: Boolean,
            default: false,
        },
    })
</script>

<style>
    .icon-color {
        @apply text-gray-300;
    }

    .swiper-slide {
        width: auto;
    }
</style>
