<template>
    <Popper offset-distance="0" :interactive="false">
        <slot />

        <template #content>
            <div class="flex flex-col p-2 card">
                <div
                    v-for="(button, _, i) in buttons"
                    :key="i"
                    class="group flex gap-2 items-center py-2 px-4 text-center rounded-xl"
                    :class="button.class"
                    @click="button.action()"
                >
                    <i class="fas" :class="`fa-${button.icon}`" />
                    <div>
                        {{ button.name }}
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
