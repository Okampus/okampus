<template>
    <router-link v-if="result" to="/" class="flex cursor-pointer select-none items-center">
        <img
            :src="currentLogo"
            :style="{
                width: `${scale * 7.5}rem`,
                height: `${scale * 2.5}rem`,
            }"
        />
        <div class="ml-[0.3rem] rounded bg-0-light px-[0.1rem] text-[8px] font-bold text-2-light">BETA</div>
    </router-link>
</template>

<script setup>
    // Fallback logos
    import logoSrc from '@/assets/img/logos/logo_light.png'
    import logoDarkSrc from '@/assets/img/logos/logo_dark.png'

    import { getLogoUrls } from '@/graphql/queries/config/getLogoUrls'
    import { getTenant } from '@/utils/getTenant'
    import { showErrorToast } from '@/utils/toast'
    import { useQuery } from '@vue/apollo-composable'
    import { useUserConfigStore } from '@/store/user-config.store'
    import { computed } from 'vue'

    const props = defineProps({
        scale: {
            type: Number,
            default: 1,
        },
        only: {
            type: String,
            default: 'none',
        },
    })

    const config = useUserConfigStore()

    const { result, onError } = useQuery(getLogoUrls, { id: getTenant() })
    onError(() => showErrorToast(`Les logos du tenant '${getTenant()}' n'ont pas pu être chargés !`))

    const currentLogo = computed(() => {
        if (result.value) {
            const {
                getLogoUrls: { logoUrl, logoDarkUrl },
            } = result.value

            return (config.darkMode && props.only !== 'light') || props.only === 'dark'
                ? logoDarkUrl
                    ? logoDarkUrl
                    : logoUrl
                    ? logoUrl
                    : logoDarkSrc
                : logoUrl
                ? logoUrl
                : logoSrc
        }

        return (config.darkMode && props.only !== 'light') || props.only === 'dark' ? logoDarkSrc : logoSrc
    })
</script>
