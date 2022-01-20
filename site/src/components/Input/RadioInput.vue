<template>
    <div class="bg-1 rounded flex justify-between divide-x divide-color-0 raised cursor-pointer">
        <div
            v-for="(choice, i) in choices"
            :key="i"
            class="w-full"
            :class="[ modelValue == choice.key ? 'z-10':'' ]"
            @click="$emit('update:modelValue', choice.key)"
        >
            <div
                class="h-full w-full text-center p-2 rounded"
                :class="[ modelValue == choice.key ? 'bg-blue-500 text-white ring-2 ring-blue-500':'' ]"
            >
                {{ choice.name }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        choices:{
            type:Array,
            required:true
        },
        modelValue:{
            type: null,
            required: true
        }
    },
    emits: ['update:modelValue'],
    methods: {
        test(a){
            console.log(this.$refs[a].checked)
            console.log(this.modelValue)
        }
    },

}
</script>
