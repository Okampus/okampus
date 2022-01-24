<template>
    <!-- TODO: Mettre une transition -->
    <teleport to="body">
        <div v-if="show" class="absolute top-0 z-40 w-screen h-screen" :class="globalCustomClass">
            <div :class="modalCustomClass" class="z-50 centered-fixed">
                <slot class="" />
            </div>

            <div class="absolute w-full h-full bg-gray-800 opacity-50" @click.prevent="$emit('close')" />
        </div>
    </teleport>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            require: true,
        },
        modalCustomClass: {
            type: String,
            default() {
                return ''
            },
        },
        globalCustomClass: {
            type: String,
            default() {
                return ''
            },
        },
    },
    emits: ['close'],
    watch: {
        show: function () {
            if (this.show) {
                document.documentElement.style.overflow = 'hidden'
                return
            }

            document.documentElement.style.overflow = 'auto'
        },
    },
}
</script>

<style>
.centered-fixed {
    position: fixed;
    top: 0;
    left: 0;
    transform: translate(calc(50vw - 50%), calc(50vh - 50%));
}
</style>
