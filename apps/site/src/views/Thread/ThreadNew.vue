<template>
    <div class="centered-container-padded text-0 flex-col">
        <HorizontalTabs
            v-model="currentTab"
            route-base="/forum/new"
            route-name="forum-new"
            :tabs="tabs"
            class="ml-4"
        />
        <div class="card-2 bg-content">
            <GraphQLQuery :query="getTeams" :update="(data) => data?.teams">
                <template #default="{ data: teams }">
                    <FormKit type="form" :actions="false" @submit="submit">
                        <div class="flex items-center gap-2">
                            <FormKit
                                type="multiselect"
                                input-class="h-12"
                                name="scope"
                                :allow-empty="false"
                                :options="loadScopeOptions()"
                                placeholder="Qui est concerné ?"
                                single-select-prefix="Portée:"
                                validation="required"
                                validation-visibility="dirty"
                                :validation-messages="{
                                    required: 'La portée de votre question est requise.',
                                }"
                                @input="scope = $event"
                            />
                            <FormKit
                                v-model="title"
                                type="floating"
                                input-class="h-12"
                                outer-class="grow"
                                name="title"
                                placeholder="Entrez le titre de la question"
                                floating-label="Titre"
                                :validation="`required|length:${titleCharLimit.join(',')}`"
                                validation-visibility="dirty"
                                :validation-messages="{
                                    required: 'Votre question doit avoir un titre.',
                                    length: `Votre titre doit faire entre ${titleCharLimit[0]} et ${titleCharLimit[1]} caractères.`,
                                }"
                            />
                        </div>

                        <FormKitSchema :schema="schema" />
                        <div class="flex items-center gap-2">
                            <FormKit
                                v-model="noAssignees"
                                name="noAssignees"
                                type="checkbox"
                                label="Interlocuteur incertain"
                                outer-class="shrink-0 mx-1"
                            />
                            <FormKit
                                v-if="!noAssignees"
                                v-model="assignees"
                                name="assignees"
                                type="multiselect"
                                outer-class="w-full"
                                input-class="h-12"
                                placeholder="Qui peut vous répondre ?"
                                :options="loadAssigneesOptions(teams)"
                                group-values="values"
                                group-label="group"
                                :multiple="true"
                                single-select-prefix="Assigné:"
                                validation="required"
                                validation-visibility="dirty"
                                :validation-messages="{
                                    required: 'Vous devez choisir la personne assignée à cette question.',
                                }"
                            />
                            <FormKit
                                v-else
                                type="multiselect"
                                outer-class="w-full"
                                input-class="h-12"
                                placeholder="Qui peut vous répondre ?"
                                :disabled="true"
                                :options="[]"
                            />
                            <!-- <FormKit
                            :disabled="noAssignees"
                            type="text"
                            placeholder="Entrez le titre de la question..."
                        /> -->
                        </div>
                        <div class="float-right mt-2 flex items-center gap-6">
                            <FormKit
                                v-model="isAnonymous"
                                name="isAnonymous"
                                type="checkbox"
                                label="Poster anonymement"
                                outer-class="!mb-0"
                            />
                            <button class="button-green">Poster sur le forum</button>
                        </div>
                    </FormKit>
                </template>
            </GraphQLQuery>
        </div>
        <!-- <div>
            <FormKit v-model="data" type="form" @submit="handleSubmit">
                <FormKit
                    type="select"
                    label="Type de post"
                    name="type"
                    placeholder="Nature de votre post..."
                    :options="threadTypes.map((type) => type[$i18n.locale])"
                />
                <FormKit
                    type="textarea"
                    name="instructions"
                    label="Special Instructions"
                    placeholder="Allergies? No-contact delivery? Let us know."
                    :help="`${data.instructions.length} / 120`"
                    validation="length:0,120"
                    validation-visibility="live"
                    :validation-messages="{
                        length: 'Instructions cannot be more than 120 characters.',
                    }"
                />
            </FormKit>
        </div>

        <div>
            <div>Qu'est-ce qui fait un bon post ?</div>
            <div>
                <div class="text-red-400">À éviter</div>
                : "Besoin d'aide", "Question sur ...", ""
            </div>
            <div>
                <div class="text-green-400">À faire</div>
                : "Besoin d'aide", "Question sur ...", ""
            </div>
        </div> -->
    </div>
</template>

