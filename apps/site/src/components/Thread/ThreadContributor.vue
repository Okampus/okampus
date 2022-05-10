<template>
    <div>
        <img
            alt="Avatar"
            class="mt-1 mr-2 w-8 h-8 bg-white rounded-full"
            :src="participant.img"
            :title="participant.pseudo"
        />
    </div>
</template>

<script>
    export default {
        props: {
            participant: {
                type: Object,
                default: () => ({
                    img: '',
                    pseudo: '<Pseudo>',
                }),
            },
        },
    }
</script>
