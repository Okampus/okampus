<template>
    <div class="flex flex-col gap-5 p-4 rounded-xl shadow-xl text-2 bg-2">
        <div>
            <div class="mb-2 text-lg font-semibold">Catégorie de l'association</div>
            <router-link :to="`/clubs/${clubTypes[club.category].link}`">
                <LabelSimple class="bg-slate-600/40 hover:bg-slate-400/40">{{ club.category }}</LabelSimple>
            </router-link>
        </div>
        <div>
            <div class="mb-2 text-lg font-semibold">Description de l'association</div>
            <div class="text-2">{{ club.longDescription }}</div>
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
