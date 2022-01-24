<template>
    <Popper :offset-distance="'0'" :interactive="true">
        <slot />

        <template #content>
            <div class="flex flex-col p-2 card">
                <div
                    v-for="(button, i) in buttons"
                    :key="i"
                    class="flex gap-2 items-center py-2 px-4 text-center rounded-xl"
                    :class="button.class"
                    @click="button.action()"
                >
                    <font-awesome-icon :icon="button.icon" />
                    <div>
                        {{ button.name }}
                    </div>
                </div>
            </div>
        </template>
    </Popper>
</template>

<script>
import Popper from 'vue3-popper'

export default {
    components: { Popper },
    props: {
        buttons: {
            type: Array,
            required: true,
        },
        placeholder: {
            type: Object,
            default() {
                return {
                    name: '',
                    icon: '',
                }
            },
        },
    },
    monted() {
        console.log(this.buttons)
    },
}
</script>
