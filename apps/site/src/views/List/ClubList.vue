<template>
    <Transition mode="out-in" name="switch-fade">
        <keep-alive>
            <Suspense>
                <ClubsListAsync />
                <template #fallback>
                    <AppLoader />
                </template>
            </Suspense>
        </keep-alive>
    </Transition>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ClubsListAsync from '@/views/Clubs/ClubsListAsync.vue'
</script>
