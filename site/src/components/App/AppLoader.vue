<template lang="">
    <div class="absolute right-1/2 -mr-12 -mt-12 top-1/2 text-0 ">
        <div class="relative w-24 h-24 animate-spin border-8 rounded-full ">
            <div
                class="h-24 w-24 -top-12 -left-12 absolute"
                :class="background"
            />
        </div>
    </div>
</template>
<script>
export default {
    props:{
        background: {
            type: String,
            default :() => "bg-2"
        }
    }
}
</script>
<style >
</style>
