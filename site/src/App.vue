<template>
    <!-- TODO: Solve mysterious min-width ??? -->
    <UserLogin
        :show-login="showLogin"
        @toggle-login="toggleLogin"
    />


    <div
        class="flex flex-row filter h-screen w-screen z-1"
        :class="{'brightness-50': showModal}"
    >
        <side-bar
            ref="sidebar"
            :collapsed="closedSidebar && !uncollapsedSidebar"
            :uncollapsed="uncollapsedSidebar"
            :collapsing="collapsingSidebar"
            @close-side-bar="toggleSidebar"
        />
        <div
            ref="content"
            :class="{'brightness-50': uncollapsedSidebar && !collapsingSidebar}"
            class="w-full bg-2 h-content flex flex-col relative after-topbar overflow-auto app-scrollbar filter"
        >
            <div
                class="flex-grow-1 flex-shrink-0 flex-auto"
            >
                <router-view />
            </div>
            <page-footer class="flex-shrink-0" />
        </div>
        <top-bar
            ref="topbar"
            class="flex fixed top-0 left-0 w-full h-tbar border-bar
      text-1 items-center justify-between border-b bg-1 filter"
            :show-login="showLogin"
            :class="{'brightness-50': uncollapsedSidebar && !collapsingSidebar}"
            @toggle-login="toggleLogin"
            @toggle-side-bar="toggleSidebar"
        />
    </div>
</template>

<script lang="js">
import debounce from 'lodash/debounce'
import PageFooter from '@/components/PageFooter.vue'

import { ref, watch } from 'vue'

import TopBar from '@/components/TopBar.vue'
import SideBar from '@/components/SideBar.vue'
import User from '@/models/user'
import UserLogin from '@/components/UserLogin.vue'

const breakWidth = 768
export default {
    components: {
        TopBar,
        SideBar,
        PageFooter,
        UserLogin
    },
    setup () {
        const showLogin = ref(false)
        const showModal = ref(false)

        const sidebar = ref(null)
        const topbar = ref(null)
        const content = ref(null)
        return { sidebar, topbar, content, showLogin, showModal,
            toggleModal () {
                showModal.value = !showModal.value
                showLogin.value = showModal.value
            },
            toggleLogin () {
                showLogin.value = !showLogin.value
                showModal.value = showLogin.value
            }
        }
    },
    data () {
        const isScreenSmall = () => Math.max(
            document.documentElement.clientWidth ||
        0, window.innerWidth || 0) <= breakWidth

        const checkResize = debounce(() => {
            if (!this.isScreenSmall() && this.smallScreen) {
                this.smallScreen = false

                if (this.uncollapsedSidebar) {
                    this.uncollapsedSidebar = false
                    this.topbar.$el.removeEventListener('mousedown', this.toggleSidebar)
                    this.content.removeEventListener('mousedown', this.toggleSidebar)
                }
                if (this.closedSidebar) {
                    this.closedSidebar = false
                }
            } else if (this.isScreenSmall() && !this.smallScreen) {
                this.smallScreen = true
                if (!this.closedSidebar) {
                    this.closedSidebar = true
                }
            }
        }, 50)

        return {
            checkResize,
            user: new User('', '', ''),
            isScreenSmall,
            closedSidebar: isScreenSmall(),
            smallScreen: isScreenSmall(),
            uncollapsedSidebar: false,
            collapsingSidebar: false,
        }
    },
    created () {
        document.querySelector(':root').className = this.$store.state.userConfig.theme
    },
    mounted () {
        watch(() => this.$store.getters['userConfig/getTheme'], (theme) => {
            document.querySelector(':root').className = theme
        })

        this.emitter.on('login', () => {
            this.toggleLogin()
        })

        this.emitter.on('toggle-modal', () => {
            this.toggleModal()
        })

        window.addEventListener('resize', this.checkResize)
    },
    unmounted () {
        window.removeEventListener('resize', this.checkResize)
    },
    methods: {
        login() {
            this.toggleLogin()
        },
        toggleSidebar () {
            if (this.smallScreen) {
                if (this.uncollapsedSidebar) {
                    this.topbar.$el.removeEventListener('mousedown', this.toggleSidebar)
                    this.content.removeEventListener('mousedown', this.toggleSidebar)
                    this.collapsingSidebar = true
                    this.sidebar.$el.addEventListener('transitionend', () => {
                        this.uncollapsedSidebar = false
                        this.collapsingSidebar = false
                    }, { once: true })
                } else {
                    this.uncollapsedSidebar = true
                    this.topbar.$el.addEventListener('mousedown', this.toggleSidebar)
                    this.content.addEventListener('mousedown', this.toggleSidebar)
                }
            } else {
                this.closedSidebar = !this.closedSidebar
            }
        }
    }
}
</script>

<style lang="scss">

@import "@/assets/scss/app.scss";
@import "@/assets/scss/components/button.scss";
@import "@/assets/scss/components/card.scss";
@import "@/assets/scss/components/input.scss";
@import "@/assets/scss/components/link.scss";
@import "@/assets/scss/components/select.scss";
@import "@/assets/scss/components/tiptap.scss";
@import "@/assets/scss/sections/hero.scss";
@import "@/assets/scss/sections/label.scss";
@import "@/assets/scss/core/scrollbar.scss";
@import "@/assets/scss/core/spacing.scss";
@import "@/assets/scss/core/tab.scss";

@font-face {
    font-family: AtkinsonHyperlegible;
    font-weight: 400;
    src: url("@/assets/font/AtkinsonHyperlegible/AtkinsonHyperlegible-Regular.ttf") format("truetype");
}

@font-face {
    font-family: AtkinsonHyperlegible;
    font-weight: 400;
    font-style: italic;
    src: url("@/assets/font/AtkinsonHyperlegible/AtkinsonHyperlegible-Italic.ttf") format("truetype");
}

@font-face {
    font-family: AtkinsonHyperlegible;
    font-weight: 700;
    src: url("@/assets/font/AtkinsonHyperlegible/AtkinsonHyperlegible-Bold.ttf") format("truetype");
}

@font-face {
    font-family: AtkinsonHyperlegible;
    font-weight: 700;
    font-style: italic;
    src: url("@/assets/font/AtkinsonHyperlegible/AtkinsonHyperlegible-BoldItalic.ttf") format("truetype");
}

* {
    font-family: AtkinsonHyperlegible;
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
</style>
