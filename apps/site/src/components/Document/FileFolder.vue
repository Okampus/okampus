<template>
    <div>
        <div
            class="flex items-center gap-2 rounded p-1 hover:bg-2-light hover:dark:bg-2-dark"
            @click="openFolder"
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
            <div v-if="showChildren" class="ml-2 flex flex-col border-l p-1">
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
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    const props = defineProps({
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
    })

    const emit = defineEmits(['path'])

    const showChildren = ref(false)
    const openFolder = () => {
        emit('path', {
            filters: { [props.context]: props.title },
            children: props.children,
        })
        if (props.children.length > 0) {
            showChildren.value = !showChildren.value
        }
    }

    const contextList = {
        schoolYear: (val) => ['L1', 'L2', 'L3', 'M1', 'M2'][val],
        subject: (val) => val,
        type: (val) => val,
        year: (val) => val,
        query: (val) => val,
    }

    const sendObject = (data) => {
        data.filters[props.context] = props.title
        return data
    }
</script>
