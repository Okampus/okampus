<template>
    <div class="centered-container flex flex-col gap-12 lg:flex-row">
        <div class="flex flex-col gap-6">
            <div class="card-2 flex flex-col p-10 sm:gap-6">
                <div class="flex gap-4 md:gap-10">
                    <div class="flex flex-col gap-6 md:gap-8">
                        <div class="title-font text-2xl font-bold md:text-3xl">
                            Demandez, signalez, partagez vos idées&nbsp;!
                        </div>
                        <div class="text-2 hidden text-justify text-sm sm:block md:text-base">
                            Posez vos questions, répondez à celles des autres, signalez des problèmes et
                            demandez à ce que les votres soient résolus... et proposer des idées pour l'école,
                            la vie associative ou Okampus !
                        </div>
                    </div>
                    <img class="-mt-2 h-24 w-24 sm:h-48 sm:w-48" :src="ChatBubble" />
                </div>
                <div class="flex gap-4">
                    <router-link
                        to="/forum/post/new"
                        role="button"
                        class="button-blue flex items-center gap-3 sm-max:py-1"
                    >
                        <i class="fas fa-plus text-base sm:text-lg" />
                        <div class="text-lg sm:text-base">Question</div>
                    </router-link>
                    <router-link
                        to="/forum/post/new"
                        role="button"
                        class="button-green flex items-center gap-3 sm-max:py-1"
                    >
                        <i class="fas fa-plus text-base sm:text-lg" />
                        <div class="text-lg sm:text-base">Problème</div>
                    </router-link>
                    <router-link
                        to="/forum/post/new"
                        role="button"
                        class="button-yellow flex items-center gap-3 sm-max:py-1"
                    >
                        <i class="fas fa-plus text-base sm:text-lg" />
                        <div class="text-lg sm:text-base">Idée</div>
                    </router-link>
                </div>
            </div>

            <div class="flex flex-col gap-6 px-4 lg:hidden">
                <AppTitle title="Membres du staff" icon="fas fa-people-group" />
                <div class="mx-5 flex items-start gap-5">
                    <SwiperButton class="mt-2" type="prev" :swiper="swiperStaff" :small="true" />
                    <Swiper
                        :slides-per-view="1"
                        :slides-centered="true"
                        :loop="true"
                        class="items-start"
                        @swiper="(swiper) => (swiperStaff = swiper)"
                    >
                        <SwiperSlide v-for="(staff, i) in staffMembers" :key="i">
                            <UserActivity :user="staff">
                                <template #subtitle>
                                    {{ staff.title }}
                                </template>
                            </UserActivity>
                        </SwiperSlide>
                    </Swiper>
                    <SwiperButton class="mt-2" type="next" :swiper="swiperStaff" :small="true" />
                </div>
            </div>

            <div class="flex flex-col gap-6 px-4 lg:hidden">
                <AppTitle title="Tags récents" icon="fas fa-tags" />
                <GraphQLQuery
                    :query="getTags"
                    :update="(data) => data?.tags"
                    :loader-size="1"
                    :whole-page="false"
                >
                    <template #default="{ data: tags }">
                        <div class="mx-5 flex items-center">
                            <SwiperButton type="prev" :swiper="swiperTags" :small="true" />
                            <Swiper
                                slides-per-view="auto"
                                :space-between="10"
                                class="items-start"
                                @swiper="(swiper) => (swiperTags = swiper)"
                            >
                                <SwiperSlide v-for="(tag, i) in tags" :key="i" class="max-w-fit">
                                    <LabelTag :key="i" class="inline text-xs" :tag-name="tag.name" />
                                </SwiperSlide>
                            </Swiper>
                            <SwiperButton type="next" :swiper="swiperTags" :small="true" />
                        </div>
                    </template>
                </GraphQLQuery>
            </div>

            <div class="flex flex-col gap-6">
                <AppTitle title="Espaces du forum" icon="fas fa-comments" class="text-1 mt-2 px-4" />
                <div class="flex flex-col gap-4">
                    <router-link
                        v-for="(tab, i) in forumTabs"
                        :key="i"
                        to="/forum/posts"
                        class="card-2 card-hover"
                    >
                        <div class="flex items-center gap-4">
                            <div
                                class="flex h-[3.3rem] w-[3.3rem] shrink-0 cursor-pointer items-center justify-center rounded-lg"
                                :class="tab.color"
                            >
                                <i :class="tab.icon" class="text-xl text-white" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <div class="text-lg font-semibold">
                                    {{ tab.title }}
                                </div>
                                <div class="text-2 text-sm">{{ tab.description }}</div>
                            </div>
                        </div>
                    </router-link>
                </div>

                <div class="flex flex-col gap-6">
                    <AppTitle title="Posts récents" icon="fa fa-signs-post" class="text-1 pl-4" />
                    <ThreadList :container="false" />
                </div>
            </div>
        </div>

        <div class="flex shrink-0 flex-col gap-6 lg:w-[24rem]">
            <div class="hidden flex-col gap-6 lg:flex">
                <AppTitle title="Membres du staff" icon=" fa fa-people-group" class="text-1 pl-4" />
                <div class="flex flex-col gap-4">
                    <UserActivity v-for="(staff, i) in staffMembers" :key="i" :user="staff">
                        <template #subtitle>
                            {{ staff.title }}
                        </template>
                    </UserActivity>
                </div>
            </div>

            <div class="hidden flex-col gap-6 lg:flex">
                <AppTitle title="Tags récents" icon="fas fa-tags" class="pl-4" />
                <GraphQLQuery
                    :query="getTags"
                    :update="(data) => data?.tags"
                    :loader-size="1"
                    :whole-page="false"
                >
                    <template #default="{ data: tags }">
                        <div class="flex flex-wrap gap-3">
                            <LabelTag
                                v-for="(tag, i) in tags"
                                :key="i"
                                class="inline text-xs"
                                :tag-name="tag.name"
                            />
                        </div>
                    </template>
                </GraphQLQuery>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ChatBubble from '@/assets/img/3dicons/chat-bubble.png'

    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import AppTitle from '@/components/App/AppTitle.vue'
    import LabelTag from '@/components/UI/Label/LabelTag.vue'
    import UserActivity from '@/components/App/General/UserActivity.vue'
    import SwiperButton from '@/components/App/Swiper/SwiperButton.vue'
    import ThreadList from '@/views/List/ThreadList.vue'

    import { Swiper, SwiperSlide } from 'swiper/vue'

    import anne from '@/assets/img/staff/anne.jpeg'
    import christophe from '@/assets/img/staff/christophe.jpeg'
    import rene from '@/assets/img/staff/rene.jpeg'

    import { ref } from 'vue'

    import { getTags } from '@/graphql/queries/threads/getTags'
    import { ADMIN } from '@/shared/types/school-roles.enum.js'

    const forumTabs = [
        {
            color: 'bg-[#1b73d5]',
            icon: 'fas fa-question',
            title: 'Questions / Réponses',
            description: "Espace de forum 'classique' - posez vos questions, obtenez une réponse.",
        },
        {
            color: 'bg-[#0ca74c]',
            icon: 'fas fa-bullhorn',
            title: 'Signalements & Ticketing',
            description:
                'Suivi des problèmes remontés via un système de ticketing - signalez, résolvez des problèmes.',
        },
        {
            color: 'bg-[#d6a726]',
            icon: 'fas fa-lightbulb',
            title: 'Boîte à idées',
            description: 'Proposez des idées pour votre école et réagissez à celles de vos collègues !',
        },
    ]

    const staffMembers = [
        {
            firstname: 'Anne',
            lastname: 'EDVIRE',
            schoolRole: ADMIN,
            avatar: anne,
            title: "Directrice de l'expérience étudiante",
        },
        {
            firstname: 'Christophe',
            lastname: 'MAIRET',
            schoolRole: ADMIN,
            avatar: christophe,
            title: 'Directeur des opérations',
        },
        {
            firstname: 'René',
            lastname: 'BANCAREL',
            schoolRole: ADMIN,
            avatar: rene,
            title: 'Directeur des études du cycle M',
        },
        {
            firstname: 'Okampus',
            lastname: 'Admin',
            schoolRole: ADMIN,
            title: "Responsable d'Okampus",
        },
    ]

    const swiperTags = ref(null)
    const swiperStaff = ref(null)
</script>
