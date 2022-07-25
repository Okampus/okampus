<template>
    <div>
        <!-- TODO: add filtering, tab, info panel -->
        <div class="flex">
            <h3 class="text-0 mb-8 pl-10 text-3xl font-bold">Liste des catégories</h3>
            <div class="... h-14 grow"></div>
            <button class="button-green shrink-0" @click="addCategorie">
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