<script setup>
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'

    import { FormKitSchema, FormKit } from '@formkit/vue'

    import { computed, ref } from 'vue'
    import { EVERYONE, SCHOOL_GROUP_TYPES } from '@/shared/types/school-group-types.enum'

    import { useAuthStore } from '@/store/auth.store'
    import { useMutation } from '@vue/apollo-composable'
    import { getTeams } from '@/graphql/queries/teams/getTeams'

    import { addThread } from '@/graphql/queries/addThread'

    import { useRouter } from 'vue-router'
    import { showErrorToast, showSuccessToast } from '@/utils/toast.js'

    const router = useRouter()

    const { mutate: createThread, onDone } = useMutation(addThread)

    onDone(({ data }) =>
        showSuccessToast('Création réussie ! Tu vas être redirigé sur ton post.', {
            onClose: () => router.push(`/forum/post/${data.addThread.id}`),
        }),
    )

    const auth = useAuthStore()

    const QUESTION = 'question'
    // const PROBLEM = 'problem'

    const currentTab = ref(null)
    const tabs = [
        {
            id: QUESTION,
            name: 'Question',
            route: '/forum/new',
            icon: 'question',
        },
        // {
        //     id: PROBLEM,
        //     name: 'Signalement',
        //     icon: 'bullhorn',
        // },
    ]

    const titleCharLimit = [10, 100]
    const editorCharLimit = [10, 10000]
    const minTags = 2

    const submit = (state) => {
        state.type = 'Question'
        state.scope = state.scope.value
        if (state.noAssignees) {
            state.assignedTeams = []
            state.assignedUsers = []
        } else {
            state.assignedTeams = state.assignees
                .filter((e) => e.type === 'team')
                .map((assignee) => assignee.value)
            state.assignedUsers = state.assignees
                .filter((e) => e.type === 'user')
                .map((assignee) => assignee.value)
        }
        delete state.assignees
        delete state.noAssignees

        createThread({ thread: state })
    }

    const CLUBS_VALUE = 'clubs'
    const loadScopeOptions = () => {
        try {
            const options = [
                SCHOOL_GROUP_TYPES[EVERYONE].option,
                {
                    name: 'Vie étudiante',
                    prefix: '🎉',
                    subtitle: 'Associations, extra-scolaire, projets...',
                    value: CLUBS_VALUE,
                },
            ]

            if (auth.user.schoolGroupMemberships.length) {
                for (const schoolGroup of auth.user.schoolGroupMemberships[0].getParents) {
                    if (schoolGroup.type !== EVERYONE)
                        options.push({
                            value: schoolGroup.id,
                            highlight: schoolGroup.name,
                            ...SCHOOL_GROUP_TYPES[schoolGroup.type].option,
                        })
                }
            }

            return options
        } catch (err) {
            showErrorToast(`[Erreur] ${err.message}`)
            return []
        }
    }

    const loadAssigneesOptions = (allTeams) => {
        try {
            const clubs = {
                group: 'Associations',
                values: [
                    ...allTeams
                        .filter((team) => team.kind === 'Club')
                        .map((team) => ({
                            name: `${team.name} (${team.category})`,
                            value: team.id,
                            avatar: team.avatar ?? null,
                            type: 'team',
                        })),
                ],
            }
            const departments = {
                group: 'Départements',
                values: [
                    ...allTeams
                        .filter((team) => team.kind === 'Department')
                        .map((team) => ({
                            name: `${team.name} (${team.category})`,
                            value: team.id,
                            avatar: team.avatar ?? null,
                            type: 'team',
                        })),
                ],
            }

            return computed(() =>
                scope.value?.value === CLUBS_VALUE ? [clubs, departments] : [departments, clubs],
            )
        } catch (err) {
            showErrorToast(`[Erreur] ${err.message}`)
            return []
        }
    }

    const schema = [
        {
            $formkit: 'editor',
            name: 'body',
            placeholder: 'Votre question...',
            validation: `required|length:${editorCharLimit.join(',')}`,
            validationVisibility: 'dirty',
            validationMessages: {
                required: 'Vous devez décrire votre question.',
                length: `Votre question doit faire entre ${editorCharLimit[0]} et ${editorCharLimit[1]} caractères.`,
            },
        },

        {
            $formkit: 'tags',
            classes: {
                outer: 'grow',
            },
            name: 'tags',
            placeholder: 'Entrez au moins 2 tags décrivant votre question...',
            validation: `required|length:${minTags}`,
            validationVisibility: 'dirty',
            validationMessages: {
                required: `Vous devez entrer ${minTags} tags liés à votre question.`,
                length: `Votre devez entrer au moins ${minTags} tags.`,
            },
        },
    ]

    const title = ref('')
    const scope = ref(null)
    const isAnonymous = ref(false)
    const noAssignees = ref(false)
    const assignees = ref([])
</script>
