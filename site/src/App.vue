<template>
    <FormLogin :show-login="showLogin" @toggle-login="toggleLogin" />

    <div class="flex flex-row w-screen h-screen z-1" :class="{ 'brightness-50': showModal }">
        <SideBar
            ref="sidebar"
            :uncollapsed="uncollapsedSidebar"
            :collapsing="collapsingSidebar"
            :small-screen="smallScreen"
            @toggle-side-bar="toggleSidebar"
        />

        <div
            ref="content"
            :class="{ 'brightness-50': dimPage }"
            class="flex overflow-auto relative flex-col w-full bg-2 h-content after-topbar app-scrollbar"
        >
            <div class="flex-auto shrink-0 grow-1">
                <router-view />
            </div>
            <FooterBar class="shrink-0" />
        </div>

        <TopBar
            ref="topbar"
            class="flex fixed top-0 left-0 justify-between items-center w-full border-b h-tbar border-bar text-1 bg-1"
            :show-login="showLogin"
            :class="{ 'brightness-50': dimPage }"
            @toggle-login="toggleLogin"
            @toggle-side-bar="toggleSidebar"
        />
    </div>
</template>

<script>
    import FooterBar from '@/components/Bar/FooterBar.vue'
    import SideBar from '@/components/Bar/SideBar.vue'
    import TopBar from '@/components/Bar/TopBar.vue'
    import FormLogin from '@/components/Form/FormLogin.vue'
    import User from '@/models/user'
    import debounce from 'lodash/debounce'
    import { ref, watch } from 'vue'

    const breakWidth = 1024
    const uncollapseWidth = 1536
    export default {
        components: {
            TopBar,
            SideBar,
            FooterBar,
            FormLogin,
        },
        setup() {
            const showLogin = ref(false)
            const showModal = ref(false)

            const sidebar = ref(null)
            const topbar = ref(null)
            const content = ref(null)
            return {
                sidebar,
                topbar,
                content,
                showLogin,
                showModal,
                toggleModal() {
                    showModal.value = !showModal.value
                    showLogin.value = showModal.value
                },
                toggleLogin() {
                    showLogin.value = !showLogin.value
                    showModal.value = showLogin.value
                },
            }
        },
        data() {
            const isScreenSmallerThan = (width) =>
                Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) <= width

            const checkResize = debounce(() => {
                const isScreenSmall = isScreenSmallerThan(breakWidth)
                const isScreenSmallerThanUncollapse = isScreenSmallerThan(uncollapseWidth)

                if (!isScreenSmall && !this.smallScreen) {
                    // If the screen is bigger than the smallScreen breakpoint
                    if (this.smallerThanUncollapse != isScreenSmallerThanUncollapse) {
                        // If the screen is smaller than the uncollapse breakpoint
                        this.smallerThanUncollapse = isScreenSmallerThanUncollapse
                        this.uncollapsedSidebar = !isScreenSmallerThanUncollapse
                    }
                } else if (this.smallScreen != isScreenSmall) {
                    // If the screen is smaller than the smallScreen breakpoint
                    this.smallScreen = isScreenSmall
                    if (!isScreenSmall && this.uncollapsedSidebar) {
                        // If the sidebar was uncollapsed in smallScreen mode and the screen got larger
                        this.topbar.$el.removeEventListener('mousedown', this.toggleSidebar)
                        this.content.removeEventListener('mousedown', this.toggleSidebar)
                    } else {
                        this.uncollapsedSidebar = false
                    }
                }
            }, 50)

            return {
                checkResize,
                user: new User('', '', ''),
                smallScreen: isScreenSmallerThan(breakWidth),
                smallerThanUncollapse: isScreenSmallerThan(uncollapseWidth),
                uncollapsedSidebar: !isScreenSmallerThan(uncollapseWidth),
                collapsingSidebar: false,
            }
        },
        computed: {
            dimPage() {
                return (
                    this.smallScreen &&
                    ((this.uncollapsedSidebar && !this.collapsingSidebar) ||
                        (!this.uncollapsedSidebar && this.collapsingSidebar))
                )
            },
        },
        created() {
            document.querySelector(':root').className = this.$store.state.user.theme
            const cookie = this.$cookies.get('accessTokenExpiresAt')
            if (cookie && cookie < Date.now()) {
                this.$emitter.emit('logout')
            }
        },
        mounted() {
            watch(
                () => this.$store.getters['user/getTheme'],
                (theme) => {
                    document.querySelector(':root').className = theme
                },
            )

            this.$emitter.on('login', () => {
                this.toggleLogin()
            })

            this.$emitter.on('logout', () => {
                this.$store.dispatch('auth/logout')
                this.$cookies.remove('accessTokenExpiresAt')
                this.$cookies.remove('refreshTokenExpiresAt')
            })

            this.$emitter.on('toggle-modal', () => {
                this.toggleModal()
            })

            window.addEventListener('resize', this.checkResize)
        },
        unmounted() {
            window.removeEventListener('resize', this.checkResize)
        },
        methods: {
            login() {
                this.toggleLogin()
            },
            toggleSidebar() {
                if (this.smallScreen) {
                    this.collapsingSidebar = true
                    if (this.uncollapsedSidebar) {
                        this.topbar.$el.removeEventListener('mousedown', this.toggleSidebar)
                        this.content.removeEventListener('mousedown', this.toggleSidebar)
                    } else {
                        this.topbar.$el.addEventListener('mousedown', this.toggleSidebar)
                        this.content.addEventListener('mousedown', this.toggleSidebar)
                    }

                    this.sidebar.$el.addEventListener(
                        'transitionend',
                        () => {
                            this.collapsingSidebar = false
                            this.uncollapsedSidebar = !this.uncollapsedSidebar
                        },
                        { once: true },
                    )
                } else {
                    this.uncollapsedSidebar = !this.uncollapsedSidebar
                }
            },
        },
    }
