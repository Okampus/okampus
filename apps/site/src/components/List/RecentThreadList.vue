<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <RecentThreadListAsync />
            <template #fallback>
                <div class="flex justify-center mt-4 w-full">
                    <div class="w-[3.5rem] h-[3.5rem]">
                        <svg
                            class="text-white animate-spin"
                            :style="{ width: `3rem`, height: `3rem` }"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-50"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="blue"
                                stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    </div>
                </div>
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import RecentThreadListAsync from '@/components/List/RecentThreadListAsync.vue'
</script>
