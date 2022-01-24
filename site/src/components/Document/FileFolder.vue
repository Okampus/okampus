<template>
    <div
        class="flex items-center gap-2 p-1 rounded hover:bg-2-light hover:dark:bg-2-dark "
        @click="$emit('path', [folderName])"
    >
        <font-awesome-icon
            class="text-1"
            size="sm"
            :class="[childrens.length == 0 ? 'invisible':'']"
            :icon="showChildrens ? 'chevron-down': 'chevron-right'"
            @click="showChildrens = !showChildrens"
        />
        <font-awesome-icon
            class="text-1"
            :icon="'folder'"
        />

        <div>
            {{ folderName }}
        </div>
    </div>
    <transition name="fade">
        <div
            v-if="showChildrens"
            class="ml-2 p-1 border-l flex flex-col"
        >
            <FileFolder
                v-for="(children, i) in childrens"
                :key="i"
                :="children"
                @path="$emit('path', [folderName,...$event ])"
            />
        </div>
    </transition>
</template>

<script>

export default {

    props:{
        folderName:{
            type:String,
            required: true
        },
        childrens:{
            type:Array,
            default(){
                return []
            }
        }
    },
    emits:['path'],
    data() {
        return {
            showChildrens: false
        }
    }
}
</script>
