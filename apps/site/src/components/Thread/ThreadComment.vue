<template>
    <div
        :id="`comment-${comment.id}`"
        class="text-1 bg-1 flex w-full items-center rounded py-1.5 px-2.5 text-sm"
        :class="{ 'highlight-active': active }"
        @animationend="emit('update:active', false)"
    >
        <div
            class="text-5 flex shrink-0 cursor-pointer items-center gap-1"
            @click="voteContent({ id: comment.id, value: comment.interactions.userVoted === 1 ? 0 : 1 })"
        >
            <IconUpvote
                :full="true"
                :width="0.8"
                :class="comment.interactions.userVoted === 1 ? 'fill-green-500' : 'fill-gray-500'"
            />
            <div class="text-3 w-[1rem] text-center text-xs">{{ comment.upvoteCount }}</div>
        </div>

        <div
            class="text-5 ml-2 flex w-[3rem] shrink-0 cursor-pointer items-center gap-1"
            @click="favoriteContent({ id: comment.id, favorite: !comment.interactions.userFavorited })"
        >
            <i
                :class="`${
                    comment.interactions?.userFavorited ? 'text-yellow-400 fas' : 'text-4 far'
                } fa-star hover:text-yellow-600`"
            />
            <div class="text-3 w-[1rem] text-center text-xs">{{ comment.favoriteCount }}</div>
        </div>

        <div class="w-[calc(100%-2.5rem)]">
            <span class="flex w-full flex-wrap items-center">
                <MdEditableRender
                    v-model:edit="editing"
                    :content="comment.body"
                    class="mr-1.5 p-0"
                    :class="[!editing ? 'render-inline' : 'w-full']"
                    v-bind="editorConfig"
                    :uid="`comment-${thread.id}-${comment.id}`"
                    @send="updateContent({ id: comment.id, content: { body } })"
                />
                <span v-if="!editing" class="ml-3 inline-flex items-center gap-2 tracking-tight">
                    <router-link :to="`/user/${comment.author.id}`" class="flex items-center gap-1.5">
                        <ProfileAvatar
                            :size="1.5"
                            :avatar="comment.author.avatar"
                            :name="fullname(comment.author)"
                        />
                        <div
                            :class="
                                authorIsOp
                                    ? 'cursor-pointer h-fit px-1.5 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400 rounded-full'
                                    : 'link-blue'
                            "
                        >
                            {{ fullname(comment.author) }}
                        </div>
                    </router-link>
                    <TipRelativeDateModified
                        :created-at="comment.createdAt"
                        :modified-at="comment.lastEdit.createdAt"
                        class="text-4"
                    />
                    <span class="inline-flex items-center gap-10">
                        <div class="flex items-center">
                            <div
                                v-for="(action, i) in actionsShown"
                                :key="i"
                                class="group text-5 cursor-pointer rounded-lg py-1 px-2 text-sm"
                                @click="action.action"
                            >
                                <Popper :hover="true" placement="top" :arrow="true" offset-distance="3">
                                    <i :class="[action.icon, action.class]" />
                                    <template #content>
                                        <div class="card-tip">{{ action.name }}</div>
                                    </template>
                                </Popper>
                            </div>
                            <div class="comment-ellipsis-dropdown text-5 cursor-pointer rounded-lg text-sm">
                                <ModalDropdown :buttons="hiddenActionsShown">
                                    <i class="fas fa-ellipsis-h comment-ellipsis-dropdown-icon py-1 px-2" />
                                </ModalDropdown>
                            </div>
                        </div>
                    </span>
                </span>

                <div v-if="!comment.isVisible" class="ml-2 flex items-center gap-1 text-yellow-500">
                    <i class="fas fa-eye-slash" />
                    <div>
                        {{ capitalize(getContentName(comment.kind)) }}
                        masqué{{ isContentFeminine(comment.kind) ? 'e' : '' }}
                    </div>
                </div>
            </span>
        </div>
    </div>
</template>

<script setup>
    import IconUpvote from '@/icons/IconUpvote.vue'
    import ModalDropdown from '@/components/UI/Modal/ModalDropdown.vue'
    import MdEditableRender from '@/components/Input/Editor/MdEditableRender.vue'
    import TipRelativeDateModified from '@/components/UI/Tip/TipRelativeDateModified.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import Popper from 'vue3-popper'

    import { capitalize, computed, nextTick, ref } from 'vue'
    import { useAuthStore } from '@/store/auth.store'
    import { emitter } from '@/shared/modules/emitter'
    import {
        getContentDemonstrative,
        getContentName,
        isContentFeminine,
    } from '@/shared/types/content-kinds.enum'
    import router from '@/router'
    import { getURL } from '@/utils/routeUtils'
    import urlJoin from 'url-join'
    import { useMutation } from '@vue/apollo-composable'
    import { editContent } from '@/graphql/queries/editContent'
    import { vote } from '@/graphql/queries/interactions/voteContent'
    import { fullname } from '@/utils/users'
    import { favorite } from '@/graphql/queries/interactions/favoriteContent'
    import { useRoute } from 'vue-router'
    import { showErrorToast, showInfoToast, showWarningToast } from '@/utils/toast.js'

    const auth = useAuthStore()
    const route = useRoute()

    const props = defineProps({
        active: {
            type: Boolean,
            default: false,
        },
        comment: {
            type: Object,
            required: true,
        },
        thread: {
            type: Object,
            required: true,
        },
    })

    nextTick(() => {
        if (route.hash === `#comment-${props.comment.id}`)
            emitter.emit('scroll-to-anchor', `#comment-${props.comment.id}`)
    })

    const emit = defineEmits(['update:active'])

    const body = ref(props.comment.body)
    const editing = ref(false)

    const authorIsOp = computed(() => props.thread.post.author.id === props.comment.author.id)
    const userIsAuthor = computed(() => props.thread.post.author.id === auth.user.id)
    const userIsAdmin = computed(() => auth.user?.roles?.includes('admin'))

    const { mutate: voteContent } = useMutation(vote)
    const { mutate: favoriteContent } = useMutation(favorite)

    const { mutate: updateContent, onError } = useMutation(editContent)
    onError(() => (body.value = props.comment.body))

    const actions = [
        {
            name: 'Éditer',
            condition: () => (userIsAuthor.value && props.comment.isVisible) || userIsAdmin.value,
            icon: 'fas fa-pen',
            class: 'hover:text-green-600',
            action: () => {
                editing.value = true
            },
        },
    ]
    const hiddenActions = [
        {
            name: computed(() => (props.comment.interactions.userReported ? 'Signalé' : 'Signaler')),
            condition: () => props.comment.isVisible,
            icon: props.comment.interactions.userReported ? 'fas fa-flag' : 'far fa-flag',
            class: [
                props.comment.interactions.userReported ? 'text-red-500 ' : '',
                'hover:bg-red-500 hover:text-white',
            ],
            action: () => {
                props.comment.interactions.userReported
                    ? showWarningToast(`${capitalize(getContentName(props.comment.kind))} déjà signalé.`)
                    : emitter.emit('report', props.comment)
            },
        },
        {
            name: 'Lien',
            condition: () => true,
            icon: 'fas fa-link',
            class: 'hover:bg-blue-500 hover:text-white',
            action: () => {
                try {
                    navigator.clipboard.writeText(
                        getURL(urlJoin(router.currentRoute.value.path, `#comment-${props.comment.id}`)),
                    )
                    showInfoToast('Lien copié dans le presse-papier.')
                } catch (err) {
                    showErrorToast(
                        `[Erreur] Le lien de ${getContentDemonstrative(
                            props.comment.kind,
                        )} n'a pas pu être copié.`,
                    )
                }
            },
        },

        {
            name: 'Supprimer',
            condition: () => (userIsAuthor.value || userIsAdmin.value) && props.comment.isVisible,
            icon: 'fas fa-trash-alt',
            class: 'hover:bg-red-500 hover:text-white',
            action: () => {
                updateContent({ id: props.comment.id, content: { hidden: true } })
            },
        },
    ]

    const actionsShown = computed(() => actions.filter((action) => action.condition()))
    const hiddenActionsShown = computed(() => hiddenActions.filter((action) => action.condition()))

    const editorConfig = {
        charCount: 240,
        textClass: 'text-sm',
        editorClasses: ['text-sm'],
        editorButtons: [],
        placeholder: `${fullname(auth.user)} va commenter...`,
    }
</script>
