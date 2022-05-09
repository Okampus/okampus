<template>
    <div class="flex flex-row w-full xs:rounded-xl bg-content">
        <div class="relative py-2 px-4 w-full md:py-3 md:px-5">
            <div class="overflow-hidden gap-5 items-center font-light whitespace-nowrap text-3">
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
