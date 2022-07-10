<template>
    <div>
        <div class="flex flex-wrap gap-4 mb-2">
            <div v-for="(form, idx) in forms" :key="idx" class="flex flex-col gap-1 items-center">
                <div class="flex items-center p-2 w-48 h-16 rounded-md shadow-md bg-1">
                    <div class="flex gap-2 justify-between items-center w-full">
                        <div class="flex gap-2 items-center">
                            <input
                                v-model="chosedForm"
                                type="radio"
                                name="selectedForm"
                                :value="form.teamFormId"
                            />
                            <p class="ml-2 text-lg font-bold text-black capitalize">{{ form.name }}</p>
                        </div>
                        <button @click="() => modifyForm(form)">
                            <i class="w-6 text-blue-500 fas fa-pen"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-1 items-center">
                <input v-model="chosedForm" type="radio" name="selectedForm" :value="null" />
                <p>Pas de formulaire</p>
            </div>
        </div>
        <button class="py-1 px-4 w-fit font-bold text-white bg-blue-500 rounded-md" @click="newForm">
            Nouveau Formulaire
        </button>
        <ModalPopup :show="createForm" @close="closePopUp">
            <template #default="{ close }">
                <div class="flex flex-col justify-center items-center py-8 px-10 max-w-3xl max-h-[80vh] card">
                    <div class="overflow-y-scroll pr-4 -mr-4">
                        <FormKitBuilder
                            :form-id="currentForm"
                            @update="
                                () => {
                                    close()
                                    loadForms()
                                }
                            "
                        ></FormKitBuilder>
                        <div class="flex gap-4 self-end">
                            <div class="py-2 px-4 text-white bg-gray-500 rounded-md" @click="close">
                                Annuler
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </ModalPopup>
    </div>
</template>

<script setup>
    import { useClubsStore } from '@/store/clubs.store'
    import { ref, watch } from 'vue'
    import FormKitBuilder from './FormKitBuilder.vue'
    import ModalPopup from '../UI/Modal/ModalPopup.vue'

    const clubs = useClubsStore()

    const forms = ref([])
    const createForm = ref(false)
    const currentForm = ref(null)
    const chosedForm = ref(null)

    const props = defineProps({
        clubId: {
            type: Number,
            required: true,
        },
    })

    const emit = defineEmits(['submit'])

    const modifyForm = (form) => {
        createForm.value = true
        currentForm.value = form.teamFormId
    }

    const newForm = () => {
        currentForm.value = null
        createForm.value = true
    }

    const closePopUp = () => {
        createForm.value = false
        currentForm.value = null
    }

    const loadTeamForm = async () => {
        const club = await clubs.getClub(props.clubId)
        chosedForm.value = club.membershipRequestForm?.teamFormId ?? null
    }

    const loadForms = async () => {
        await clubs.getForms(props.clubId, false).then((res) => {
            forms.value = res
        })
    }

    await loadForms()
    await loadTeamForm()

    watch(
        () => chosedForm.value,
        async () => {
            emit('submit', chosedForm.value)
        },
    )
</script>
