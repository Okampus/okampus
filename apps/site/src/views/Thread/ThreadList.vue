<template>
    <!-- TODO: add filtering, tab, info panel -->
    <div class="flex flex-col gap-4 my-2 mx-4 text-0">
        <template v-if="threads.length">
            <ThreadCard v-for="(thread, i) in threads" :key="i" :thread="thread" />
        </template>
        <template v-else>
            <div class="text-2xl font-bold text-center">Aucun post ne correspond à ces critères.</div>
            <div class="text-lg text-center">
                Regardez la
                <router-link to="threads" class="link-blue">liste de tous les posts</router-link> ou
                <div class="link-blue">faites une recherche avancée.</div>
            </div>
        </template>
    </div>
</template>

<script setup>
    import ThreadCard from '@/components/App/ListCard/ThreadCard.vue'
    defineProps({
        threads: {
            type: Array,
            required: true,
        },
    })
</script>
