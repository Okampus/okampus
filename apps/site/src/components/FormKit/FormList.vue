<template>
    <div>
        <div class="mb-2 flex flex-wrap gap-4">
            <div v-for="(form, idx) in forms" :key="idx" class="flex flex-col items-center gap-1">
                <div class="bg-1 flex h-16 w-48 items-center rounded-md p-2 shadow-md">
                    <div class="flex w-full items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <input
                                v-model="chosedForm"
                                type="radio"
                                name="selectedForm"
                                :value="form.teamFormId"
                            />
                            <p class="ml-2 text-lg font-bold capitalize">{{ form.name }}</p>
                        </div>
                        <button @click="() => modifyForm(form)">
                            <i class="fas fa-pen w-6 text-blue-500"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-center gap-1">
                <input v-model="chosedForm" type="radio" name="selectedForm" :value="null" />
                <p>Pas de formulaire</p>
            </div>
        </div>
        <button class="w-fit rounded-md bg-blue-500 py-1 px-4 font-bold text-white" @click="newForm">
            Nouveau Formulaire
        </button>
        <ModalPopup :show="createForm" @close="closePopUp">
            <template #default="{ close }">
                <div class="card flex max-h-[80vh] max-w-3xl flex-col items-center justify-center py-8 px-10">
                    <div class="-mr-4 overflow-y-scroll pr-4">
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
                            <div class="rounded-md bg-gray-500 py-2 px-4 text-white" @click="close">
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
    import FormKitBuilder from '@/components/FormKit/FormKitBuilder.vue'
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'

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
