<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <ClubDriveAsync :club="club" />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import ClubDriveAsync from '@/components/Profile/Club/ClubDriveAsync.vue'
    import AppLoader from '@/components/App/AppLoader.vue'

    defineProps({
        club: {
            type: Object,
            required: true,
        },
    })
</script>
