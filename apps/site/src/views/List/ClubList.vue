<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <ClubListAsync />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ClubListAsync from '@/views/List/ClubListAsync.vue'
</script>
