<template>
    <div
        class="bg-2 app-scrollbar relative cursor-pointer select-none overflow-auto rounded-xl shadow-md"
        @mousedown="startClick($event)"
        @mousemove="disableClickOnDrag($event)"
        @click="enableClick"
    >
        <!-- <ProfileBanner
            class="h-40 w-full rounded-t-lg"
            :banner="club.banner"
            :name="club.name"
            :data="club.category"
        /> -->
        <div v-if="!showProfile" class="absolute top-7 left-5 z-20 rounded-full p-1">
            <ProfileAvatar :rounded-full="true" :avatar="club.avatar" :size="6" :name="club.name" />
        </div>
        <div
            v-if="!showProfile && club.userInterest"
            class="absolute top-7 right-5 z-20 rounded-lg border-[0.4rem] p-2 text-3xl font-bold"
            :class="INTEREST_STATES[club.userInterest.state].class"
        >
            {{ INTEREST_STATES[club.userInterest.state].name }}
        </div>
        <Swiper
            pagination
            mousewheel
            :modules="modules"
            :loop="true"
            :allow-touch-move="false"
            class="z-0 h-full w-full grow rounded-t-xl"
            :class="{ 'max-h-[50vh]': showProfile }"
            @swiper="(s) => (swiper = s)"
        >
            <div
                class="previous-button-invisible z-10"
                @click="
                    () => {
                        if (clickEnabled) swiper.slidePrev()
                    }
                "
            />
            <div
                class="next-button-invisible z-10"
                @click="
                    () => {
                        if (clickEnabled) swiper.slideNext()
                    }
                "
            />
            <SwiperSlide
                v-for="gallery in [...club.mainGalleries].sort((a, b) => {
                    if (a.order > b.order) {
                        return 1
                    } else if (a.order < b.order) {
                        return -1
                    }
                    return 0
                })"
                :key="gallery.id"
                class="relative text-white"
            >
                <img :src="gallery.file.url" class="absolute inset-0 z-0 h-full w-full blur-[20px]" />
                <img
                    :src="gallery.file.url"
                    class="fade-top z-10 h-fit w-full"
                    :class="{ 'pb-24': !showProfile }"
                />
            </SwiperSlide>
        </Swiper>
        <!-- <div class="mx-3 flex h-full flex-col items-center md:mx-5">
            <div class="bg-2 z-10 -mt-20 rounded-full p-1">
                <ProfileAvatar :rounded-full="true" :avatar="club.avatar" :size="9" :name="club.name" />
            </div>

            <div class="flex h-full w-full flex-col items-center justify-between">
                <router-link
                    class="text-1 mt-2 text-3xl font-bold line-clamp-1"
                    :class="showLink && clickable ? 'card-link' : 'pointer-events-none'"
                    :to="`/club/${club.id}`"
                >
                    {{ club.name }}
                </router-link>

                <div class="text-1 my-auto h-fit px-4 text-center text-lg">
                    {{ club.category }}
                </div>
            </div>
        </div> -->

        <Transition name="from-bottom">
            <div
                v-if="showProfile"
                class="relative z-20 flex cursor-default select-text flex-col gap-5 rounded-b-xl bg-white px-6 pt-8 pb-20 text-black"
            >
                <div
                    class="absolute right-6 -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-red-400 shadow-lg transition-transform hover:scale-125"
                    @click="
                        () => {
                            emit('close-profile')
                            showProfile = false
                        }
                    "
                >
                    <i class="fa fa-arrow-turn-down text-2xl text-white" />
                </div>
                <div
                    class="flex flex-wrap items-center gap-4 text-4xl font-semibold drop-shadow-xl md:text-5xl"
                >
                    {{ club.name }}
                    <div
                        v-if="club.userInterest"
                        class="rounded-lg border-[0.4rem] p-1.5 text-xl font-bold"
                        :class="INTEREST_STATES[club.userInterest.state].class"
                    >
                        {{ INTEREST_STATES[club.userInterest.state].name }}
                    </div>
                </div>
                <div class="flex gap-1 text-lg">
                    {{ club.shortDescription }}
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex gap-1">
                        <div class="w-6">🧭</div>
                        {{ club.location ? club.location : 'Absent pour la journée des associations' }}
                    </div>
                    <div class="flex gap-1">
                        <div class="w-6">🔗</div>
                        {{ club.status }}
                    </div>
                </div>
                <div class="mt-2 flex flex-col gap-2">
                    <div class="text-lg font-medium">Activité</div>
                    <div class="flex flex-wrap gap-2">
                        <div
                            v-for="(label, i) in labels.filter((label) => label.type === 'Descriptor')"
                            :key="i"
                            :class="labelClass[label.type]"
                        >
                            {{ label.name }}
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="text-lg font-medium">Tags</div>
                    <div class="flex flex-wrap gap-2">
                        <div
                            v-for="(label, i) in labels.filter((label) => label.type === 'Meta')"
                            :key="i"
                            :class="labelClass[label.type]"
                        >
                            {{ label.name }}
                        </div>
                    </div>
                </div>
                <div>
                    <div class="mb-2 text-lg font-medium">Réseaux</div>
                    <div class="flex flex-col gap-1">
                        <a
                            v-for="social in club.socials"
                            :key="social.id"
                            :href="social.link"
                            target="_blank"
                            class="flex w-fit items-center gap-2"
                        >
                            <i
                                :class="[
                                    SOCIAL_TYPES[social.socialType].icon,
                                    ['Discord', 'YouTube'].includes(social.socialType)
                                        ? 'text-2xl'
                                        : 'text-3xl',
                                ]"
                                :style="SOCIAL_TYPES[social.socialType].style"
                                class="flex h-8 w-8 items-center justify-center"
                            />
                            <div class="link-blue">{{ social.pseudo }}</div>
                        </a>
                    </div>
                </div>
                <MdRenderer :content="club.longDescription" />
            </div>
        </Transition>
        <div
            v-if="!showProfile"
            class="swipeable-bottom-bg absolute bottom-0 z-10 flex w-full flex-col rounded-b-xl p-10 pb-44 text-white"
            @click="
                () => {
                    if (clickEnabled) {
                        emit('show-profile')
                        showProfile = true
                    }
                }
            "
        >
            <div class="text-4xl font-bold drop-shadow-xl md:text-5xl">
                {{ club.name }}
            </div>
            <div v-if="club.location">🧭 {{ club.location }}</div>
            <div class="mt-4 flex flex-wrap gap-2">
                <div
                    v-for="(label, i) in labels.filter((label) =>
                        ['Category', 'Descriptor'].includes(label.type),
                    )"
                    :key="i"
                    :class="labelClass[label.type]"
                >
                    {{ label.name }}
                </div>
            </div>
            <div class="absolute right-6 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                <i class="fa fa-info text-black" />
            </div>
        </div>
    </div>
