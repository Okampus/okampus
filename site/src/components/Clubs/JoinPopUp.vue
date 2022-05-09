<template>
    <div class="flex absolute top-0 flex-col justify-center w-full h-full">
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
            <h2 class="mt-4 text-lg font-bold text-center text-1">Message de l'association</h2>
            <p class="mt-2 text-base text-center text-1">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo sapiente, rem reprehenderit
                nostrum quas maiores iste similique facilis error obcaecati dolores tenetur eligendi! Fugiat,
                nemo!
            </p>
            <button class="p-2 mt-8 w-fit text-base text-center text-white bg-green-500 rounded-md">
                Poursuivre la demande
            </button>
        </div>
    </div>
</template>

<script setup>
    // import { ref } from 'vue'

    const props = defineProps({
        request: {
            type: Object,
            required: true,
        },
        // modelValue: {
        //     type: Boolean,
        //     // required: true,
        // },
    })
    const close = () => {
        // props.modelValue.value = false
    }
</script>
