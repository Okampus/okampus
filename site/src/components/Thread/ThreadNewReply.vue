<template>
    <div>
        <p class="mt-2 ml-6 label-title">Répondre à ce post</p>
        <div
            id="new-reply"
            class="flex shrink-0 gap-2 p-4 w-full text-lg rounded-none shadow-md md:rounded-lg bg-card-meta"
        >
            <UserAvatar :img-src="auth?.user?.avatar" :username="auth?.user?.fullname" />
            <div class="flex w-full triangle-before">
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
    .triangle-before::before {
        width: 0;
        height: 0;
        margin-top: 0.6rem;
        vertical-align: middle;
        content: '';
        border-color: transparent #ddd transparent transparent;
        border-style: solid;
        border-width: 0.6rem 0.9rem 0.6rem 0;

        .dark & {
            border-color: transparent #000 transparent transparent;
        }
    }
</style>
