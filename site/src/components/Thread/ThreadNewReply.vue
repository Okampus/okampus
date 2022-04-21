<template>
    <div>
        <p class="mt-2 ml-6 label-title">Répondre à ce post</p>
        <div
            id="new-reply"
            class="flex flex-row p-4 text-lg rounded-none shadow-md md:rounded-lg bg-card-meta"
        >
            <UserAvatar :img-src="auth?.user?.avatar" :username="auth?.user?.fullname" />
            <div class="mt-2 ml-3 arrow-left bg-1" />
            <div class="block w-[calc(100%-6rem)]">
                <MdEditor v-model="body" uid="new-reply" :sendable="true" @send="sendReply" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { REPLY } from '@/shared/types/content-kinds.enum'

    import UserAvatar from '@/components/User/UserAvatar.vue'
    import MdEditor from '@/components/App/Editor/MdEditor.vue'

    import { useAuthStore } from '@/store/auth.store'
    import { useThreadsStore } from '@/store/threads.store'

    import { emitter } from '@/shared/modules/emitter'

    import { ref } from 'vue'

    const props = defineProps({
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
        body.value = ''
    }

    const auth = useAuthStore()
    const threads = useThreadsStore()
</script>

<style lang="scss">
    @import '@/assets/scss/colors';

    .arrow-left {
        @apply w-0 h-0 border-t-[1rem] border-b-[1rem] border-r-[1rem] border-t-transparent border-b-transparent border-r-0-light dark:border-r-0-dark bg-card-meta;
    }
</style>
