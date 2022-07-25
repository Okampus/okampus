<template>
    <div v-if="items.length != 0" class="flex flex-col gap-2">
        <transition-group name="search-fade">
            <router-link
                v-for="(result, idx) in renderedItems"
                :key="idx"
                :to="`/${indexType.routerBase}/${result.id}`"
                @click="$emit('closeModal')"
            >
                <div class="flex flex-col gap-1 rounded-lg p-2">
                    <div class="flex items-center gap-2">
                        <i class="fas" :class="`fa-${indexType.resultIcon(result)}`" />

                        <div class="flex flex-col">
                            <div class="line-clamp-1">
                                {{ indexType.resultTitle(result) }}
                            </div>
                            <div class="text-2 text-sm line-clamp-1">
                                {{ indexType.resultBody(result) }}
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
        </transition-group>
    </div>
</template>

<script setup>
    import { computed, ref } from 'vue'

    const props = defineProps({
        items: {
            type: Array,
            required: true,
        },
        indexType: {
            type: Object,
            required: true,
        },
    })

    defineEmits(['closeModal'])

    const resultExtended = ref(false)
    const renderedItems = computed(() => (resultExtended.value ? props.items : props.items.slice(0, 5)))
</script>
