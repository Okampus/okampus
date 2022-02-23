<template>
    <div>
        <p class="mt-2 ml-6 label-title">Répondre à ce post</p>
        <div
            id="new-reply"
            class="flex shrink-0 gap-2 p-4 w-full text-lg rounded-none shadow-md md:rounded-lg bg-card-meta"
        >
            <UserAvatar :img-src="auth?.user?.avatar" :username="auth?.user?.fullname" />
            {{}}
            <div class="flex w-full triangle-before">
                <TipTapEditableRender
                    v-model:content="body"
                    :edit="true"
                    class="w-full"
                    :cancellable="false"
                    :emit-content="true"
                    @send="
                        threads.addContent(threadId, { parentId, body }, REPLY).then((content) => {
                            emitter.emit('show-toast', {
                                message: 'Réponse envoyée avec succès !',
                                type: 'success',
                            })
                            emitter.emit('scroll-to-anchor', `content-${content.contentId}`)
                            body = defaultTipTapText
                        })
                    "
                />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { REPLY } from '@/shared/types/content-kinds.enum'

    import TipTapEditableRender from '@/components/TipTap/TipTapEditableRender.vue'
    import UserAvatar from '../User/UserAvatar.vue'

    import { useAuthStore } from '@/store/auth.store'
    import { useThreadsStore } from '@/store/threads.store'

    import { emitter } from '@/shared/modules/emitter'

    import { defaultTipTapText } from '@/utils/tiptap'
    import { ref } from 'vue'

    defineProps({
        threadId: {
            type: Number,
            required: true,
        },
        parentId: {
            type: Number,
            required: true,
        },
    })

    const auth = useAuthStore()
    const threads = useThreadsStore()

    const body = ref(defaultTipTapText)
</script>

<style lang="scss">
    .triangle-before::before {
        width: 0;
        height: 0;
        margin-top: 0.6rem;
        vertical-align: middle;
        content: '';
        border-color: transparent #fff transparent transparent;
        border-style: solid;
        border-width: 0.6rem 0.9rem 0.6rem 0;

        .dark & {
            border-color: transparent #000 transparent transparent;
        }
    }
</style>
