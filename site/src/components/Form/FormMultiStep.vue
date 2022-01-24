<template>
    <div class="flex items-center mb-4">
        <template
            v-for="(step, i) in steps"
            :key="i"
        >
            <div class="flex flex-col justify-center items-center">
                <div
                    class="flex items-center w-full"
                    :class="i <= currentStep ? 'text-blue-500' : 'text-gray-500'"
                >
                    <div
                        class="flex-auto transition duration-500 ease-in-out"
                    />
                    <div
                        class="transition duration-500 ease-in-out h-12 w-12 flex items-center justify-center"
                        :class="i <= currentStep ? 'text-blue-500' : 'text-gray-500'"
                    >
                        <font-awesome-icon
                            size="lg"
                            :icon="step.icon"
                        />
                    </div>
                    <div
                        class="flex-auto border-t-2 transition duration-500 ease-in-out "
                        :class="[i != steps.length-1 ? (i < currentStep ? 'border-sky-600':'border-gray-500') : 'border-none']"
                    />
                </div>
                <div
                    class="text-xs font-medium uppercase -mt-1"
                    :class="i <= currentStep ? 'text-blue-500' : 'text-gray-500'"
                >
                    {{ step.name }}
                </div>
            </div>
            <div
                v-if="i != steps.length-1"
                class="flex-auto pb-3 border-t-2 transition duration-500 ease-in-out "
                :class="[i < currentStep ? 'border-blue-500':'border-gray-500']"
            />
        </template>
    </div>

    <slot :name="steps[currentStep].id" />

    <div class="flex justify-between mt-8">
        <button
            class="text-blue-500"
            :class="[currentStep != 0 ? 'visible': 'invisible']"
            @click.prevent="emitPreviousStep"
        >
            Revenir
        </button>

        <button
            v-if="currentStep != steps.length-1"
            class="button w-1/3"
            @click.prevent="emitNextStep"
        >
            <p>Suivant</p>
        </button>

        <button
            v-if="currentStep === steps.length-1"
            class="button green w-1/3"
            @click="emitFinish"
        >
            <p>Envoyer</p>
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
        emitFinish() {
            this.$emit('finish')
        },
    },

}
</script>
