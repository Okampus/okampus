<template>
    <div class="mt-4 px-6">
        <iframe
            v-if="club.presentationVideo"
            class="float-left inline aspect-[16/9] h-fit pr-6 pb-6"
            :class="club.longDescription ? 'md:w-[30rem] md-max:mb-4 md-max:w-full' : 'w-full'"
            :src="`https://www.youtube.com/embed/${embedLink}`"
            frameborder="0"
            allowfullscreen
        />
        <div v-if="club.longDescription">
            <div class="text-1 mb-4 text-xl font-semibold md-max:text-2xl">
                Qu'est-ce que {{ club.name }} ?
            </div>

            <div class="mb-4 flex flex-wrap gap-2">
                <div
                    v-for="label in club.labels.filter((label) => label.type === 'Descriptor')"
                    :key="label.id"
                    class="rounded-full bg-indigo-500 px-4 py-1 text-base text-white"
                >
                    {{ label.name }}
                </div>
            </div>
            <MdRenderer class="text-2 space-y-4 md-max:text-lg" :content="club.longDescription" />

            <div class="mt-4 flex flex-wrap gap-2">
                <div
                    v-for="label in club.labels.filter((label) => label.type === 'Meta')"
                    :key="label.id"
                    class="rounded-full border border-gray-500 bg-transparent px-3 py-1 text-base text-gray-600"
                >
                    {{ label.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import MdRenderer from '@/components/Input/Editor/MdRenderer.vue'
    import { computed } from 'vue'
    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const embedLink = computed(
        () =>
            props.club.presentationVideo?.match?.(
                /(?:youtu.*be.*)\/(?:watch\?v=|embed\/|v|shorts|)(.*?(?:(?=[&#?])|$))/,
            )?.[1],
    )
</script>
