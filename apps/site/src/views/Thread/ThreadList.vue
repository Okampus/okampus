<template>
    <!-- TODO: add filtering, tab, info panel -->
    <div class="flex flex-col gap-4 my-2 mx-4 text-0">
        <template v-if="threads.length">
            <ThreadCard v-for="(thread, i) in threads" :key="i" :thread="thread" />
        </template>
        <div v-else class="text-center">
            <EmojiSad class="mb-3 text-3xl" />
            <div class="text-2xl font-bold">Aucun thread ne correspond à ces critères.</div>
            <div class="text-lg">
                Regardez la
                <router-link to="threads" class="link-blue">liste de tous les threads</router-link> ou
                <div class="link-blue">faites une recherche avancée.</div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ThreadCard from '@/components/App/ListCard/ThreadCard.vue'
    import EmojiSad from '@/icons/Emoji/EmojiSad.vue'

    defineProps({
        threads: {
            type: Array,
            required: true,
        },
    })
</script>
