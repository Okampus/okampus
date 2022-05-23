<template>
    <div
        role="img"
        :alt="`Bannière de ${name}`"
        :style="{
            ...(imgSrc
                ? { background: `no-repeat url(${imgSrc})`, backgroundSize: 'cover' }
                : { backgroundColor: getColorFromData(data ?? name) }),
        }"
    />
</template>

<script>
    export default {
        props: {
            imgSrc: {
                type: String,
                default: null,
            },
            name: {
                type: String,
                default: 'Anonyme',
            },
            // A data field to use the banner color
            data: {
                type: String,
                default: null,
            },
        },
        data: function () {
            return {
                colors: [
                    '#00a854',
                    '#dd0031',
                    '#f5a623',
                    '#5e2ca5',
                    '#ff0097',
                    '#ff9502',
                    '#00b8d4',
                    '#868e96',
                    '#1e90aa',
                    '#f5c542',
                    '#9c27b0',
                    '#888',
                ],
            }
        },
        methods: {
            getColorFromData(string) {
                const hash = string.split('').reduce((a, b) => {
                    a = (a << 5) - a + b.charCodeAt(0)
                    return a & a
                }, 0)
                return this.colors[((hash % this.colors.length) + this.colors.length) % this.colors.length]
            },
        },
    }
</script>
