<template>
    <div class="text-2 py-4 px-8">
        <h2 class="text-xl">Paramètres d'Accessibilité</h2>
        <p class="mb-6 text-sm">Améliorer votre accessibilité en fonction de vos préférences</p>
        <form>
            <h3 class="mb-2 text-xl">Couleurs et tailles de texte</h3>
            <div class="w-1/3">
                <div class="mb-2 flex justify-between">
                    <label class="text-md mr-8">Contraste élevé</label>
                    <SwitchInput v-model="daltonisme" class="my-auto" />
                </div>
                <div class="mb-2 flex justify-between">
                    <label class="text-md mr-8">Police Dyslexique</label>
                    <SwitchInput v-model="dyslexie" class="my-auto" />
                </div>
                <div class="mb-2 flex justify-between">
                    <label class="text-md my-auto mr-8">Taille du texte</label>
                    <SelectInput
                        v-model="textsize"
                        class="my-auto"
                        button-name="Taille"
                        :choices="['Petit', 'Normal', 'Grand', 'Très Grand']"
                    />
                </div>
                <div class="mb-2 flex justify-between">
                    <label class="text-md my-auto mr-8">Interlignage</label>
                    <SelectInput
                        v-model="interline"
                        class="my-auto"
                        button-name="Taille"
                        :choices="['Petit', 'Normal', 'Grand', 'Très Grand']"
                    />
                </div>
            </div>
        </form>
    </div>
</template>
<script>
    import SelectInput from '@/components/Input/SelectInput.vue'
    import SwitchInput from '@/components/Input/SwitchInput.vue'
    export default {
        components: {
            SelectInput,
            SwitchInput,
        },
        data() {
            return {
                daltonisme: false,
                dyslexie: false,
                textsize: null,
                interline: null,
            }
        },
    }
</script>
