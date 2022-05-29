<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <ManageRequestsAsync :club="club" />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import ManageRequestsAsync from '@/components/Profile/Manage/ManageRequestsAsync.vue'

    defineProps({
        club: {
            type: Object,
            required: true,
        },
    })
</script>
