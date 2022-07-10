<template>
    <div class="flex flex-col gap-4 justify-center items-center self-center m-10 w-full text-2xl text-0">
        <img class="w-48 h-48" :src="Rocket" />
        <div class="text-6xl font-semibold title-font">Ça arrive prochainement ! ✨</div>
        <div class="flex flex-col gap-1 items-center text-xl">
            Restez au courant des prochaines mises à jour et donnez votre avis sur le
            <a
                class="flex flex-nowrap gap-2 items-center link-blue break"
                href="https://discord.gg/bEwwT9SNQX"
                >Discord public d'Okampus
                <img :src="okampus" alt="OKAMPUS" class="w-10 h-10 rounded-lg border-2 border-black"
            /></a>
        </div>
    </div>
</template>

<script setup>
    import okampus from '@/assets/img/logos/okampus.png'
    import Rocket from '@/assets/img/3dicons/rocket.png'
</script>
