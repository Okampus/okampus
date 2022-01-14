<template>
    <div class="px-8 py-4 text-2">
        <h2 class="text-xl">
            Paramètres d'Accessibilité
        </h2>
        <p class="text-sm mb-6">
            Améliorer votre accessibilité en fonction de vos préférences
        </p>
        <form>
            <h3 class="text-xl mb-2">
                Couleurs et tailles de texte
            </h3>
            <div class="w-1/3">
                <div
                    class="flex justify-between mb-2"
                >
                    <label
                        class="text-md mr-8"
                    >Contraste élevé</label>
                    <SwitchInput
                        v-model="daltonisme"
                        class="my-auto"
                    />
                </div>
                <div
                    class="flex justify-between mb-2"
                >
                    <label
                        class="text-md mr-8"
                    >Police Dyslexique</label>
                    <SwitchInput
                        v-model="dyslexie"
                        class="my-auto"
                    />
                </div>
                <div class="flex justify-between mb-2">
                    <label
                        class="mr-8 text-md my-auto"
                    >Taille du texte</label>
                    <SelectInput
                        v-model="textsize"
                        class="my-auto"
                        button-name="Taille"
                        :choices="['Petit','Normal','Grand','Très Grand']"
                    />
                </div>
                <div class="flex justify-between mb-2">
                    <label
                        class="mr-8 text-md my-auto"
                    >Interlignage</label>
                    <SelectInput
                        v-model="interline"
                        class="my-auto"
                        button-name="Taille"
                        :choices="['Petit','Normal','Grand','Très Grand']"
                    />
                </div>
            </div>
        </form>
    </div>
</template>
<script>
import SelectInput from '../Input/SelectInput.vue';
import SwitchInput from '../Input/SwitchInput.vue';
export default {
    components: { SelectInput, SwitchInput },
    data() {
        return {
            daltonisme:false,
            dyslexie:false,
            textsize:null,
            interline:null
        }
    }
}
</script>
<style>

</style>
