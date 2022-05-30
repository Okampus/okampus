<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <ClubActivityAsync :club="club" />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import ClubActivityAsync from './ClubActivityAsync.vue'
    import AppLoader from '@/components/App/AppLoader.vue'

    defineProps({
        club: {
            type: Object,
            required: true,
        },
    })
</script>
