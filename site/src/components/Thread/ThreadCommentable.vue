<template>
    <div class="flex items-stretch rounded-none shadow-md md:rounded-lg content-parent">
        <div
            class="flex flex-col shrink-0 gap-2 p-4 w-[12rem] text-lg rounded-none md:rounded-lg md:rounded-r-none bg-card-meta"
        >
            <UserPreview :user="content.author" mode="horizontal" />
        </div>

        <div
            class="flex flex-col gap-3 p-4 w-[calc(100%-12rem)] rounded-none md:rounded-lg md:rounded-l-none bg-card-within-1"
        >
            <div class="flex justify-between items-center">
                <div class="flex gap-2 text-sm text-4">
                    <p>Posté {{ createdAt }}</p>
                    <p v-if="content.contentLastUpdatedAt != content.createdAt">
                        Modifié {{ lastUpdatedAt }}
                    </p>
                </div>
                <div class="flex gap-2 items-center content-unfocused text-3">
                    <div
                        v-for="(action, _, i) in actionsMap"
                        :key="i"
                        class="group flex gap-1 items-center px-1 rounded-lg transition cursor-pointer"
                        @click="action.action()"
                    >
                        <font-awesome-icon :icon="action.icon" :class="action.class" />
                        <p :class="action.class" class="text-sm">
                            {{ action.name() }}
                        </p>
                    </div>
                </div>
            </div>
            <div :id="`content-${content.contentId}`" class="rounded-lg text-0">
                <slot name="content" />
            </div>

            <ThreadCommentList
                :parent-id="content.contentId"
                :comments="content.comments"
                class="content-unfocused"
            />
        </div>
    </div>
</template>

<script>
    import UserPreview from '../User/UserPreview.vue'
    import ThreadCommentList from './ThreadCommentList.vue'
    import { timeAgo } from '@/utils/timeAgo'
    import { getURL } from '@/utils/routeUtils'
    import urlJoin from 'url-join'
    import { POST, REPLY } from '@/shared/types/content-kinds.enum'
    export default {
        components: { UserPreview, ThreadCommentList },
        props: {
            content: {
                type: Object,
                required: true,
            },
        },
        computed: {
            actionsMap() {
                return {
                    report: {
                        name: () => (this.content.userReported ? 'Signalé' : 'Signaler'),
                        icon: this.content.userReported ? 'flag' : ['far', 'flag'],
                        class: this.content.userReported
                            ? 'group-hover:text-red-600 text-red-500'
                            : 'group-hover:text-red-500',
                        action: () => {
                            this.content.userReported
                                ? this.$emitter.emit('show-toast', {
                                      text: `Tu as déjà signalé ${this.contentTypeDemonstrative}.`,
                                      type: 'failure',
                                  })
                                : this.$emitter.emit('report', this.content)
                        },
                    },
                    getLink: {
                        name: () => 'Lien',
                        icon: 'link',
                        class: 'group-hover:text-blue-600',
                        action: () => {
                            navigator.clipboard.writeText(
                                getURL(urlJoin(this.$route.path, '#content-' + this.content.contentId)),
                            )
                            this.$emitter.emit('show-toast', {
                                text: `Le lien de ${this.contentTypeDemonstrative} a bien été copié !`,
                                type: 'info',
                            })
                        },
                    },
                }
            },
            contentTypeDemonstrative() {
                return {
                    [POST]: 'ce post',
                    [REPLY]: 'cette réponse',
                }[this.content.kind]
            },
            lastUpdatedAt() {
                return timeAgo(this.content.contentLastUpdatedAt)
            },
            createdAt() {
                return timeAgo(this.content.createdAt)
            },
        },
    }
</script>

<style lang="scss">
    .content-unfocused {
        opacity: 0.8;

        .content-parent:hover & {
            opacity: 1;
        }
    }
</style>
