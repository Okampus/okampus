<template>
    <AppModal :show="props.show">
        <div
            class="flex relative flex-col justify-center items-center p-4 mx-auto w-[36rem] min-h-fit rounded-md shadow-lg bg-1"
        >
            <button class="absolute top-4 right-4" @click="close">
                <i class="text-red-500 text-md fas fa-times"></i>
            </button>
            <h1 class="text-2xl font-bold text-1">Demande d'adhésion</h1>
            <p class="mt-4 text-base text-center text-1">
                Votre demande pour rejoindre l’association
                <span class="font-bold">{{ props.request.team.name }}</span> a bien été transmise.
            </p>
            <h2
                v-if="props.request.team.membershipRequestMessage"
                class="mt-4 text-lg font-bold text-center text-1"
            >
                Message de l'association
            </h2>
            <p v-if="props.request.team.membershipRequestMessage" class="mt-2 text-base text-center text-1">
                {{ props.request.team.membershipRequestMessage }}
            </p>
            <a
                v-if="props.request.team.membershipRequestLink"
                :href="props.request.team.membershipRequestLink"
            >
                <button class="p-2 mt-8 w-fit text-base text-center text-white bg-green-500 rounded-md">
                    Poursuivre la demande
                </button>
            </a>
        </div>
    </AppModal>
</template>

<script setup>
    // import { ref } from 'vue'
    import AppModal from '../App/AppModal.vue'

    const props = defineProps({
        request: {
            type: Object,
            required: true,
        },
        show: {
            type: Boolean,
            required: true,
        },

        // modelValue: {
        //     type: Boolean,
        //     // required: true,
        // },
    })

    const emit = defineEmits(['close'])

    const close = () => {
        console.log('close')
        emit('close')
    }
</script>
