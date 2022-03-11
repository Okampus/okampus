<template>
    <div>
        <div class="flex -mt-1 mb-2 space-x-2">
            <template v-if="mode == 'tabs'">
                <div
                    v-for="(t, i) in tabs"
                    :key="i"
                    class="flex gap-3 justify-center items-center py-3 w-full text-lg tab"
                    :class="{ active: tabs[tab].id === t.id }"
                    @click="updateTab(i)"
                >
                    <i class="fas" :class="`fa-${t.icon}`" />
                    <p>{{ t.name }}</p>
                </div>
            </template>
            <template v-else>
                <slot v-for="(t, i) in tabs" :key="i" class="w-full" @click="updateTab(i)">
                    <p>{{ t.name }}</p>
                    <i class="fas" :class="`fa-${t.icon}`" />
                </slot>
            </template>
        </div>

        <slot :name="tabs[tab].id" />
    </div>
</template>

<script>
    import router from '@/router'

    export default {
        props: {
            mode: {
                type: String,
                default: 'tabs',
            },
            type: {
                type: String,
                default: 'button',
            },
            tabs: {
                type: Object,
                default: () => {},
            },
            tab: {
                type: Number,
                default: 0,
            },
            routeBase: {
                type: String,
                default: '',
            },
        },
        emits: ['update:tab'],
        watch: { $route: 'updateComponent' },
        created() {
            this.updateComponent()
        },
        methods: {
            getTabFromRoute() {
                return this.tabs.findIndex((t) => t.id === this.$route.params.component)
            },
            updateComponent() {
                if (this.$route.params.component) {
                    const newTab = this.getTabFromRoute()
                    if (newTab !== this.tab) {
                        this.$emit('update:tab', newTab)
                    }
                }
            },
            updateTab(newTab) {
                this.$emit('update:tab', newTab)
                router.push(`${this.routeBase}/${this.tabs[newTab].id}`)
            },
        },
    }
</script>
