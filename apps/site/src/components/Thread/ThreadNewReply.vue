<template>
    <div>
        <AlertInline
            v-if="post.children.length === 0"
            type="info"
            class="mt-2 rounded-b-none dark:!bg-blue-900"
        >
            <!-- TODO: bonus for a first answer -->
            <template #title> Sois le premier à répondre à ce post ! </template>
            <template #message>
                <div class="mb-2">
                    Personne n'a encore répondu à ce post : propose une première réponse 🌟
                </div>
            </template>
        </AlertInline>
        <AppTitle v-else icon="fa fa-chat" title="Répondre à ce post" />
        <div
            id="new-reply"
            class="bg-card-meta flex flex-row p-4 text-lg"
            :class="
                post.children.length === 0
                    ? 'border-2 border-blue-100 dark:border-blue-900 rounded-b-lg'
                    : 'shadow-md rounded-lg'
            "
        >
            <ProfileAvatar :avatar="auth.user?.avatar" :name="fullname(auth.user)" />
            <div class="arrow-left bg-1 mt-2 ml-3" />
            <div class="block w-[calc(100%-6rem)]">
                <MdEditor
                    ref="editor"
                    v-model="body"
                    uid="new-reply"
                    :sendable="true"
                    @send="addReply({ child: { parentId: post.id, contentKind: REPLY, body } })"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useMutation } from '@vue/apollo-composable'
    import AlertInline from '@/components/UI/Alert/AlertInline.vue'
    import AppTitle from '@/components/App/AppTitle.vue'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import MdEditor from '@/components/Input/Editor/MdEditor.vue'

    import { REPLY } from '@/shared/types/content-kinds.enum'

    import { useAuthStore } from '@/store/auth.store'
    import { fullname } from '@/utils/users'
    import { createContent } from '@/graphql/queries/threads/createContent'

    import { ref } from 'vue'

    defineProps({
        post: {
            type: Object,
            required: true,
        },
    })

    const body = ref('')
    const editor = ref(null)

    const { mutate: addReply } = useMutation(createContent)

    const auth = useAuthStore()
</script>

<style lang="scss">
    @import '@/assets/scss/colors';

    .arrow-left {
        @apply w-0 h-0 border-t-[1rem] border-b-[1rem] border-r-[1rem] border-t-transparent border-b-transparent bg-card-meta dark:border-r-black border-r-white;
    }
</style>
