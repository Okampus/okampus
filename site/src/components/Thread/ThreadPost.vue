<template>
    <ThreadCommentable :content="post">
        <template #content>
            <!-- Violating props immutability? -->
            <TipTapEditableRender
                v-model:edit="editing"
                :content="body"
                @send="
                    threads.updateContent(post.contentMasterId, { contentId: post.contentId, body: $event })
                "
            />
        </template>

        <template #actions>
            <div
                v-for="(action, i) in actions"
                :key="i"
                class="group flex gap-1 items-center p-2 rounded-lg transition cursor-pointer text-5"
                @click="action.action"
            >
                <font-awesome-icon :icon="action.icon" :class="action.class" />
                <p :class="action.class" class="text-sm">
                    {{ action.name }}
                </p>
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
        post: {
            type: Object,
            required: true,
        },
    })

    const body = ref(props.post.body)

    const threads = useThreadsStore()

    const actions = computed(() =>
        [favorite, edit, removeContent]
            .map((action) => action(props.post))
            .filter((action) => action.condition),
    )
    const editing = computed({
        get: () => props.post.editing,
        set: (v) => threads.editingContent(props.post.contentId, v),
    })
</script>
