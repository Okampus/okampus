<template>
    <div
        class="flex gap-2 items-center p-1 hover:bg-2-light hover:dark:bg-2-dark rounded"
        @click="emitPath(), toggleChildren()"
    >
        <i
            class="fas text-1"
            :class="[
                children.length == 0 ? 'invisible' : '',
                showChildren ? 'fa-chevron-down' : 'fa-chevron-right',
            ]"
        />
        <i class="text-1 fas fa-folder" />

        <div>
            {{ contextList[context](title) }}
        </div>
    </div>
    <transition name="file-tree">
        <div v-if="showChildren" class="flex flex-col p-1 ml-2 border-l">
            <FileFolder
                v-for="(child, i) in children"
                :key="i"
                :title="child.title"
                :children="child.children"
                :context="child.context"
                @path="$emit('path', sendObject($event))"
            />
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                required: true,
            },
            context: {
                type: String,
                required: true,
            },
            children: {
                type: Array,
                default() {
                    return []
                },
            },
        },
        emits: ['path'],
        data() {
            return {
                showChildren: false,
                contextList: {
                    schoolYear: (val) => ['L1', 'L2', 'L3', 'M1', 'M2'][val],
                    subject: (val) => val,
                    type: (val) => val,
                    year: (val) => val,
                    query: (val) => val,
                },
            }
        },
        methods: {
            toggleChildren() {
                if (this.children.length > 0) {
                    this.showChildren = !this.showChildren
                }
            },
            sendObject(data) {
                data.filters[this.context] = this.title
                return data
            },
            emitPath() {
                this.$emit('path', {
                    filters: { [this.context]: this.title },
                    children: this.children,
                })
            },
        },
    }
</script>
