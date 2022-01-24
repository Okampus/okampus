<template>
    <div>
        <img
            alt="Avatar"
            class="mt-1 mr-2 w-8 h-8 bg-white rounded-full"
            :src="contributor.img"
            :title="contributor.pseudo"
        />
    </div>
</template>

<script lang="js">

export default {
    props: {
        contributor: {
            type: Object,
            default: () => ({
                img: '',
                pseudo: '<Pseudo>',
            }),
        },
    },
}
</script>
