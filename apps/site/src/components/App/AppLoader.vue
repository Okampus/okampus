<template>
    <div class="text-0 mt-10 flex h-[90%] w-full flex-col items-center justify-center gap-6 text-6xl">
        <AppLogo :scale="2" />
        <svg
            class="animate-spin text-white"
            :style="{ width: `${size}rem`, height: `${size}rem` }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle class="opacity-50" cx="12" cy="12" r="10" stroke="blue" stroke-width="4"></circle>
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    </div>
</template>

<script setup>
    import AppLogo from '@/components/App/AppLogo.vue'

    defineProps({
        size: {
            type: Number,
            default: 3.5,
        },
    })
</script>
