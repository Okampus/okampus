<template>
    <div>
        <!-- TODO: add filtering, tab, info panel -->
        <div class="flex">
            <h3 class="text-0 mb-8 pl-10 text-3xl font-bold">Trésorerie</h3>
            <div class="... h-14 grow"></div>
            <button class="button-green shrink-0" @click="handleModal">
                <p><i class="fas fa-plus"></i> Ajouter</p>
            </button>
        </div>
        <!-- <ModalPopup :show="showModal" @close="handleModal = false">
                <Transition name="fade">
                    <p>zj</p>
                </Transition>
            </ModalPopup> -->
        <div class="my-2 grid grid-cols-3 gap-4">
            <AccountingCard
                v-for="el in data"
                :key="el"
                class="p-5"
                :categorie-name="el.name"
                :icon="el.icon"
                :montant="el.price"
                :color="el.color"
            />
        </div>
        <HorizontalTabs v-model:tab="currentTab" :tabs="tabs" route-base="/test">
            <DashboardCore :columns="tabs" />
        </HorizontalTabs>
        <!--
                Creer un tableau pour le tbody ...
                Il sera passer en props par :items
                <button class="absolute inset-y-0 right-0 mr-8 w-16">
                    <i class="mx-3 fas fa-pencil" @click="handleCategorie" />
                    <i class="mx-3 fas fa-trash" @click="deleteCategorie" />
                </button>
            -->
    </div>
</template>

<script setup>
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'

    import DashboardCore from '@/components/Dashboard/DashboardCore.vue'
    // import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import { ref, computed } from 'vue'
    import AccountingCard from '@/components/App/Card/AccountingCard.vue'

    const data = [
        {
            name: 'Recettes',
            price: 1420,
            icon: 'coins',
            color: 'green',
        },
        {
            name: 'Dépenses',
            price: 2300,
            icon: 'arrow-down',
            color: 'red',
        },
        {
            name: 'Solde',
            price: computed(() => data[0].price - data[1].price),
            icon: 'pie-chart',
            color: 'gray',
        },
    ]

    const tabs = [
        {
            id: 'date',
            name: "Date d'opération",
            icon: 'flag',
        },
        {
            id: 'price',
            name: 'Montant',
            icon: 'newspaper',
        },
        {
            id: 'threads',
            name: 'Type de paiement',
            icon: 'newspaper',
        },
        {
            id: 'threads',
            name: 'Catégories',
            icon: 'newspaper',
        },
        {
            id: 'threads',
            name: 'Description',
            icon: 'newspaper',
        },
    ]

    let showModal = ref(false)
    const handleModal = function () {
        showModal.value = !showModal.value
    }
</script>
