<template>
    <div class="text-0 flex flex-col items-center" :class="[wholePage ? 'm-20' : 'm-2']">
        <router-link v-if="wholePage" to="/" class="mb-10 w-fit">
            <AppLogo :scale="2" />
        </router-link>

        <div class="uppercase text-blue-700" :class="[wholePage ? 'text-xl' : 'text-lg']">
            <template v-if="!online">
                {{ offline.error }}
            </template>
            <template v-else>
                {{ message.error }}
            </template>
        </div>

        <div class="text-center" :class="[wholePage ? 'text-4xl mb-20' : 'text-lg']">
            <template v-if="!online">
                {{ offline.description }}
            </template>
            <template v-else>
                {{ message.description }}
            </template>
        </div>

        <div v-if="wholePage" class="flex flex-row gap-5">
            <ButtonHome />
            <ButtonLogin v-if="props.code === errorCodes.UNAUTHORIZED" />
        </div>
    </div>
</template>

<script setup>
    import AppLogo from '@/components/App/AppLogo.vue'
    import ButtonHome from '@/components/UI/Button/ButtonHome.vue'
    import ButtonLogin from '@/components/UI/Button/ButtonLogin.vue'

    import { onMounted, onUnmounted, ref, watch } from 'vue'
    import { errorCodes, messages } from '@/shared/errors/app-exceptions.enum.js'

    import { useI18n } from 'vue-i18n'

    const { locale } = useI18n({ useScope: 'global' })

    const props = defineProps({
        code: {
            type: String,
            required: true,
        },
        wholePage: {
            type: Boolean,
            default: true,
        },
    })

    const offline = messages[errorCodes.OFFLINE][locale.value]

    const message = Object.values(errorCodes).includes(props.code)
        ? messages[props.code][locale.value]
        : messages[errorCodes.UNKNOWN][locale.value]

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
