<template>
    <div class="card-2 flex flex-col gap-8">
        <div class="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-3">
            <div v-for="(doc, i) in documentList" :key="i" class="flex w-full flex-col gap-2">
                <div class="truncate text-lg">{{ doc.name }}</div>
                <FilePreview v-if="doc.file.length" class="" :file="doc.file[0].file" :can-delete="false" />
                <div v-else class="input flex grow items-center justify-center gap-2">
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
    await clubsStore.getClubFiles(props.club.id, 'document')

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
        () => props.club.id,
        async () => {
            await clubsStore.getClubFiles(props.club.id, 'document')
        },
    )
</script>
