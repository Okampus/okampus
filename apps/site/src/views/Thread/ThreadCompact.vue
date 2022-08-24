<template>
    <GraphQLQuery
        :query="getThreadById"
        :variables="variables"
        :update="
            (data) => {
                const thread = data?.threadById
                title = thread?.title
                return thread
            }
        "
        resource-type="thread"
        route-base="/forum/posts"
    >
        <template #default="{ data: thread }">
            <div class="centered-container padded text-0 flex flex-col">
                <div class="flex items-center gap-5">
                    <LabelTag
                        class="!py-2"
                        :icon="threadType(thread.type).icon"
                        :tag-color="threadType(thread.type).color"
                        :tag-name="threadType(thread.type)[locale]"
                    />
                    <EditableTextInput
                        v-if="userIsOp(thread) || userIsAdmin"
                        v-model:show-input="editingTitle"
                        v-model="title"
                        :min-char="10"
                        :max-char="128"
                        min-char-message="Le titre d'un post doit faire au minimum 10 caractères"
                        max-char-message="Le titre d'un post ne peut pas dépasser 128 caractères"
                        text-class="text-xl"
                        display-class="font-bold text-0"
                        placeholder="Titre"
                        @validate="updateTitleThread({ id: thread.id, thread: { title: $event } })"
                    />
                    <p v-else class="text-0 always-break-words text-xl font-bold">{{ thread.title }}</p>
                </div>
                <div class="flex">
                    <div class="w-full">
                        <div class="flex flex-col gap-3">
                            <ThreadCommentable :content="thread.post" :thread="thread" />
                            <template v-if="thread.post.children.length > 0">
                                <div class="my-3">
                                    <div class="mb-1 ml-2">
                                        {{
                                            `${thread.post.children.length} réponse${
                                                thread.post.children.length > 1 ? 's' : ''
                                            }`
                                        }}
                                    </div>
                                </div>
                                <ThreadCommentable
                                    v-for="reply in thread.post.children.filter(
                                        (child) => child.kind === REPLY,
                                    )"
                                    :key="reply.id"
                                    :content="reply"
                                    :thread="thread"
                                />
                            </template>
                            <ThreadNewReply :post="thread.post" />
                        </div>
                    </div>
                    <div class="text-1 sticky top-4 ml-4 hidden w-3/12 space-y-2 self-start lg:block">
                        <div
                            v-if="thread.tags?.length"
                            class="bg-card-within-1 flex flex-col gap-4 rounded-lg p-4"
                        >
                            <AppTitle icon="fas fa-tags" :title="`Tag${thread.tags?.length ? 's' : ''}`" />
                            <div class="flex flex-wrap">
                                <LabelTag
                                    v-for="tag in thread.tags"
                                    :key="tag"
                                    class="mr-1 mb-1"
                                    :tag-name="tag.name"
                                    :tag-color="tag.color"
                                />
                            </div>
                        </div>
                        <div class="bg-card-within-1 flex flex-col gap-4 rounded-lg p-4">
                            <AppTitle
                                icon="fas fa-list-check"
                                :title="`Assigné${thread.assignedUsers?.length ? 's' : ''}`"
                            />
                            <!-- TODO: Actions : Settings, Add -->
                            <div v-if="thread.assignedUsers?.length" class="flex flex-col">
                                <UserActivity v-for="(user, i) in thread.assignedUsers" :key="i" :user="user">
                                    <template #subtitle>
                                        {{ getRole(user)[locale] }}
                                    </template>
                                </UserActivity>
                            </div>
                            <div v-else class="italic">Personne n'est assigné</div>
                        </div>
                        <div class="bg-card-within-1 flex flex-col gap-4 rounded-lg p-4">
                            <AppTitle
                                icon="fas fa-user-group"
                                :title="`Participant${thread.participants?.length ? 's' : ''}`"
                            />
                            <div class="flex flex-col gap-4">
                                <!-- TODO: Improve with UserActivity, last activity on thread -->
                                <UserActivity v-for="(user, i) in thread.participants" :key="i" :user="user">
                                    <template #subtitle>
                                        {{ getRole(user)[locale] }}
                                    </template>
                                </UserActivity>
                            </div>
                        </div>
                        <!-- TODO: Actions : Settings, Add -->
                        <!-- <div class="card">
                            <div class="flex items-center mb-3 space-x-2 text-xl">
                                <div class="mr-4 font-bold text-md">Sujets semblables</div>
                                TODO: Actions : Suggest, next page
                            </div>
                            <SimilarThread
                                v-for="similarThread in post.similarThreads"
                                :key="similarThread"
                                :thread="similarThread"
                                class="mb-2"
                            />
                        </div> -->
                    </div>
                </div>
            </div>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import EditableTextInput from '@/components/Input/EditableTextInput.vue'
    import LabelTag from '@/components/UI/Label/LabelTag.vue'

    import ThreadCommentable from '@/components/Thread/ThreadCommentable.vue'
    import UserActivity from '@/components/App/General/UserActivity.vue'
    import ThreadNewReply from '@/components/Thread/ThreadNewReply.vue'

    import AppTitle from '@/components/App/AppTitle.vue'

    import { REPLY } from '@/shared/types/content-kinds.enum'

    import { computed, ref } from 'vue'
    import { useRoute } from 'vue-router'

    import { getThreadById } from '@/graphql/queries/threads/getThreadById'
    import { updateThread } from '@/graphql/queries/threads/updateThread'

    import { getRole } from '@/utils/users'
    import threadTypes from '@/shared/types/thread-types.enum'

    import { useI18n } from 'vue-i18n'

    import { useAuthStore } from '@/store/auth.store'
    import { useMutation } from '@vue/apollo-composable'
    import { showSuccessToast, showToastGraphQLError } from '@/utils/toast'

    const { locale } = useI18n({ useScope: 'global' })

    const { mutate: updateTitleThread, onDone, onError } = useMutation(updateThread)
    onDone(() => showSuccessToast('Titre modifié ✏️'))
    onError(showToastGraphQLError)

    const route = useRoute()
    const auth = useAuthStore()

    const variables = computed(() => ({
        id: parseInt(route.params.id),
    }))
    const editingTitle = ref(false)
    const title = ref('')

    const threadType = (typeKey) => threadTypes.find((type) => type.key === typeKey)

    const userIsOp = computed(() => (thread) => thread.post.author.id === auth.user?.id)
    const userIsAdmin = computed(() => auth.user?.roles?.includes('admin'))
</script>
