<template>
    <div class="flex items-center">
        <template
            v-for="(step, i) in steps"
            :key="i"
        >
            <div class="flex flex-col justify-center items-center gap-2">
                <div
                    class="flex items-center w-full"
                    :class="i <= currentStep ? 'text-sky-600' : 'text-gray-500'"
                >
                    <div
                        class="flex-auto border-t-2 transition duration-500 ease-in-out"
                        :class="[i != 0 ? (i < currentStep + 1 ? 'border-sky-600':'border-gray-500') : 'border-none']"
                    />
                    <div
                        class="rounded-full transition duration-500 ease-in-out h-12 w-12 border-2 flex items-center justify-center"
                        :class="i <= currentStep ? 'border-sky-600' : 'border-gray-500'"
                    >
                        <i
                            class="ri-lg"
                            :class="step.icon"
                        />
                    </div>
                    <div
                        class="flex-auto border-t-2 transition duration-500 ease-in-out "
                        :class="[i != steps.length-1 ? (i < currentStep ? 'border-sky-600':'border-gray-500') : 'border-none']"
                    />
                </div>
                <div
                    class="text-xs font-medium uppercase"
                    :class="i <= currentStep ? 'text-sky-600' : 'text-gray-500'"
                >
                    {{ step.name }}
                </div>
            </div>
            <div
                v-if="i != steps.length-1"
                class="flex-auto pb-6 border-t-2 transition duration-500 ease-in-out "
                :class="[i < currentStep ? 'border-sky-600':'border-gray-500']"
            />
        </template>
    </div>

    <slot :name="steps[currentStep].id" />

    <div class="flex mt-4">
        <button
            v-if="currentStep != 0"
            class="button mr-4"
            @click.prevent="emitPreviousStep"
        >
            <p>Previous Step</p>
        </button>

        <button
            v-if="currentStep != steps.length-1"
            class="button"
            @click.prevent="emitNextStep"
        >
            <p>Next Step</p>
        </button>

        <button
            v-if="currentStep === steps.length-1"
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 ml-4"
            @click="emitForm"
        >
            Finish
        </button>
    </div>
</template>
<script>
export default {
    props: {
        steps: {
            type: Array,
            default: () => []
        },
        modelValue: {
            type: Object,
            required: true
        },
    },
    emits: ['update:modelValue', 'previous-step', 'next-step', 'finish'],
    computed: {
        currentStep(){
            return this.modelValue.currentStep
        },
        nextStep(){
            return this.modelValue.nextStep
        },
        previousStep(){
            return this.modelValue.previousStep
        }
    },
    watch: {
        previousStep(newValue, oldValue) {
            if (newValue && !oldValue) {
                this.$emit('update:modelValue', {
                    currentStep: this.currentStep-1,
                    previousStep: false,
                    nextStep: this.nextStep
                })
            }
        },
        nextStep(newValue, oldValue) {
            if (newValue && !oldValue) {
                this.$emit('update:modelValue', {
                    currentStep: this.currentStep-1,
                    previousStep: false,
                    nextStep: this.nextStep
                })
            }
        },
    },
    methods: {
        emitNextStep(){
            this.$emit('next-step')
        },
        emitPreviousStep(){
            this.$emit('previous-step')
        },
        emitForm() {
            this.$emit('finish')
        },
    },

}
</script>
