<template>
    <svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:svg="http://www.w3.org/2000/svg"
        fill="currentColor"
    >
        <path
            v-if="full"
            d="m 20,10.01875 h -4 v -7 a -1,-1 0 0 0 -1,-1 H 9 a -1,-1 0 0 0 -1,1 v 7 H 4 a -1.001,-1.001 0 0 0 -0.781,1.625 l 8,10 c 0.381,0.475 1.181,0.475 1.562,0 l 8,-10 A -1.001,-1.001 0 0 0 20,10.01875 Z"
        />
        <path
            v-else
            d="m 11.219,21.64375 c 0.381,0.475 1.181,0.475 1.562,0 l 8,-10 A -1.001,-1.001 0 0 0 20,10.01875 h -4 v -7 a -1,-1 0 0 0 -1,-1 H 9 a -1,-1 0 0 0 -1,1 v 7 H 4 a -1.001,-1.001 0 0 0 -0.781,1.625 z M 9,12.01875 h 1 v -8 h 4 v 8 h 3.919 l -5.919,7.399 -5.919,-7.399 z"
        />
    </svg>
</template>

<script>
    export default {
        props: {
            full: {
                type: Boolean,
                required: true,
            },
        },
    }
</script>
