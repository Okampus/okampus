<template>
    <div class="text-0 m-20 flex flex-col items-center">
        <router-link to="/" class="mb-10 w-fit">
            <div class="w- logo h-[5.5rem] w-[16.5rem]" allow-dark="" />
        </router-link>

        <div class="text-xl uppercase text-blue-700">
            <template v-if="!online">
                {{ offline.error }}
            </template>
            <template v-else>
                {{ message.error }}
            </template>
        </div>

        <div class="mb-20 text-center text-4xl">
            <template v-if="!online">
                {{ offline.description }}
            </template>
            <template v-else>
                {{ message.description }}
            </template>
        </div>

        <div class="flex flex-row gap-5">
            <ButtonHome />
            <ButtonLogin v-if="props.code === errorCodes.UNAUTHORIZED" />
        </div>
    </div>
</template>

<script setup>
    import { onMounted, onUnmounted, ref, watch } from 'vue'
    import { i18n } from '@/shared/modules/i18n'
    import { errorCodes, messages } from '@/shared/errors/app-exceptions.enum.js'

    import ButtonHome from '@/components/UI/Button/ButtonHome.vue'
    import ButtonLogin from '@/components/UI/Button/ButtonLogin.vue'

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

    const online = ref(navigator.onLine)

    onMounted(() => {
        window.addEventListener('offline', () => (online.value = false))
        window.addEventListener('online', () => (online.value = true))
    })

    onUnmounted(() => {
        window.removeEventListener('offline', () => (online.value = false))
        window.removeEventListener('online', () => (online.value = true))
    })

    watch(
        () => online.value,
        (currentlyOnline, previouslyOnline) => {
            if (!previouslyOnline && currentlyOnline) {
                window.location.reload()
            }
        },
    )
</script>
