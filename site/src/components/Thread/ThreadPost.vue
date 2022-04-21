<template>
    <ThreadCommentable :content="post">
        <template #content>
            <MdEditableRender
                v-model:edit="editing"
                v-model:content="body"
                :uid="`post-${post.contentId}`"
                @send="
                    threads.updateContent(post.contentMasterId, { contentId: post.contentId, body: $event })
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
                    <p :class="action.class" class="text-sm">
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
        post: {
            type: Object,
            required: true,
        },
    })

    const body = ref(props.post.body)

    const threads = useThreadsStore()
    const actions = [favorite, edit, removeContent]
    const actionsShown = computed(() =>
        actions.map((action) => action(props.post)).filter((action) => action.condition),
    )
    const editing = computed({
        get: () => props.post.editing,
        set: (v) => threads.editingContent(props.post.contentId, v),
    })
</script>
