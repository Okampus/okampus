<template>
    <div class="text-0 flex flex-col items-center" :class="[wholePage ? 'm-10' : 'm-2']">
        <div class="uppercase text-blue-700" :class="[wholePage ? 'text-xl' : 'text-lg']">
            <template v-if="!online">
                {{ offline.error }}
            </template>
            <template v-else>
                {{ message.error }}
            </template>
        </div>

        <div class="text-center" :class="[wholePage ? 'text-4xl' : 'text-lg']">
            <template v-if="!online">
                {{ offline.description }}
            </template>
            <template v-else>
                {{ customMessage ? customMessage : message.description }}
            </template>
        </div>

        <div v-if="wholePage && showHome" class="mt-10 flex flex-col items-center gap-5">
            <ButtonHome />
        </div>
    </div>
</template>

<script setup>
    import ButtonHome from '@/components/UI/Button/ButtonHome.vue'

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
        customMessage: {
            type: String,
            default: null,
        },
        showHome: {
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
