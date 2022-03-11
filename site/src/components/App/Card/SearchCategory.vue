<template>
    <div v-if="items.length != 0">
        <div class="flex gap-2 items-center my-2 text-lg">
            <i class="fas" :class="`fa-${indexType.titleIcon}`" />

            <div class="text-sm text-1">
                {{ indexType.title }}
            </div>

            <div v-if="items.length > 5" @click="resultExtended = !resultExtended">
                <i class="fas" :class="resultExtended ? 'fa-chevron-up' : 'fa-chevron-down'" />
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <transition-group name="search-fade">
                <router-link
                    v-for="(result, idx) in renderedItems"
                    :key="idx"
                    :to="`/${indexType.routerBase}/${result.id}`"
                    @click="$emit('closeModal')"
                >
                    <div class="flex flex-col gap-1 p-2 rounded-lg">
                        <div class="flex gap-2 items-center">
                            <i class="fas" :class="`fa-${indexType.resultIcon(result)}`" />

                            <div class="flex flex-col">
                                <div class="line-clamp-1">
                                    {{ indexType.resultTitle(result) }}
                                </div>
                                <div class="text-sm line-clamp-1 text-2">
                                    {{ indexType.resultBody(result) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </router-link>
            </transition-group>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            items: {
                type: Array,
                required: true,
            },
            indexType: {
                type: Object,
                required: true,
            },
        },
        emits: ['closeModal'],
        data() {
            return {
                resultExtended: false,
                renderedItems: this.items.slice(0, 5),
            }
        },
        watch: {
            resultExtended(newVal) {
                if (newVal) {
                    this.renderedItems = this.items
                } else {
                    this.renderedItems = this.items.slice(0, 5)
                }
            },
        },
    }
</script>