</script>

<style lang="scss">
    @import '@/assets/scss/app';
    @import '@/assets/scss/animations/bg-anims';
    @import '@/assets/scss/components/button';
    @import '@/assets/scss/components/card';
    @import '@/assets/scss/components/input';
    @import '@/assets/scss/components/link';
    @import '@/assets/scss/components/select';
    @import '@/assets/scss/components/tiptap';
    @import '@/assets/scss/sections/hero';
    @import '@/assets/scss/sections/label';
    @import '@/assets/scss/sections/transition';
    @import '@/assets/scss/core/scrollbar';
    @import '@/assets/scss/core/spacing';
    @import '@/assets/scss/core/tab';

    @font-face {
        font-family: AtkinsonHyperlegible;
        font-weight: 400;
        src: url('@/assets/font/AtkinsonHyperlegible/AtkinsonHyperlegible-Regular.ttf') format('truetype');
    }

    @font-face {
        font-family: AtkinsonHyperlegible;
        font-style: italic;
        font-weight: 400;
        src: url('@/assets/font/AtkinsonHyperlegible/AtkinsonHyperlegible-Italic.ttf') format('truetype');
    }

    @font-face {
        font-family: AtkinsonHyperlegible;
        font-weight: 700;
        src: url('@/assets/font/AtkinsonHyperlegible/AtkinsonHyperlegible-Bold.ttf') format('truetype');
    }

    @font-face {
        font-family: AtkinsonHyperlegible;
        font-style: italic;
        font-weight: 700;
        src: url('@/assets/font/AtkinsonHyperlegible/AtkinsonHyperlegible-BoldItalic.ttf') format('truetype');
    }

    * {
        font-family: AtkinsonHyperlegible, sans-serif;
    }

    // TODO: Adapt font size to screen size (for small screen sizes)
    html {
        font-size: 12px;
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
