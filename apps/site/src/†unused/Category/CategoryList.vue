<template>
    <!-- TODO: add filtering, tab, info panel -->
    <div class="text-0 my-2 mx-4 flex flex-col gap-4">
        <template v-if="categories.length">
            <CategoryCard
                v-for="(categorie, i) in categories"
                :key="i"
                :categorie="categorie"
                :categorie-name="data[i]"
            />
        </template>
    </div>
</template>

<script setup>
    import CategoryCard from '@/components/App/Card/CategoryCard.vue'

    defineProps({
        categories: {
            type: Array,
            required: true,
        },
    })

    const data = ['Categorie 1', 'Categorie 2', 'Categorie 3', 'Categorie 4', 'Categorie 5']
</script>
