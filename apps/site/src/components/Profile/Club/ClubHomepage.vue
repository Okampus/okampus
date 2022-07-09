<template>
    <div class="flex flex-col items-center md:flex-row md:items-start">
        <iframe
            class="aspect-[16/9] w-2/5 h-fit"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="RickRoll"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        ></iframe>
        <div class="flex flex-col gap-5 self-stretch p-4 md:w-3/5 text-2">
            <div>
                <div class="mb-2 text-lg font-semibold">Catégorie de l'association</div>
                <router-link :to="`/clubs/${clubTypes[club.category].link}`">
                    <LabelSimple class="bg-slate-600/40 hover:bg-slate-400/40">{{
                        club.category
                    }}</LabelSimple>
                </router-link>
            </div>
            <div class="flex-[2]">
                <div class="mb-2 text-lg font-semibold">Description de l'association</div>
                <div class="text-2">{{ club.longDescription }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import LabelSimple from '../../UI/Label/LabelSimple.vue'
    import { clubTypes } from '@/shared/types/club-types.enum'

    defineProps({
        club: {
            type: Object,
            required: true,
        },
    })
</script>
