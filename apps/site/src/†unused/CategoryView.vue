<template>
    <div>
        <!-- TODO: add filtering, tab, info panel -->
        <div class="flex">
            <h3 class="pl-10 mb-8 text-3xl font-bold text-0">Liste des catégories</h3>
            <div class="grow h-14 ..."></div>
            <button class="shrink-0 button-green" @click="addCategorie">
                <p><i class="fas fa-plus"></i> Nouvelle catégorie</p>
            </button>
        </div>
        <ListPage base-route="/test" :store-callback="categories.getCategories">
            <template #default="{ items }">
                <CategoryList :categories="items" />
            </template>
        </ListPage>
        <ModalPopup :show="showForm" @close="showForm = false">
            <Transition name="fade">
                <p></p>
            </Transition>
        </ModalPopup>
    </div>
</template>

<script setup>
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import ListPage from '@/views/App/ListPage.vue'
    import CategoryList from './Category/CategoryList.vue'

    import { useCategoriesStore } from '@/store/categories.store'
    import { ref } from 'vue'

    const categories = useCategoriesStore()
    const showForm = ref(false)

    const addCategorie = function () {
        showForm.value = true
    }
</script>
