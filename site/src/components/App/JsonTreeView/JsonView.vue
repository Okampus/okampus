<template>
    <JsonViewItem
        :class="[{ 'root-item': true, dark: colorScheme === 'dark' }]"
        :data="parsed"
        :max-depth="maxDepth"
        :can-select="hasSelectedListener"
        @update:selected="itemSelected"
    />
</template>

<script lang="js">
import JsonViewItem from './JsonViewItem.vue'

export default {
    components: { JsonViewItem },
    props: {
        data: {
            type: Object,
            required: true,
        },
        rootKey: {
            type: String,
            required: false,
            default: 'root',
        },
        maxDepth: {
            type: Number,
            required: false,
            default: 1,
        },
        colorScheme: {
            type: String,
            required: false,
            default: 'light',
        },
    },
    emits: ['update:selected'],
    computed: {
        parsed () {
            if (typeof this.data === 'object') {
                return this.build(this.rootKey, { ...this.data }, 0, '', true)
            }
            return {
                key: this.rootKey,
                type: 'value',
                path: '',
                depth: 0,
                value: this.data,
            }
        },
        hasSelectedListener () {
            return !!this.$attrs.onSelected
        },
    },
    methods: {
        build (key, val, depth, path, includeKey) {
            if (this.isObject(val)) {
                // Build Object
                const children = []
                for (const [childKey, childValue] of Object.entries(val)) {
                    children.push(
                        this.build(
                            childKey,
                            childValue,
                            depth + 1,
                            includeKey ? `${path}${key}.` : `${path}`,
                            true,
                        ),
                    )
                }
                return {
                    key: key,
                    type: 'object',
                    depth: depth,
                    path: path,
                    length: children.length,
                    children: children,
                }
            } else if (this.isArray(val)) {
                // Build Array
                const children = []
                for (let i = 0; i < val.length; i++) {
                    children.push(
                        this.build(
                            i.toString(),
                            val[i],
                            depth + 1,
                            includeKey ? `${path}${key}[${i}].` : `${path}`,
                            false,
                        ),
                    )
                }
                return {
                    key: key,
                    type: 'array',
                    depth: depth,
                    path: path,
                    length: children.length,
                    children: children,
                }
            } else {
                // Build Value
                return {
                    key: key,
                    type: 'value',
                    path: includeKey ? path + key : path.slice(0, -1),
                    depth: depth,
                    value: val,
                }
            }
        },
        isObject: (val) => typeof val === 'object' && val !== null && !Array.isArray(val),
        isArray: (val) => Array.isArray(val),
        itemSelected (data) {
            this.$emit('update:selected', data)
        },
    },
}
</script>

<style lang="scss" scoped>
.root-item {
    --vjc-key-color: #0977e6;
    --vjc-valueKey-color: #073642;
    --vjc-string-color: #268bd2;
    --vjc-number-color: #2aa198;
    --vjc-boolean-color: #cb4b16;
    --vjc-null-color: #6c71c4;
    --vjc-arrow-size: 6px;
    --vjc-arrow-color: #444;
    --vjc-hover-color: rgba(0, 0, 0, 0.2);

    margin-left: 0;
    width: 100%;
    height: auto;
}

:root.dark .root-item {
    --vjc-key-color: #80d8ff;
    --vjc-valueKey-color: #fdf6e3;
    --vjc-hover-color: rgba(255, 255, 255, 0.2);
    --vjc-arrow-color: #fdf6e3;
}
</style>
