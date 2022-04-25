<template>
    <div
        role="img"
        :alt="`Photo de profil de ${username}`"
        :style="{
            width: `${size}rem`,
            height: `${size}rem`,
            ...(imgSrc
                ? { background: `no-repeat url(${imgSrc})`, backgroundSize: 'cover' }
                : { backgroundColor: getColorFromData(username) }),
        }"
        class="shrink-0 rounded-full select-none avatar"
        :class="[!imgSrc ? 'avatar flex items-center justify-center' : '']"
    >
        <div v-if="!imgSrc" class="m-auto w-fit h-fit text-white" :style="{ fontSize: `${size / 2}rem` }">
            {{ getInitialsFromName(username) }}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            imgSrc: {
                type: String,
                default: null,
            },
            size: {
                type: Number,
                default: 3,
            },
            username: {
                type: String,
                default: 'Anonyme',
            },
        },
        data: function () {
            return {
                colors: [
                    '#0070f3',
                    '#00a854',
                    '#dd0031',
                    '#f5a623',
                    '#5e2ca5',
                    '#ff0097',
                    '#0026ca',
                    '#ff9502',
                    '#00b8d4',
                    '#868e96',
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
            getInitialsFromName(name) {
                const nameArray = name.split(' ')
                return (
                    nameArray[0].charAt(0) +
                    (nameArray.length > 1 ? nameArray[nameArray.length - 1].charAt(0) : '')
                )
            },
        },
    }
</script>

<style lang="scss">
    .avatar {
        box-shadow: inset 0 0 7px rgb(0 0 0 / 15%);

        .dark & {
            box-shadow: inset 0 0 5px rgb(255 255 255 / 30%);
        }
    }
</style>
