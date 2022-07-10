<template>
    <div class="flex flex-col gap-12 lg:flex-row centered-container">
        <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-6 p-10 card-2">
                <div class="flex gap-4 md:gap-10">
                    <div class="flex flex-col gap-6 md:gap-8">
                        <div class="text-2xl font-bold md:text-3xl title-font">
                            Demandez, signalez, partagez vos idées 🚀
                        </div>
                        <div class="hidden text-sm text-justify xs:block md:text-base text-2">
                            Posez vos questions, répondez à celles des autres, signalez des problèmes et
                            demandez à ce que les votres soient résolus... et proposer des idées pour l'école,
                            la vie associative ou Okampus !
                        </div>
                    </div>
                    <img class="-mt-2 w-32 h-32 sm:w-48 sm:h-48" :src="ChatBubble" />
                </div>
                <div class="flex gap-4">
                    <router-link
                        to="/forum/post/new"
                        role="button"
                        class="flex gap-3 items-center button-blue"
                    >
                        <i class="text-base xs:text-xl fas fa-plus" />
                        <div class="text-xs xs:text-base">Question</div>
                    </router-link>
                    <router-link
                        to="/forum/post/new"
                        role="button"
                        class="flex gap-3 items-center button-green"
                    >
                        <i class="text-base xs:text-xl fas fa-plus" />
                        <div class="text-xs xs:text-base">Problème</div>
                    </router-link>
                    <router-link
                        to="/forum/post/new"
                        role="button"
                        class="flex gap-3 items-center button-yellow"
                    >
                        <i class="text-base xs:text-xl fas fa-plus" />
                        <div class="text-xs xs:text-base">Idée</div>
                    </router-link>
                </div>
            </div>

            <div class="flex flex-col gap-6 px-4 lg:hidden">
                <AppTitle title="Membres du staff" icon="fas fa-people-group" />
                <Swiper slides-per-view="auto" :space-between="20">
                    <SwiperSlide v-for="(staff, i) in staffMembers" :key="i" class="max-w-[15rem]">
                        <UserActivity :user="staff" :custom-string="staff.title" />
                    </SwiperSlide>
                </Swiper>
            </div>

            <div class="flex flex-col gap-6">
                <AppTitle title="Espaces du forum" icon="fas fa-comments" class="px-4 mt-2" />
                <div class="flex flex-col gap-4">
                    <router-link
                        v-for="(tab, i) in forumTabs"
                        :key="i"
                        to="/forum/posts"
                        class="card-2 card-hover"
                    >
                        <div class="flex gap-4 items-center">
                            <div
                                class="flex shrink-0 justify-center items-center w-[3.3rem] h-[3.3rem] rounded-lg cursor-pointer"
                                :class="tab.color"
                            >
                                <i :class="tab.icon" class="text-xl text-white" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <div class="text-lg font-semibold">
                                    {{ tab.title }}
                                </div>
                                <div class="text-sm text-2">{{ tab.description }}</div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>

        <div class="flex flex-col shrink-0 gap-6 lg:w-[24rem]">
            <div class="hidden flex-col gap-6 lg:flex">
                <AppTitle title="Membres du staff" icon="fas fa-people-group" class="pl-4" />
                <div class="flex flex-col gap-4">
                    <UserActivity
                        v-for="(staff, i) in staffMembers"
                        :key="i"
                        :user="staff"
                        :custom-string="staff.title"
                    />
                </div>
            </div>
            <div class="flex flex-col gap-6">
                <AppTitle title="Post récents" icon="fas fa-signs-post" class="pl-4" />
                <RecentThreadList />
            </div>
        </div>
    </div>
</template>

<script setup>
    import ChatBubble from '@/assets/img/3dicons/chat-bubble.png'
    import AppTitle from '@/components/App/AppTitle.vue'
    import UserActivity from '@/components/App/General/UserActivity.vue'
    import RecentThreadList from '@/components/List/RecentThreadList.vue'

    import { Swiper, SwiperSlide } from 'swiper/vue'

    import anne from '@/assets/img/staff/anne.jpeg'
    import christophe from '@/assets/img/staff/christophe.jpeg'
    import rene from '@/assets/img/staff/rene.jpeg'

    const forumTabs = [
        {
            color: 'bg-[#1b73d5]',
            icon: 'fas fa-question',
            title: 'Questions / Réponses',
            description: "Espace de forum 'classique' - posez vos questions, obtenez une réponse.",
        },
        {
            color: 'bg-[#0ecc54]',
            icon: 'fas fa-bullhorn',
            title: 'Signalements & Ticketing',
            description:
                'Suivi des problèmes remontés via un système de ticketing - signalez, résolvez des problèmes.',
        },
        {
            color: 'bg-[#e7b734]',
            icon: 'fas fa-lightbulb',
            title: 'Boîte à idées',
            description: 'Proposez des idées pour votre école et réagissez à celles de vos collègues !',
        },
    ]

    const staffMembers = [
        {
            firstname: 'Anne',
            lastname: 'EDVIRE',
            schoolRole: 'admin',
            avatar: anne,
            title: "Directrice de l'expérience étudiante",
        },
        {
            firstname: 'Christophe',
            lastname: 'MAIRET',
            schoolRole: 'admin',
            avatar: christophe,
            title: 'Directeur des opérations',
        },
        {
            firstname: 'René',
            lastname: 'BANCAREL',
            schoolRole: 'admin',
            avatar: rene,
            title: 'Directeur des études du cycle M',
        },
    ]
</script>
