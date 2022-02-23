<template>
    <div class="flex justify-center items-center my-10 w-full h-full text-6xl text-0">
        <svg
            class="text-white animate-spin"
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
    defineProps({
        size: {
            type: Number,
            default: 4,
        },
    })
</script>
