<template>
    <div>
        <AlertInline v-if="first" type="info" class="mt-2 dark:!bg-blue-900 rounded-b-none">
            <!-- TODO: bonus for a first answer -->
            <template #title> Sois le premier à répondre à ce post ! </template>
            <template #message>
                <div class="mb-2">
                    Personne n'a encore répondu à ce post : propose une première réponse 🌟
                </div>
            </template>
        </AlertInline>
        <p v-else class="mt-2 ml-6 label-title">Répondre à ce post</p>
        <div
            id="new-reply"
            class="flex flex-row p-4 text-lg bg-card-meta"
            :class="
                first ? 'border-2 border-blue-100 dark:border-blue-900 rounded-b-lg' : 'shadow-md rounded-lg'
            "
        >
            <ProfileAvatar :avatar="auth.user?.avatar" :name="fullname(auth.user)" />
            <div class="mt-2 ml-3 arrow-left bg-1" />
            <div class="block w-[calc(100%-6rem)]">
                <MdEditor ref="editor" v-model="body" uid="new-reply" :sendable="true" @send="sendReply" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import AlertInline from '@/components/UI/Alert/AlertInline.vue'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import MdEditor from '@/components/Input/Editor/MdEditor.vue'

    import { emitter } from '@/shared/modules/emitter'

    import { useAuthStore } from '@/store/auth.store'
    import { useThreadsStore } from '@/store/threads.store'

    import { REPLY } from '@/shared/types/content-kinds.enum'
    import { fullname } from '@/utils/users'

    import { ref } from 'vue'

    const props = defineProps({
        first: {
            type: Boolean,
            default: false,
        },
        threadId: {
            type: Number,
            required: true,
        },
        parentId: {
            type: Number,
            required: true,
        },
    })

    const body = ref('')
    const editor = ref(null)

    const sendReply = () => {
        threads
            .addContent(props.threadId, { parentId: props.parentId, body: body.value }, REPLY)
            .then((content) => {
                emitter.emit('show-toast', {
                    message: 'Réponse envoyée avec succès !',
                    type: 'success',
                })
                emitter.emit('scroll-to-anchor', `content-${content.contentId}`)
            })

        editor.value.setMde('')
    }

    const auth = useAuthStore()
    const threads = useThreadsStore()
</script>

<style lang="scss">
    @import '@/assets/scss/colors';

    .arrow-left {
        @apply w-0 h-0 border-t-[1rem] border-b-[1rem] border-r-[1rem] border-t-transparent border-b-transparent bg-card-meta dark:border-r-black border-r-white;
    }
</style>