</template>

<script setup>
    // import { getURL } from '@/utils/routeUtils'

    // import { useRouter } from 'vue-router'

    // import { useI18n } from 'vue-i18n'
    import MdRenderer from '@/components/Input/Editor/MdRenderer.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import { Swiper, SwiperSlide } from 'swiper/vue'
    import { Mousewheel, Pagination } from 'swiper'

    import { computed, ref } from 'vue'

    import { SOCIAL_TYPES } from '@/shared/types/social-types.enum'
    import { INTEREST_STATES } from '@/shared/types/interest-states.enum'
    // const { locale } = useI18n({ useScope: 'global' })
    // const router = useRouter()

    const labelClass = {
        'Category': 'tag-category',
        'Descriptor': 'tag-descriptor',
        'Meta': 'tag-meta',
    }
    const showProfile = ref(false)

    // onDone(() => showSuccessToast())

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
        clickable: {
            type: Boolean,
            default: true,
        },
    })

    const emit = defineEmits(['show-profile', 'close-profile'])

    const labels = computed(() =>
        [...props.club.labels].sort((l) => (l.type === 'Category' ? -1 : l.type === 'Descriptor' ? 0 : 1)),
    )

    const swiper = ref(null)
    const modules = [Pagination, Mousewheel]

    const clickEnabled = ref(true)
    const clicking = ref(false)

    const startClickPos = ref(null)

    const enableClick = () => {
        clicking.value = false
        clickEnabled.value = true
    }

    const startClick = (event) => {
        startClickPos.value = { x: event.pageX, y: event.pageY }
        clicking.value = true
    }

    const disableClickOnDrag = (event) => {
        if (clicking.value) {
            const diffX = Math.abs(event.pageX - startClickPos.value.x)
            const diffY = Math.abs(event.pageY - startClickPos.value.y)

            if (diffX > 4 || diffY > 4) {
                clickEnabled.value = false
            }
        }
    }
</script>

<style lang="scss">
    .avatar-hover {
        & * {
            transition: margin-top 0.2s ease-in-out;
        }

        &:hover .hovered {
            transition: margin-top 0.2s ease-in-out 200ms;
            @apply -mt-1;
        }
    }

    .swipeable-bottom-bg {
        background: linear-gradient(rgb(0 0 0 / 0%), rgb(0 0 0 / 30%) 10%, rgb(0 0 0 / 100%) 50%);
    }

    .swiper-slide {
        /* Center slide text vertically */
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .swiper-pagination {
        position: absolute;
        top: 10px;
        bottom: unset !important;
        display: flex;
        flex-direction: row;
        padding: 0 5px;
    }

    .swiper-pagination-bullet {
        display: flex;
        flex-grow: 1;
        height: 2px;
        margin: 0 5px;
        background: #eee;
        background-repeat: no-repeat;
        background-position: 100% 50%;
        background-size: 200%;
        border-radius: 4px;
        animation-timing-function: linear;
        animation-delay: 0.2s;
    }

    .swiper-pagination-bullet-active {
        animation-name: loader;
        animation-duration: 5s;
    }

    .previous-button-invisible {
        position: absolute;
        top: 20px;
        left: 0 !important;
        width: 50%;
        height: 100%;
    }

    .swiper-wrapper {
        align-items: center; /* add this will all relevant prefixes */
    }

    .next-button-invisible {
        position: absolute;
        top: 20px;
        right: 0 !important;
        width: 50%;
        height: 100%;
    }

    .progress.passed {
        background-position: 0 0;
    }

    @keyframes loader {
        0% {
            background-position: 100% 0;
        }

        100% {
            background-position: 0 0;
        }
    }

    .tag-category {
        @apply rounded-full px-3 py-1 bg-red-600 font-medium text-white text-sm;
    }

    .tag-descriptor {
        @apply rounded-full px-3 py-1 bg-indigo-500 font-medium text-white text-sm;
    }

    .tag-meta {
        @apply rounded-full px-3 py-1 bg-transparent border border-gray-500 text-gray-600 text-sm;
    }

    .fade-top {
        box-shadow: inset 0 0 10px 10px;

        // background-image: linear-gradient(to top, rgb(255 255 255 / 0%), rgb(255 255 255 / 100%) 90%);
    }
</style>
