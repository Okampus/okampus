<template>
    <div
        :id="`content-${props.content.id}`"
        class="bg-card-within-1 content-parent flex items-stretch gap-6 rounded-none p-4 shadow-md md:rounded-lg"
        :class="
            adminValidated ? 'border-2 border-orange-600' : opValidated ? 'border-2 border-green-600' : ''
        "
    >
        <div class="flex flex-col gap-4">
            <VoteInputContent :content="content" />
            <FavoriteInput :content="content" />
        </div>

        <div class="flex w-full flex-col gap-4">
            <div v-if="!content.isVisible" class="ml-4 flex items-center gap-1 text-yellow-500">
                <i class="fas fa-eye-slash" />
                <div>
                    {{ capitalize(getContentDemonstrative(content.kind)) }}
                    est masqué{{ isContentFeminine(content.kind) ? 'e' : '' }}
                </div>
            </div>

            <div class="flex flex-row items-center justify-between">
                <div class="flex items-center gap-3">
                    <UserActivity
                        :label-name="authorIsOp"
                        :user="content.author"
                        :action-at="content.createdAt"
                        :action-at-modified="content.updatedAt"
                        action-text="Publié"
                    />

                    <!-- TODO: Add validations -->
                    <template v-if="content.kind !== POST">
                        <i v-if="opValidated" class="fa fa-check text-base text-green-600" />
                        <LabelTag v-if="adminValidated" tag-name="Officiel" tag-color="orange" />

                        <i
                            v-else-if="auth.user.roles.includes('admin') || userIsOp"
                            class="fa text-5 cursor-pointer text-sm"
                            :class="auth.user.roles.includes('admin') ? 'fa-check-double' : 'fa-check'"
                            @click="
                                validateContent({
                                    id: thread.id,
                                    thread: { validatedWithContent: content.id },
                                })
                            "
                        />
                    </template>
                </div>

                <div class="text-3 content-show-focused flex items-center gap-2 opacity-50">
                    <div
                        v-for="(action, i) in topActionsShown"
                        :key="i"
                        class="group text-4 flex cursor-pointer items-center gap-1 rounded-lg px-1 transition"
                        @click="action.action"
                    >
                        <i
                            class="fas"
                            :class="[
                                `fa-${action.icon.value ?? action.icon}`,
                                action.class.value ?? action.class,
                            ]"
                        />
                        <p :class="action.class.value ?? action.class" class="text-sm">
                            {{ action.name.value ?? action.name }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="text-0 rounded-lg">
                <MdEditableRender
                    v-model:edit="editing"
                    v-model:content="body"
                    :uid="`content-${content.id}`"
                    @send="updateContent({ id: content.id, content: { body } })"
                />
            </div>

            <div class="content-show-focused flex gap-2 opacity-70">
                <div
                    v-for="(action, i) in bottomActionsShown"
                    :key="i"
                    class="group text-3 flex cursor-pointer items-center gap-1.5 rounded-lg px-1 transition"
                    @click="action.action"
                >
                    <i :class="[action.icon, action.class]" />
                    <p class="text-sm" :class="action.class">
                        {{ action.name }}
                    </p>
                </div>
            </div>

            <ThreadCommentList
                :thread="thread"
                :parent="content"
                :comments="contentComments"
                action-class="opacity-70 content-show-focused"
            />
        </div>
    </div>
</template>

<script setup>
    import ThreadCommentList from '@/components/Thread/ThreadCommentList.vue'
    import MdEditableRender from '@/components/Input/Editor/MdEditableRender.vue'
    import LabelTag from '@/components/UI/Label/LabelTag.vue'
    import VoteInputContent from '@/components/Input/VoteInputContent.vue'
    import UserActivity from '@/components/App/General/UserActivity.vue'
    import FavoriteInput from '@/components/Input/FavoriteInput.vue'

    import { computed, nextTick, ref } from 'vue'

    import { useAuthStore } from '@/store/auth.store'
    import { useRoute } from 'vue-router'

    import { COMMENT, POST } from '@/shared/types/content-kinds.enum'

    import { useMutation } from '@vue/apollo-composable'
    import { editContent } from '@/graphql/queries/editContent'

    import {
        getContentDemonstrative,
        getContentName,
        isContentFeminine,
    } from '@/shared/types/content-kinds.enum'

    import { capitalize } from 'lodash'
    import { emitter } from '@/shared/modules/emitter'
    import { getURL } from '@/utils/routeUtils'
    import urlJoin from 'url-join'
    import router from '@/router'
    import { editThread } from '@/graphql/queries/editThread'

    const auth = useAuthStore()
    const route = useRoute()

    const props = defineProps({
        content: {
            type: Object,
            required: true,
        },
        thread: {
            type: Object,
            required: true,
        },
    })

    nextTick(() => {
        if (route.hash === `#content-${props.content.id}`)
            emitter.emit('scroll-to-anchor', `#content-${props.content.id}`)
    })

    const editing = ref(false)
    const body = ref(props.content.body)

    const { mutate: updateContent, onError } = useMutation(editContent)
    onError(() => (body.value = props.content.body))

    const { mutate: validateContent } = useMutation(editThread)

    const contentComments = computed(() =>
        props.content.children.filter((childContent) => childContent.kind === COMMENT),
    )

    const authorIsOp = computed(() => props.thread.post.author.id === props.content.author.id)
    const userIsOp = computed(() => props.thread.post.author.id === auth.user.id)
    const userIsAuthor = computed(() => props.content.author.id === auth.user.id)
    const userIsAdmin = computed(() => auth.user?.roles?.includes('admin'))

    const bottomActions = [
        {
            name: 'Éditer',
            condition: () => (userIsAuthor.value && props.content.isVisible) || userIsAdmin.value,
            icon: 'fas fa-pen',
            class: 'group-hover:text-green-600',
            action: () => (editing.value = true),
        },
        {
            name: 'Supprimer',
            condition: () => (userIsAuthor.value || userIsAdmin.value) && props.content.isVisible,
            icon: 'fas fa-trash-alt',
            class: 'group-hover:text-red-600',
            action: () => {
                updateContent({ id: props.content.id, content: { hidden: true } })
            },
        },
    ]
    const bottomActionsShown = computed(() => bottomActions.filter((action) => action.condition()))

    const topActions = [
        {
            name: computed(() => (props.content.interactions.userReported ? 'Signalé' : 'Signaler')),
            condition: () => props.content.isVisible,
            icon: computed(() => (props.content.interactions.userReported ? 'fas fa-flag' : 'far fa-flag')),
            class: computed(() =>
                props.content.interactions.userReported
                    ? 'text-red-500 group-hover:text-red-600'
                    : 'group-hover:text-red-600',
            ),
            action: () => {
                props.content.interactions.userReported
                    ? emitter.emit('show-toast', {
                          message: `${capitalize(getContentName(props.content.kind))} déjà signalé.`,
                          type: 'warning',
                      })
                    : emitter.emit('report', props.content)
            },
        },
        {
            name: 'Lien',
            condition: () => true,
            icon: 'fas fa-link',
            class: 'group-hover:text-blue-600',
            action: () => {
                try {
                    navigator.clipboard.writeText(
                        getURL(urlJoin(router.currentRoute.value.path, `#content-${props.content.id}`)),
                    )
                    emitter.emit('show-toast', {
                        message: `Lien de ${getContentDemonstrative(props.content.kind)} copié.`,
                        type: 'info',
                    })
                } catch (err) {
                    emitter.emit('show-toast', {
                        message: `Une erreur est survenue lors de la copie du lien de ${getContentDemonstrative(
                            props.content.kind,
                        )}.`,
                        type: 'error',
                    })
                }
            },
        },
    ]
    const topActionsShown = computed(() => topActions.filter((action) => action.condition()))

    const opValidated = computed(() => props.thread.opValidation?.content?.id === props.content.id)
    const adminValidated = computed(
        () =>
            props.thread.adminValidations?.some((validation) => validation.content.id === props.content.id) ??
            false,
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
