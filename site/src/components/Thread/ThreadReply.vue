<template>
    <ThreadCommentable :content="reply">
        <template #content>
            <MdEditableRender
                v-model:content="body"
                v-model:edit="editing"
                :uid="`reply-${reply.contentId}`"
                @send="
                    threads.updateContent(reply.contentMasterId, { contentId: reply.contentId, body: $event })
                "
            />
        </template>

        <template #actions>
            <div v-if="actionsShown.length" class="flex gap-4 items-center mt-5">
                <div
                    v-for="(action, i) in actionsShown"
                    :key="i"
                    class="group flex gap-1.5 items-center rounded-lg transition cursor-pointer text-5"
                    @click="action.action"
                >
                    <i :class="[action.icon, action.class]" />
                    <p class="text-sm" :class="action.class">
                        {{ action.name }}
                    </p>
                </div>
            </div>
        </template>
    </ThreadCommentable>
</template>

<script setup>
    import ThreadCommentable from '@/components/Thread/ThreadCommentable.vue'
    import MdEditableRender from '@/components/App/Editor/MdEditableRender.vue'

    import { edit, favorite, removeContent } from '@/shared/actions/thread.actions'
    import { useThreadsStore } from '@/store/threads.store'
    import { computed, ref } from 'vue'

    const props = defineProps({
        reply: {
            type: Object,
            required: true,
        },
    })

    const body = ref(props.reply.body)
    const actions = [favorite, edit, removeContent]
    const actionsShown = computed(() =>
        actions.map((action) => action(props.reply)).filter((action) => action.condition),
    )

    const threads = useThreadsStore()
    const editing = computed({
        get: () => props.reply.editing,
        set: (v) => threads.editingContent(props.reply.contentId, v),
    })
</script>
