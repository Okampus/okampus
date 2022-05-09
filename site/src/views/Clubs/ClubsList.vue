<template>
    <Suspense>
        <ClubsListAsync></ClubsListAsync>
        <template #fallback>
            <AppLoader :size="3" />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ClubsListAsync from '@/views/Clubs/ClubsListAsync.vue'
</script>
