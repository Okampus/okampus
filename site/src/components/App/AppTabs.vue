<template>
    <div>
        <div class="flex mx-auto space-x-2">
            <button
                v-for="(tab, i) in Object.keys(tabs)"
                :key="i"
                class="w-full uppercase button"
                @click="$emit('update:currentTab', i)"
            >
                <p>{{ tab.name }}</p>
            </button>
        </div>

        <template v-for="(tab, i) in Object.keys(tabs)" :key="i">
            <slot :class="i === currentTab ? 'block' : 'hidden'" :name="tab.id" />
        </template>
    </div>
</template>

<script>
export default {
    props: {
        mode: {
            type: String,
            default: 'horizontal',
        },
        type: {
            type: String,
            default: 'button',
        },
        tabs: {
            type: Object,
            default: () => {},
        },
        currentTab: {
            type: Number,
            default: 0,
        },
    },
    emits: ['update:currentTab'],
    watch: { $route: 'updateComponent' },
    methods: {
        updateComponent() {
            if (this.$route.params.component) {
                this.$emit('update:currentTab', this.$route.params.component)
            }
        },
    },
}
</script>
