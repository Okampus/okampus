<template>
    <svg width="48mm" height="60mm" viewBox="0 0 48 60">
        <path
            d="M 5,0 C 2.3,0 0,2.4 0,5 V 55 C 0,57.6 2.3,60 5,60 H 43 c 2.68,0 5,-2.4 5,-5 V 10 L 38,0 Z"
            fill="#e5e7eb"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path d="M 48,10 38,0 38,10 Z" fill="#ccc" />
        <foreignObject x="0" y="45" width="48" height="15">
            <div
                v-if="fileType"
                class="flex h-full w-full items-center justify-center rounded-b text-[0.56rem] text-white"
                :class="fileType.color"
            >
                {{ fileType.typeName }}
            </div>
        </foreignObject>
    </svg>
</template>

<script setup>
    import { getType } from '@/shared/assets/file-types'

    import { computed } from 'vue'

    const props = defineProps({
        file: {
            type: Object,
            required: true,
        },
    })

    const fileType = computed(() => props.file.fileType ?? getType(props.file))
</script>
