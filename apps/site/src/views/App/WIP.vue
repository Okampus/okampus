<template>
    <div
        class="flex flex-col gap-4 justify-center items-center self-center p-10 pb-[14%] w-full h-full text-2xl text-0"
    >
        <img class="w-48 h-48" :src="Tools" />
        <div class="text-4xl font-semibold text-center xl:text-6xl title-font">
            Ça arrive prochainement ! ✨
        </div>
        <div class="flex-col gap-1 items-center text-lg text-center xl:text-xl flex-inline">
            Restez au courant des prochaines mises à jour et donnez votre avis sur le
            <a
                class="flex-nowrap gap-2 items-center flex-inline link-blue break"
                href="https://discord.gg/bEwwT9SNQX"
                >Discord public d'Okampus
                <img :src="okampus" alt="OKAMPUS" class="inline w-10 h-10 rounded-lg border-2 border-black"
            /></a>
        </div>
    </div>
</template>

<script setup>
    import okampus from '@/assets/img/logos/okampus.png'
    import Tools from '@/assets/img/3dicons/tools.png'
</script>
