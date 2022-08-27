<template>
    <div>
        <AlertToast
            ref="alertToast"
            v-model:active="toast.show"
            :title="toast.title"
            :message="toast.message"
            :type="toast.type"
            :duration="toast.duration"
            @close="toast.onClose"
        />

        <ModalPopup :show="showLogin" @close="showLogin = false">
            <Transition name="fade">
                <AppLogin @logged-in="showLogin = false">
                    <h2 class="text-1 text-center font-semibold">Connexion</h2>
                </AppLogin>
            </Transition>
        </ModalPopup>

        <div class="flex h-screen w-screen flex-row overflow-hidden">
            <LayoutSidebar
                ref="sidebar"
                :uncollapsed="collapsed"
                :small-screen="hiding"
                :collapsing="collapsing"
                @toggle-side-bar="toggleSidebar"
            />

            <div
                id="main-content"
                ref="content"
                :class="{ 'brightness-50 child:pointer-events-none': hiding && collapsing != collapsed }"
                class="bg-1 grow-1 h-content after-topbar app-scrollbar relative flex w-full flex-col overflow-auto"
                @mousedown="hiding && collapsed !== collapsing && toggleSidebar()"
            >
                <AppBottomSheet
                    v-model:show="modal.show"
                    :is-new="modal.isNew"
                    :title="modal.title"
                    :uncollapsed="collapsed"
                    :small-screen="hiding"
                    :component="modal.component"
                    :props="modal.props"
                />

                <AppException v-if="error.code" :code="error.code" />
                <RouterView v-else v-slot="{ Component }">
                    <template v-if="Component">
                        <!--
                            TODO: Transition f*** everything up - check out an alternative compatible with Apollo Vue(?)
                            <Transition mode="out-in" name="switch-fade">
                            <KeepAlive> -->
                        <Suspense timeout="0">
                            <component :is="Component" />
                            <template #fallback>
                                <AppLoader />
                            </template>
                        </Suspense>
                        <!-- </KeepAlive> -->
                        <!-- </Transition> -->
                    </template>
                </RouterView>
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
    import AppLogin from './components/App/AppLogin.vue'
    import AlertToast from '@/components/UI/Alert/AlertToast.vue'
    import AppException from '@/views/App/AppException.vue'
    import AppLoader from '@/components/App/AppLoader.vue'

    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'

    import SwiperCore, { EffectCoverflow, Navigation, Mousewheel } from 'swiper'

    import { useBreakpoints } from '@vueuse/core'

    import { emitter } from '@/shared/modules/emitter'
    import { highlightElement } from '@/utils/domUtils'
    import { logOutOnExpire } from '@/utils/logOutOnExpire'

    import { inject, nextTick, reactive, ref, watch, watchEffect } from 'vue'

    import { errorCodes } from '@/shared/errors/app-exceptions.enum'

    import { useRoute } from 'vue-router'
    import { useAuthStore } from '@/store/auth.store'
    import { useUserConfigStore } from '@/store/user-config.store'

    import 'swiper/css'
    import 'swiper/css/effect-coverflow'
    import AppBottomSheet from './components/App/AppBottomSheet.vue'
    import { isEmpty } from 'lodash'

    SwiperCore.use([EffectCoverflow, Navigation, Mousewheel])

    const currentRoute = useRoute()

    const config = useUserConfigStore()
    const auth = useAuthStore()

    const breakpoints = useBreakpoints({
        hideSidebar: 1024,
        uncollapseSidebar: 1536,
    })

    const sidebar = ref(null)
    const topbar = ref(null)
    const content = ref(null)
    const alertToast = ref(null)

    // TODO: hide sidebar on some routes for better navigation
    // const hideSidebarOnRoute = computed(() => currentRoute.fullPath !== '/')

    const hiding = breakpoints.smaller('hideSidebar')
    const uncollapsing = breakpoints.greater('uncollapseSidebar')

    const collapsing = ref(false)
    const collapsed = ref(false)

    const showLogin = ref(false)

    document.documentElement.style.setProperty('--font-size-base', inject('isMobile')() ? '13px' : '14px')

    const switchCollapsed = (event) => {
        if (event.propertyName !== 'margin-left') return
        collapsing.value = false
        collapsed.value = !collapsed.value
        sidebar.value.$el.removeEventListener('transitionend', switchCollapsed)
        sidebar.value.$el.focus()
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
        title: '',
        message: '',
        type: '',
        duration: null,
        position: 'bottom',
    })

    const modal = reactive({
        show: false,
        isNew: false,
        title: '',
        component: '',
        props: {},
    })

    const error = reactive({
        code: null,
        path: null,
    })

    const scrollHighlight = (id) => {
        const el = document.querySelector(id.startsWith('#') ? id : `#${id}`)
        if (el) highlightElement(el)
    }

    if (config.darkMode) {
        document.documentElement.classList.add('dark')
    }

    watchEffect(() =>
        config.darkMode
            ? document.documentElement.classList.add('dark')
            : document.documentElement.classList.remove('dark'),
    )

    watch(hiding, () => {
        if (hiding.value) {
            collapsed.value = false
        }
    })

    watch(uncollapsing, () => {
        collapsed.value = uncollapsing.value
    })

    emitter.on('show-login', () => {
        showLogin.value = true
    })

    emitter.on('scroll-to-anchor', (id) => {
        scrollHighlight(id)
    })

    emitter.on('show-toast', ({ type, title, message, duration, onClose, position }) => {
        toast.type = type
        toast.title = title
        toast.message = message

        toast.duration = duration
        toast.onClose = onClose ?? (() => {})
        toast.position = position ?? 'bottom'

        toast.show = true

        alertToast.value.reset()
    })

    emitter.on('show-bottom-sheet', ({ isNew, title, component, props }) => {
        modal.isNew = isNew
        modal.title = title
        modal.component = component
        modal.props = props

        modal.show = true
    })

    emitter.on('close-bottom-sheet', () => {
        modal.isNew = false
        modal.show = false
        modal.component = ''
        modal.props = {}
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
            toast.onClose = () => {}
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

    nextTick(() => {
        console.log('USER', auth.user)
        console.log('EXPIRES AT', auth.expiresAt)
        !isEmpty(auth.user) && logOutOnExpire(auth.expiresAt)
    })
</script>

<style lang="scss">
    @import '@/assets/scss/app';
    @import '@/assets/scss/colors';
    @import '@/assets/scss/fonts';
    @import '@/assets/scss/animations/bg-anims';
    @import '@/assets/scss/components/button';
    @import '@/assets/scss/components/popper';
    @import '@/assets/scss/components/card';
    @import '@/assets/scss/components/container';
    @import '@/assets/scss/components/easymde';
    @import '@/assets/scss/components/multiselect';
    @import '@/assets/scss/components/avatar-cropper';
    @import '@/assets/scss/components/input';
    @import '@/assets/scss/components/link';
    @import '@/assets/scss/components/select';
    @import '@/assets/scss/sections/hero';
    @import '@/assets/scss/sections/transition';
    @import '@/assets/scss/core/scrollbar';
    @import '@/assets/scss/core/spacing';
    @import '@/assets/scss/core/tab';

    * {
        font-family: Poppins, sans-serif;
    }

    .title-font {
        font-family: AcariSans, sans-serif;
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
