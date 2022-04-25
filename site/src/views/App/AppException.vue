<template>
    <div class="flex flex-col items-center m-20 text-0">
        <router-link to="/" class="mb-10 w-fit">
            <div class="w-[5.5rem] h-[5.5rem] logo" allow-dark="" />
        </router-link>
        <div class="text-2xl text-blue-700 uppercase">{{ props.code }}</div>

        <div class="text-5xl text-center">
            <template v-if="props.code == '404'">Cette ressource n'existe pas.</template>
            <template v-else-if="props.code == '403'"
                >Seuls les utilisateurs autorisés peuvent accéder à cette page.</template
            >
            <template v-else-if="props.code == '401'"
                >Seuls les utilisateurs connectés peuvent accéder à cette page.</template
            >
            <!-- TODO: check API health -->
            <template v-else-if="props.code == 'Erreur Réseau' && online"
                >L'API <a class="link-blue" href="api.horizon-efrei.fr">api.horizon-efrei.fr</a> n'est pas
                accessible depuis ce réseau.</template
            >
            <template v-else-if="props.code == 'Erreur Réseau' && !online"
                >Ce navigateur n'est pas connecté à Internet.</template
            >
            <template v-else>Une erreur inattendue est survenue.</template>
        </div>

        <router-link to="/" class="flex gap-4 items-center mt-20 text-3xl text-blue-600 link-blue">
            <span>Revenir à l'accueil</span> <i class="text-lg fas fa-arrow-right" />
        </router-link>
    </div>
</template>

<script setup>
    import { onMounted, onUnmounted, ref } from 'vue'

    const online = ref(navigator.onLine)
    onMounted(() => {
        window.addEventListener('offline', () => (online.value = false))
        window.addEventListener('online', () => (online.value = true))
    })

    onUnmounted(() => {
        window.removeEventListener('offline', () => (online.value = false))
        window.removeEventListener('online', () => (online.value = true))
    })

    const props = defineProps({
        code: {
            type: String,
            required: true,
        },
    })
</script>
