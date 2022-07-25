<template>
    <svg
        width="47.202mm"
        height="60.991mm"
        version="1.1"
        viewBox="0 0 47.202 60.991"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g transform="translate(-125.28 -45.257)">
            <path
                d="m130.03 45.257c-2.6342 0-4.7548 2.1205-4.7548 4.7548v51.481c0 2.6342 2.1205 4.7553 4.7548 4.7553h37.692c2.6342 0 4.7547-2.1211 4.7547-4.7553v-45.696l-10.022-10.54z"
                fill="#e5e7eb"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path d="m172.48 55.797-10.022-10.54 0.0804 10.439z" fill="#ccc" />
        </g>
        <foreignObject x="0" y="45" width="47.5" height="15.991">
            <div
                class="flex h-full w-full items-center justify-center rounded-b uppercase text-white"
                :class="color"
            >
                {{ fileName.split('.').pop() }}
            </div>
        </foreignObject>
    </svg>
</template>

<script setup>
    import docTypes, { DEFAULT_TYPE } from '@/shared/types/doc-types.enum'
    import { computed } from 'vue'

    const props = defineProps({
        mime: {
            type: String,
            default: '',
        },
        fileName: {
            type: String,
            default: '',
        },
    })

    const color = computed(() => {
        for (const type of docTypes) {
            if (type.condition.test(props.mime)) {
                return type.color
            }
        }
        return DEFAULT_TYPE
    })
</script>
