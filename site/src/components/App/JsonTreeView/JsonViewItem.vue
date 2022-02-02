<template>
    <div class="json-view-item">
        <!-- Handle Objects and Arrays-->
        <div v-if="data.type === 'object' || data.type === 'array'">
            <button class="data-key" :aria-expanded="open ? 'true' : 'false'" @click.stop="open = !open">
                <span :class="{ 'chevron-arrow': true, opened: open }" />
                {{ data.key }}:
                <span class="properties">{{ lengthString }}</span>
            </button>
            <json-view-item
                v-for="child in data.children"
                v-show="open"
                :key="getKey(child)"
                :data="child"
                :max-depth="maxDepth"
                :can-select="canSelect"
                @update:selected="bubbleSelected"
            />
        </div>
        <div
            v-if="data.type === 'value'"
            :class="{ 'value-key': true, 'can-select': canSelect }"
            :role="canSelect ? 'button' : undefined"
            :tabindex="canSelect ? '0' : undefined"
            @click="emitSelect(data)"
            @keyup.enter="emitSelect(data)"
            @keyup.space="emitSelect(data)"
        >
            <span class="value-key">{{ data.key }}:</span>
            <span :style="getValueStyle(data.value)">{{ dataValue }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            data: {
                required: true,
                type: Object,
            },
            maxDepth: {
                type: Number,
                required: false,
                default: 1,
            },
            canSelect: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['update:selected'],
        data() {
            return { open: this.data.depth < this.maxDepth }
        },
        computed: {
            lengthString() {
                switch (this.data.type) {
                    case 'array':
                        return this.data.length === 1
                            ? this.data.length + ' element'
                            : this.data.length + ' elements'
                    case 'object':
                        return this.data.length === 1
                            ? this.data.length + ' property'
                            : this.data.length + ' properties'
                    default:
                        return ''
                }
            },
            dataValue() {
                if (this.data.type === 'value') {
                    if (typeof this.data.value === 'undefined') {
                        return 'undefined'
                    }
                    return JSON.stringify(this.data.value)
                }
                return ''
            },
        },
        methods: {
            emitSelect(data) {
                this.$emit('update:selected', {
                    key: data.key,
                    value: data.type === 'value' ? data.value : undefined,
                    path: data.path,
                })
            },
            bubbleSelected(data) {
                this.$emit('update:selected', data)
            },
            getKey(value) {
                if (!isNaN(value.key)) {
                    return value.key + ':'
                } else {
                    return '"' + value.key + '":'
                }
            },
            getValueStyle(value) {
                switch (typeof value) {
                    case 'string':
                        return { color: 'var(--vjc-string-color)' }
                    case 'number':
                        return { color: 'var(--vjc-number-color)' }
                    case 'boolean':
                        return { color: 'var(--vjc-boolean-color)' }
                    case 'object':
                        return { color: 'var(--vjc-null-color)' }
                    case 'undefined':
                        return { color: 'var(--vjc-null-color)' }
                    default:
                        return { color: 'var(--vjc-valueKey-color)' }
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    .json-view-item:not(.root-item) {
        margin-left: 15px;
    }

    .value-key {
        padding: 5px 5px 5px 10px;
        margin-left: 10px;
        font-weight: 600;
        color: var(--vjc-value-key-color);
        white-space: nowrap;
        border-radius: 2px;

        &.can-select {
            cursor: pointer;

            &:hover {
                background-color: rgb(0 0 0 / 8%);
            }

            &:focus {
                outline: 2px solid var(--vjc-hover-color);
            }
        }
    }

    .data-key {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 5px;
        font-family: inherit;

        // Button overrides
        font-size: 100%;
        font-weight: 600;

        // Normal styles
        color: var(--vjc-key-color);
        white-space: nowrap;
        cursor: pointer;
        background-color: transparent;
        border: 0;
        border-radius: 2px;

        &:hover {
            background-color: var(--vjc-hover-color);
        }

        &:focus {
            outline: 2px solid var(--vjc-hover-color);
        }

        &::-moz-focus-inner {
            border: 0;
        }

        .properties {
            margin-left: 4px;
            font-weight: 300;
            user-select: none;
            opacity: 0.9;
        }
    }

    .chevron-arrow {
        flex-shrink: 0;
        width: var(--vjc-arrow-size);
        height: var(--vjc-arrow-size);
        margin-right: 20px;
        margin-left: 5px;
        border-right: 4px solid var(--vjc-arrow-color);
        border-bottom: 4px solid var(--vjc-arrow-color);
        transform: rotate(-45deg);

        &.opened {
            margin-top: -3px;
            transform: rotate(45deg);
        }
    }
</style>
