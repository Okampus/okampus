<template>
    <div
        class="text-0 flex h-full w-full flex-col items-center justify-center gap-4 self-center p-10 pb-[14%] text-2xl"
    >
        <img class="h-48 w-48" :src="Tools" />
        <div class="title-font text-center text-4xl font-semibold xl:text-6xl">
            Ça arrive prochainement ! ✨
        </div>
        <div class="flex-inline flex-col items-center gap-1 text-center text-lg xl:text-xl">
            Restez au courant des prochaines mises à jour et donnez votre avis sur le
            <a
                class="flex-inline link-blue break flex-nowrap items-center gap-2"
                href="https://discord.gg/bEwwT9SNQX"
                >Discord public d'Okampus
                <img :src="okampus" alt="OKAMPUS" class="inline h-10 w-10 rounded-lg border-2 border-black"
            /></a>
        </div>
    </div>
</template>

<script setup>
    import okampus from '@/assets/img/logos/okampus.png'
    import Tools from '@/assets/img/3dicons/tools.png'
</script>
