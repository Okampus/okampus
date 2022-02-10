<template>
    <div>
        <div class="absolute top-0 left-0 py-12 w-full h-52 hero" />
        <div
            class="flex relative flex-col mt-8 mb-6 space-y-4 rounded md:mx-auto md:mt-12 md:mb-10 md:w-11/12 md:rounded-lg card"
        >
            <slot />
        </div>
    </div>
</template>

<script>
    export default {}
</script>
