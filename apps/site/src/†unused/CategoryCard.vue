<template>
    <div>
        <ModalPopup @close="handle = null">
            <div class="card gap-2">
                <div class="text-center text-2xl font-bold">Nom actuel</div>
                <div class="flex items-center justify-center">{{ handleCategorie }}</div>
                <br />
                <hr />
                <br />
                <form action="" method="post" novalidate>
                    <input
                        type="text"
                        class="input mt-1 h-10 w-full lg:m-0"
                        value=""
                        placeholder="Nouvelle catégorie"
                        required
                    />
                    <button class="button-green my-5 w-full shrink-0" @click="handleSelected">
                        <i class="fas fa-pen" />
                        Modifier le nom
                    </button>
                </form>
            </div>
        </ModalPopup>
        <div v-if="categorie" class="bg-content flex w-full flex-row xs:rounded-xl">
            <div class="relative w-full py-2 px-4 md:py-3 md:px-5">
                <span
                    class="text-3 flex h-8 flex-wrap items-center gap-5 overflow-hidden whitespace-nowrap font-light"
                >
                    {{ categorieName }}
                    <button class="absolute inset-y-0 right-0 mr-8 w-16">
                        <i class="fas fa-pencil mx-3" @click="handleCategorie(categorieName)" />
                        <i class="fas fa-trash mx-3" @click="deleteCategorie" />
                    </button>
                </span>
            </div>
        </div>
        <div v-else class="flex space-x-2 rounded-lg py-3 px-5 font-semibold">
            <p class="text-0 text-lg">Erreur: Ce post est vide.</p>
        </div>
    </div>
</template>

<script setup>
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'

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
