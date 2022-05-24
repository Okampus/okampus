<template>
    <div>
        <AlertToast
            v-model:active="toast.show"
            :message="toast.message"
            :type="toast.type"
            v-bind="!isNil(toast.duration) ? { duration: toast.duration } : {}"
        />
        <FormLogin v-model:show-login="showLogin" />

        <div class="flex flex-row w-screen h-screen z-1">
            <LayoutSidebar
                ref="sidebar"
                :uncollapsed="collapsed"
                :collapsing="collapsing"
                :small-screen="hiding"
                @toggle-side-bar="toggleSidebar"
            />
            <div
                ref="content"
                :class="{ 'brightness-50': hiding && collapsing != collapsed }"
                class="flex overflow-auto relative flex-col w-full bg-app h-content after-topbar app-scrollbar"
                @mousedown="hiding && collapsed !== collapsing && toggleSidebar()"
            >
                <div
                    class="flex-auto shrink-0 grow-1"
                    :class="{ 'pointer-events-none': hiding && collapsing != collapsed }"
                >
                    <AppException v-if="error.code" :code="error.code" />
                    <!-- Experimenting with frontend caching / TODO: check for performance & memory leak issues -->
                    <router-view v-else v-slot="{ Component, route }">
                        <keep-alive>
                            <component
                                :is="Component"
                                :key="route.meta.usePathKey ? route.path : undefined"
                            />
                        </keep-alive>
                    </router-view>
                </div>
            </div>
            <LayoutTopbar
                ref="topbar"
                :class="{ 'brightness-50': hiding && collapsing != collapsed }"
                @mousedown="hiding && collapsed !== collapsing && toggleSidebar()"
                @toggle-side-bar="!collapsing && toggleSidebar()"
            />
        </div>
    </div>
</template>

<script setup>
    import LayoutSidebar from '@/components/Layout/LayoutSidebar.vue'
    import LayoutTopbar from '@/components/Layout/LayoutTopbar.vue'
    import FormLogin from '@/components/Form/FormLogin.vue'
    import AlertToast from '@/components/UI/Alert/AlertToast.vue'
    import AppException from '@/views/App/AppException.vue'

    import { useBreakpoints } from '@vueuse/core'

    import { emitter } from '@/shared/modules/emitter'
    import { useAuthStore } from '@/store/auth.store'
    import { useUserConfigStore } from '@/store/user-config.store'
    import { useRoute } from 'vue-router'

    import logOutOnExpire from '@/utils/logOutOnExpire'

    import { inject, nextTick, reactive, ref, watch, watchEffect } from 'vue'

    import { isNil } from 'lodash'
    import { errorCodes } from './shared/errors/app-exceptions.enum'

    const breakpoints = useBreakpoints({
        hideSidebar: 1024,
        uncollapseSidebar: 1536,
    })

    const sidebar = ref(null)
    const topbar = ref(null)
    const content = ref(null)

    const hiding = breakpoints.smaller('hideSidebar')
    const uncollapsing = breakpoints.greater('uncollapseSidebar')

    const collapsing = ref(false)
    const collapsed = ref(false)

    const showLogin = ref(false)

    document.documentElement.style.setProperty('--font-size-base', inject('isMobile')() ? '12px' : '13px')

    const switchCollapsed = (event) => {
        if (event.propertyName !== 'margin-left') return
        collapsing.value = false
        collapsed.value = !collapsed.value
        sidebar.value.$el.removeEventListener('transitionend', switchCollapsed)
    }

    const toggleSidebar = () => {
        if (hiding.value) {
            if (collapsing.value) {
                sidebar.value.$el.removeEventListener('transitionend', switchCollapsed)
                collapsed.value = !collapsed.value
            } else {
                collapsing.value = true
            }
            sidebar.value.$el.addEventListener('transitionend', switchCollapsed)
        } else {
            collapsed.value = !collapsed.value
        }
    }

    const toast = reactive({
        show: false,
        message: '',
        type: '',
        duration: null,
    })

    const error = reactive({
        code: null,
        path: null,
    })

    const scrollHighlight = (id) => {
        const el = document.querySelector(id.startsWith('#') ? id : `#${id}`)
        if (el) {
            el.classList.add('highlight-active')
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
            el.addEventListener(
                'animationend',
                () => {
                    el.classList.remove('highlight-active')
                },
                { once: true },
            )
        }
    }

    const config = useUserConfigStore()

    const auth = useAuthStore()
    const currentRoute = useRoute()

    if (config.darkMode) {
        document.documentElement.classList.add('dark')
    }
    watch(
        () => config.darkMode,
        (enabled) => {
            if (enabled) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        },
    )

    watch(hiding, () => {
        if (hiding.value) {
            collapsed.value = false
        }
    })

    watch(uncollapsing, () => {
        collapsed.value = uncollapsing.value
    })

    emitter.on('login', () => {
        showLogin.value = true
    })

    emitter.on('scroll-to-anchor', (id) => {
        scrollHighlight(id)
    })

    emitter.on('show-toast', ({ message, type, duration }) => {
        toast.show = true
        toast.type = type
        toast.message = message
        toast.duration = duration
    })

    emitter.on('error-route', ({ code, path }) => {
        error.code = code
        error.path = path ?? currentRoute.path
    })

    emitter.on('logout', () => {
        auth.logOut().then(() => {
            if (currentRoute.meta?.requiresAuth) {
                error.code = errorCodes.UNAUTHORIZED
                error.path = currentRoute.path
            }
        })
    })

    watchEffect(() => {
        if (!toast.show) {
            toast.type = 'info'
            toast.message = ''
            toast.duration = null
        }
    })

    watchEffect(() => {
        if (
            error.code &&
            (currentRoute.path !== error.path || (error.code === errorCodes.UNAUTHORIZED && auth.loggedIn))
        ) {
            error.code = null
            error.path = null
        }
    })

    nextTick(() => logOutOnExpire(auth.user))
</script>

<style lang="scss">
    @import '@/assets/scss/colors';
    @import '@/assets/scss/app';
    @import '@/assets/scss/animations/bg-anims';
    @import '@/assets/scss/components/button';
    @import '@/assets/scss/components/card';
    @import '@/assets/scss/components/easymde';
    @import '@/assets/scss/components/input';
    @import '@/assets/scss/components/link';
    @import '@/assets/scss/components/select';
    @import '@/assets/scss/sections/hero';
    @import '@/assets/scss/sections/label';
    @import '@/assets/scss/sections/transition';
    @import '@/assets/scss/core/scrollbar';
    @import '@/assets/scss/core/spacing';
    @import '@/assets/scss/core/tab';

    @font-face {
        font-family: Montserrat;
        src: url('@/assets/font/Montserrat/Montserrat-VariableFont_wght.ttf') format('truetype');
    }

    @font-face {
        font-family: Montserrat;
        font-style: italic;
        src: url('@/assets/font/Montserrat/Montserrat-Italic-VariableFont_wght.ttf') format('truetype');
    }

    @font-face {
        font-family: Fredoka;
        src: url('@/assets/font/Fredoka/Fredoka-VariableFont_wdth,wght.ttf') format('truetype');
    }

    * {
        font-family: Montserrat, sans-serif;
        font-weight: 450;
    }

    .header {
        font-family: Fredoka, sans-serif;
    }

    // TODO: Adapt font size to screen size (for small screen sizes)
    html {
        font-size: var(--font-size-base);
    }

    @media (min-width: 768px) {
        html {
            font-size: 15px;
        }
    }

    .transition-brightness {
        transition: 300ms;
    }
</style>
