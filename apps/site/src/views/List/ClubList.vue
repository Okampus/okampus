<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <ClubsListAsync />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ClubsListAsync from '@/views/Clubs/ClubsListAsync.vue'
</script>
