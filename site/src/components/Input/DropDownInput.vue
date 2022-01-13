<template>
    <VPopper
        :offset-distance="'0'"
        :interactive="false"
    >
        <slot />

        <template
            #content
        >
            <div class="card p-2 flex flex-col">
                <div
                    v-for="(button, i) in buttons"
                    :key="i"
                    class="py-2 px-4 rounded-xl flex justify-center items-center gap-2"
                    :class="button.class"
                    @click="button.action()"
                >
                    <i :class="button.icon" />
                    {{ button.name }}
                </div>
            </div>
        </template>
    </VPopper>
</template>

<script>
export default {
    props:{
        buttons:{
            type:Array,
            required: true
        },
        placeholder:{
            type: Object,
            default(){
                return {name:'', icon:''}
            }
        }
    },
    monted(){
        console.log(this.buttons)
    }
}
</script>
