<template>
    <div class="flex flex-col items-center m-20 text-0">
        <router-link to="/" class="mb-10 w-fit">
            <div class="w-[5.5rem] h-[5.5rem] logo" allow-dark="" />
        </router-link>
        <div class="text-xl text-blue-700 uppercase">
            <template v-if="!online">
                {{ offline.error }}
            </template>
            <template v-else>
                {{ message.error }}
            </template>
        </div>

        <div class="mb-20 text-4xl text-center">
            <!-- TODO: check API health
                L'API <a class="link-blue" href="api.horizon-efrei.fr">api.horizon-efrei.fr</a> n'est pas
                accessible depuis ce réseau. -->
            <template v-if="!online">
                {{ offline.description }}
            </template>
            <template v-else>
                {{ message.description }}
            </template>
        </div>

        <div class="flex flex-row gap-5">
            <HomeButton />
            <LoginButton v-if="props.code === errorCodes.UNAUTHORIZED" />
        </div>
    </div>
</template>

<script setup>
    import { onMounted, onUnmounted, ref } from 'vue'
    import { i18n } from '@/shared/modules/i18n'
    import { errorCodes, messages } from '@/shared/errors/app-exceptions.enum.js'

    import HomeButton from '@/components/Button/HomeButton.vue'
    import LoginButton from '@/components/Button/LoginButton.vue'

    const props = defineProps({
        code: {
            type: String,
            required: true,
        },
    })

    const offline = messages[errorCodes.OFFLINE][i18n.global.locale]

    const message = Object.values(errorCodes).includes(props.code)
        ? messages[props.code][i18n.global.locale]
        : messages[errorCodes.UNKNOWN][i18n.global.locale]

    // console.log(message, props.code, typeof props.code, errorCodes)

    const online = ref(navigator.onLine)
    onMounted(() => {
        window.addEventListener('offline', () => (online.value = false))
        window.addEventListener('online', () => (online.value = true))
    })

    onUnmounted(() => {
        window.removeEventListener('offline', () => (online.value = false))
        window.removeEventListener('online', () => (online.value = true))
    })
</script>
