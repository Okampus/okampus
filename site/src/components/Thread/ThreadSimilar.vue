<template>
    <div class="flex flex-col pb-1 pl-1 w-auto p-1/2">
        <hr class="mb-2" />
        <div class="w-5/6">
            <div class="text-base font-bold">
                {{ thread.title }}
            </div>
            <div class="flex flex-wrap">
                <AppTag v-for="tag in thread.tags" :key="tag" :name="tag.title" :tag-color="tag.color" />
            </div>
        </div>
    </div>
</template>

<script lang="js">
import AppTag from '@/components/App/AppTag.vue'

export default {
    components: { AppTag },
    props: {
        thread: {
            type: Object,
            default: () => {},
        },
    },
}
</script>

<style scoped></style>
