<template>
    <div class=" ">
        <div class="flex items-center gap-2">
            <i
                class="fas text-base"
                :class="isOpen ? 'fa-chevron-down' : 'fa-chevron-right'"
                @click="toggle"
            ></i>
            <h3 class="text-lg">{{ props.title }}</h3>
        </div>
        <div v-if="isOpen" class="ml-[0.375rem] border-l-2 border-gray-400 pt-4 pl-4">
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
