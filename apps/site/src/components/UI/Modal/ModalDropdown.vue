<template>
    <Popper offset-distance="0" :interactive="false">
        <slot />

        <template #content="{ close }">
            <div class="card flex flex-col p-2" @mouseleave="close">
                <div
                    v-for="(button, _, i) in buttons"
                    :key="i"
                    class="group flex cursor-pointer select-none items-center gap-2 rounded-xl py-2 px-4 text-center"
                    :class="button.class"
                    @click="button.action()"
                >
                    <i class="fas w-[1.2rem]" :class="`fa-${button.icon ?? 'square'}`" />
                    <div>
                        {{ button.name?.value ?? button.name }}
                    </div>
                </div>
            </div>
        </template>
    </Popper>
</template>

<script setup>
    import Popper from 'vue3-popper'
    defineProps({
        buttons: {
            type: Object,
            required: true,
        },
    })
</script>
