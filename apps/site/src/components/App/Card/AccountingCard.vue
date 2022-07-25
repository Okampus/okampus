<template>
    <div class="bg-content flex w-full flex-row xs:rounded-xl">
        <div class="relative w-full py-2 px-4 md:py-3 md:px-5">
            <div class="text-3 items-center gap-5 overflow-hidden whitespace-nowrap font-light">
                {{ categorieName }}
                <p :class="'my-5 text-5xl text-' + color + '-700'">{{ montant }} €</p>
                <button class="absolute inset-y-0 right-0 mr-8 w-16">
                    <div
                        :class="
                            'flex justify-center items-center w-20 h-20 bg-' + color + '-300 rounded-full'
                        "
                    >
                        <i :class="'text-' + color + '-700 mx-3 fas fa-2xl fa-' + icon" />
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        icon: {
            type: String,
            required: true,
        },
        montant: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        categorieName: {
            type: String,
            required: true,
        },
    })
</script>
