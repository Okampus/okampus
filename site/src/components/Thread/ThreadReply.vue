<template>
    <ThreadCommentable :content="reply">
        <template #content>
            <!-- Violating props immutability? -->
            <TipTapEditableRender
                v-model:content="body"
                v-model:edit="reply.editing"
                @send="
                    threads.updateContent(reply.contentMasterId, { contentId: reply.contentId, body: $event })
                "
            />
        </template>

        <template #actions>
            <div class="flex items-center mt-2">
                <div
                    v-for="(action, i) in actionsShown"
                    :key="i"
                    class="group flex gap-1 items-center p-2 rounded-lg transition cursor-pointer text-5"
                    @click="action.action"
                >
                    <font-awesome-icon :icon="action.icon" :class="action.class" />
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
    import TipTapEditableRender from '@/components/TipTap/TipTapEditableRender.vue'

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
</script>
