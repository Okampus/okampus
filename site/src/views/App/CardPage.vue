<template>
    <div>
        <div class="absolute top-0 left-0 py-12 w-full h-52 hero" />
        <div
            class="flex relative flex-col mt-8 space-y-4 min-h-[9.5rem] rounded md:mx-auto md:mt-12 md:w-11/12 md:rounded-lg card bg-content"
        >
            <slot />
        </div>
    </div>
</template>

<script>
    export default {}
</script>
