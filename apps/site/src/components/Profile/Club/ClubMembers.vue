<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <ClubMembersAsync :club="club" />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ClubMembersAsync from './ClubMembersAsync.vue'
    defineProps({
        club: {
            type: Object,
            required: true,
        },
    })
</script>
