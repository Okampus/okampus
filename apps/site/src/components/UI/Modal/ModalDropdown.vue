<template>
    <Dropdown class="z-10">
        <slot />

        <template #popper>
            <div class="card flex flex-col p-2">
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
    </Dropdown>
</template>

<script setup>
    import { Dropdown } from 'floating-vue'

    defineProps({
        buttons: {
            type: Object,
            required: true,
        },
    })
</script>
