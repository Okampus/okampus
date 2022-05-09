<template>
    <AppModal @close="handle = null">
        <div class="gap-2 card">
            <div class="text-2xl font-bold text-center">Nom actuel</div>
            <div class="flex justify-center items-center">{{ handleCategorie }}</div>
            <br />
            <hr />
            <br />
            <form action="" method="post" novalidate>
                <input
                    type="text"
                    class="mt-1 w-full h-10 lg:m-0 input"
                    value=""
                    placeholder="Nouvelle catégorie"
                    required
                />
                <button class="shrink-0 my-5 w-full button-green" @click="handleSelected">
                    <p><i class="fas fa-pen"></i> Modifier le nom</p>
                </button>
            </form>
        </div>
    </AppModal>
    <div v-if="categorie" class="flex flex-row w-full xs:rounded-xl bg-content">
        <div class="relative py-2 px-4 w-full md:py-3 md:px-5">
            <span
                class="flex overflow-hidden flex-wrap gap-5 items-center h-8 font-light whitespace-nowrap text-3"
            >
                {{ categorieName }}
                <button class="absolute inset-y-0 right-0 mr-8 w-16">
                    <i class="mx-3 fas fa-pencil" @click="handleCategorie(categorieName)" />
                    <i class="mx-3 fas fa-trash" @click="deleteCategorie" />
                </button>
            </span>
        </div>
    </div>
    <div v-else class="flex py-3 px-5 space-x-2 font-semibold rounded-lg">
        <p class="text-lg text-0">Erreur: Ce post est vide.</p>
    </div>
</template>

<script setup>
    import AppModal from '../AppModal.vue'
    defineProps({
        categorie: {
            type: Object,
            required: true,
        },
        categorieName: {
            type: String,
            required: true,
        },
    })

    const handleCategorie = function (name) {
        return name
    }

    /* Handle it in the database ...  */
    /* async handleSelected(query){
        return axios ...
    } */
</script>
