<template>
    <!-- TODO: add filtering, tab, info panel -->
    <div class="flex">
        <h3 class="pl-10 mb-8 text-3xl font-bold text-0">Trésorerie</h3>
        <div class="grow h-14 ..."></div>
        <button class="shrink-0 button-green" @click="handleModal">
            <p><i class="fas fa-plus"></i> Ajouter</p>
        </button>
    </div>
    <!-- <AppModal :show="showModal" @close="handleModal = false">
            <Transition name="fade">
                <p>zj</p>
            </Transition>
        </AppModal> -->
    <div class="grid grid-cols-3 gap-4 my-2">
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

    <AppTabs v-model:tab="currentTab" :tabs="tabs" route-base="/test">
        <DashboardCore :columns="tabs" />
    </AppTabs>

    <!--
            Creer un tableau pour le tbody ...
            Il sera passer en props par :items

            <button class="absolute inset-y-0 right-0 mr-8 w-16">
                <i class="mx-3 fas fa-pencil" @click="handleCategorie" />
                <i class="mx-3 fas fa-trash" @click="deleteCategorie" />
            </button>
        -->
</template>

<script setup>
    import DashboardCore from '@/components/Dashboard/DashboardCore.vue'
    /* import AppModal from '@/components/App/AppModal.vue' */
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
