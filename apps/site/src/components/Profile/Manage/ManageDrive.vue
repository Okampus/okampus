<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <ManageDriveAsync :club="club" />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import ManageDriveAsync from '@/components/Profile/Manage/ManageDriveAsync.vue'

    defineProps({
        club: {
            type: Object,
            required: true,
        },
    })
</script>
