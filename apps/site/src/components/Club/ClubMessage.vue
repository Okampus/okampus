<template>
    <div class="text-1 flex flex-col gap-10">
        <div class="flex flex-col gap-2">
            <div class="italic">
                Ce message ne sera visible que par les membres du bureau de {{ club.name }}.
            </div>
            <div class="italic">
                {{ club.name }} <u class="font-bold">ne pourra pas vous répondre sur Okampus directement</u>,
                mais pourra vous recontacter via votre mail Efrei ou un autre moyen de contact ✉️
            </div>
            <div class="italic">N'hésitez pas à personnaliser votre message !</div>
        </div>
        <div class="flex gap-10">
            <div classs="w-fit">
                <div class="flex flex-col gap-1">
                    <a
                        v-for="social in club.socials"
                        :key="social.id"
                        :href="social.link"
                        target="_blank"
                        class="flex items-center gap-2"
                    >
                        <i
                            :class="[
                                SOCIAL_TYPES[social.socialType].icon,
                                ['Discord', 'YouTube'].includes(social.socialType) ? 'text-2xl' : 'text-3xl',
                            ]"
                            :style="SOCIAL_TYPES[social.socialType].style"
                            class="flex h-8 w-8 items-center justify-center"
                        />
                        <div class="link-blue">{{ social.pseudo }}</div>
                    </a>
                </div>
            </div>
            <div>
                <div class="flex gap-2">
                    <ProfileAvatar :avatar="club.avatar" :name="club.name" :size="5" />

                    <div class="flex flex-col">
                        <div class="text-xl font-bold">{{ club.name }}</div>
                        <!-- <div class="flex gap-1" v-if="club.location">
                            <span class="text-xl">🧭</span>
                            {{ club.location }}
                        </div> -->
                    </div>
                </div>
                <div class="card mt-4 bg-0-light py-2 px-4 dark:bg-2-dark">{{ club.shortDescription }}</div>
            </div>
        </div>
        <div class="flex h-full flex-col gap-2">
            <AppTitle icon="fa fa-comment-dots" :title="`Message pour ${club.name}`"></AppTitle>
            <textarea v-model="message" class="input app-scrollbar h-full min-h-[7rem]" />
        </div>
        <div class="mb-10 flex gap-4 self-end">
            <button class="button-grey" @click="emit('close')">Annuler</button>
            <button
                class="button-blue flex items-center gap-2"
                @click="
                    () => {
                        if (!club.userInterest) {
                            createInterestMutation({
                                createInterest: {
                                    teamId: club.id,
                                    userId: localStore.me?.id,
                                    state: SUPERLIKE,
                                    message,
                                },
                            })
                        } else {
                            updateInterestMutation({
                                id: club.userInterest.id,
                                updateInterest: {
                                    state: SUPERLIKE,
                                    message,
                                },
                            })
                        }
                    }
                "
            >
                <div>Envoyer</div>
                <i class="fa fa-envelope text-lg" />
            </button>
        </div>
    </div>
</template>

<script setup>
    import AppTitle from '@/components/App/AppTitle.vue'

    import { SUPERLIKE } from '@/shared/types/interest-states.enum'
    import { SOCIAL_TYPES } from '@/shared/types/social-types.enum'

    import { createInterest } from '@/graphql/queries/teams/createInterest'
    import { updateInterest } from '@/graphql/queries/teams/updateInterest'

    import { showSuccessToast, showToastGraphQLError } from '@/utils/toast'
    import { useMutation } from '@vue/apollo-composable'

    import { ref } from 'vue'

    import localStore from '@/store/local.store'
    import ProfileAvatar from '../Profile/ProfileAvatar.vue'

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
        successCallback: {
            type: Function,
            default: () => {},
        },
    })

    const emit = defineEmits(['close'])

    const {
        mutate: createInterestMutation,
        onError: onErrorCreate,
        onDone: onDoneCreate,
    } = useMutation(createInterest)
    onErrorCreate(showToastGraphQLError)
    onDoneCreate(({ data }) => {
        emit('close')
        showSuccessToast('Prise de contact réalisée avec succès 👏')
        props.successCallback(data.createInterest)
    })

    const {
        mutate: updateInterestMutation,
        onError: onErrorUpdate,
        onDone: onDoneUpdate,
    } = useMutation(updateInterest)
    onErrorUpdate(showToastGraphQLError)
    onDoneUpdate(({ data }) => {
        emit('close')
        showSuccessToast('Prise de contact modifiée avec succès 👏')
        props.successCallback(data.updateInterest)
    })

    const message = ref(
        props.club.userInterest?.message ??
            `Hello ${props.club.name} 👋

Votre association me plaît et j'aimerais rejoindre vos activités !
Pouvez-vous m'indiquer le canal privilégié pour vous contacter directement ?
J'aurais quelques questions 😇

Vous pouvez me joindre par mail à l'adresse ${localStore.value.me.email}.

Merci !`,
    )
</script>
