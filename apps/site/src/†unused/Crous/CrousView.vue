<template>
    <Suspense>
        <template #default>
            <div>
                <BlogCrous />
            </div>
        </template>
        <template #fallback>
            <AppLoader :size="3" />
        </template>
    </Suspense>
</template>

<script setup>
    import BlogCrous from '@/views/Crous/CrousPage.vue'
    import AppLoader from '@/components/App/AppLoader.vue'
</script>
