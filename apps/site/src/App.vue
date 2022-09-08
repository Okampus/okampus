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
                v-if="localStore.me?.finishedOnboarding"
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
                class="bg-1 grow-1 h-content app-scrollbar after-topbar relative flex w-full flex-col overflow-auto"
                @mousedown="hiding && collapsed !== collapsing && toggleSidebar()"
            >
                <AppBottomSheet
                    v-model:show="modal.show"
                    :is-new="modal.isNew"
                    :title="modal.title"
                    :padded="modal.padded"
                    :uncollapsed="collapsed"
                    :small-screen="hiding"
                    :component="modal.component"
                    :props="modal.props"
                    :show-unsaved="modal.showUnsaved"
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
                :class="{ 'brightness-50 child:pointer-events-none': hiding && collapsing != collapsed }"
                @mousedown="hiding && collapsed !== collapsing && toggleSidebar()"
                @toggle-side-bar="!collapsing && toggleSidebar()"
            />
        </div>
    </div>
</template>

<script setup>
    import AppBottomSheet from './components/App/AppBottomSheet.vue'
    import LayoutSidebar from '@/components/Layout/LayoutSidebar.vue'
    import LayoutTopbar from '@/components/Layout/LayoutTopbar.vue'
    import AppLogin from './components/App/AppLogin.vue'
    import AlertToast from '@/components/UI/Alert/AlertToast.vue'
    import AppException from '@/views/App/AppException.vue'
    import AppLoader from '@/components/App/AppLoader.vue'

    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'

    import SwiperCore, { EffectCoverflow, Navigation, Mousewheel, Pagination } from 'swiper'

    import { useBreakpoints } from '@vueuse/core'

    import { isEmpty } from 'lodash'

    import localStore from '@/store/local.store'
    import { getMe } from '@/graphql/queries/auth/getMe'

    import $axios from '@/shared/config/axios.config'
    import { apolloClient } from '@/shared/modules/apollo.client'
    import { errorCodes } from '@/shared/errors/app-exceptions.enum'
    import { emitter } from '@/shared/modules/emitter'

    import { highlightElement } from '@/utils/domUtils'
    import { logOutOnExpire } from '@/utils/logOutOnExpire'

    import { inject, nextTick, reactive, ref, watch, watchEffect } from 'vue'

    import { useRoute } from 'vue-router'

    import 'swiper/css'
    import 'swiper/css/effect-coverflow'
    import 'swiper/css/pagination'

    import { twBreakpoints } from './tailwind'
    import { useQuery } from '@vue/apollo-composable'
    import { showErrorToast, showToastGraphQLError } from './utils/toast'

    SwiperCore.use([EffectCoverflow, Navigation, Mousewheel, Pagination])

    const currentRoute = useRoute()

    const breakpoints = useBreakpoints(twBreakpoints)

    const sidebar = ref(null)
    const topbar = ref(null)
    const content = ref(null)
    const alertToast = ref(null)

    // TODO: hide sidebar on some routes for better navigation
    // const hideSidebarOnRoute = computed(() => currentRoute.fullPath !== '/')

    const hiding = breakpoints.smaller('lg')
    const uncollapsing = breakpoints.greater('2xl')

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
        isNew: false,
        padded: true,
        title: '',
        component: '',
        props: {},
        show: false,
    })

    const error = reactive({
        code: null,
        path: null,
    })

    const scrollHighlight = (id) => {
        const el = document.querySelector(id.startsWith('#') ? id : `#${id}`)
        if (el) highlightElement(el)
    }

    if (localStore.value.darkMode === 'dark') {
        document.documentElement.classList.add('dark')
    }

    watchEffect(() =>
        localStore.value.darkMode === 'dark'
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

    emitter.on('show-bottom-sheet', ({ isNew, showUnsaved, padded, title, component, props }) => {
        modal.isNew = isNew
        modal.showUnsaved = showUnsaved
        modal.padded = padded
        modal.title = title
        modal.component = component
        modal.props = props

        modal.show = true
    })

    emitter.on('close-bottom-sheet', () => {
        modal.show = false
        modal.isNew = false
        modal.padded = true
        modal.title = ''
        modal.component = ''
        modal.showUnsaved = true
        modal.props = {}

        modal.show = false
    })

    emitter.on('error-route', ({ code, path }) => {
        error.code = code
        error.path = path ?? currentRoute.path
    })

    emitter.on('logout', () => {
        $axios.get('auth/logout').then(() => {
            localStore.value.me = {}
            apolloClient.cache.reset()

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
            (currentRoute.path !== error.path ||
                (error.code === errorCodes.UNAUTHORIZED && localStore.value.loggedIn))
        ) {
            error.code = null
            error.path = null
        }
    })
    const { onResult, onError, refetch } = useQuery(getMe)
    if (localStore.value.loggedIn) {
        onResult(({ data }) => {
            if (data.me) {
                localStore.value.me = data.me
            } else {
                showErrorToast("[Erreur] Vos informations utilisateur n'ont pas pu être récupérées.")
            }
        })
        onError(showToastGraphQLError)
    }

    emitter.on('refetch-me', () => {
        onResult(({ data }) => {
            if (data.me) {
                localStore.value.me = data.me
            } else {
                showErrorToast("[Erreur] Vos informations utilisateur n'ont pas pu être récupérées.")
            }
        })
        onError(showToastGraphQLError)
        refetch()
    })

    nextTick(() => !isEmpty(localStore.value.me) && logOutOnExpire())
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
