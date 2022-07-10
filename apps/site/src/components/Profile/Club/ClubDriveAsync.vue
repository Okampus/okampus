<template>
    <div class="flex flex-col gap-8 card-2">
        <div class="grid grid-cols-1 auto-rows-fr gap-4 sm:grid-cols-3">
            <div v-for="(doc, i) in documentList" :key="i" class="flex flex-col gap-2 w-full">
                <div class="text-lg truncate">{{ doc.name }}</div>
                <FilePreview v-if="doc.file.length" class="" :file="doc.file[0].file" :can-delete="false" />
                <div v-else class="flex grow gap-2 justify-center items-center input">
                    <EmojiSad class="text-xl"></EmojiSad>
                    <div>Pas de document</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import FilePreview from '@/components/Document/FilePreview.vue'
    import { ref, watch } from 'vue'
    import { useClubsStore } from '@/store/clubs.store'
    import EmojiSad from '@/icons/Emoji/EmojiSad.vue'

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const clubsStore = useClubsStore()
    await clubsStore.getClubFiles(props.club.teamId, 'document')

    const documentList = ref([
        {
            name: 'Passation',
            file: clubsStore.club.files.filter((doc) => doc.description === 'handover'),
        },
        {
            name: 'Status',
            file: clubsStore.club.files.filter((doc) => doc.description === 'statute'),
        },
        {
            name: 'Réglement intérieur',
            file: clubsStore.club.files.filter((doc) => doc.description === 'internal'),
        },
    ])

    watch(
        () => props.club.teamId,
        async () => {
            await clubsStore.getClubFiles(props.club.teamId, 'document')
        },
    )
</script>
