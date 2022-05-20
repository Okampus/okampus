<template>
    <div class=" ">
        <div class="flex gap-2 items-center">
            <i
                class="text-base fas"
                :class="isOpen ? 'fa-chevron-down' : 'fa-chevron-right'"
                @click="toggle"
            ></i>
            <h3 class="text-lg">{{ props.title }}</h3>
        </div>
        <div v-if="isOpen" class="pt-4 pl-4 ml-[0.375rem] border-l-2 border-gray-400">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    const isOpen = ref(true)

    const toggle = () => {
        isOpen.value = !isOpen.value
    }

    const props = defineProps({
        title: {
            type: String,
            default: '',
        },
    })
</script>
