<template>
    <GraphQLQuery
        :query="getConfig"
        :variables="{ id: getTenant() }"
        :update="(data) => data?.tenantById"
        :whole-page="true"
    >
        <template #default="{ data: config }">
            <GraphQLQuery
                :query="getEvents"
                :variables="{ filter: { id: club.id } }"
                :update="(data) => data?.events"
            >
                <template #include="{ query }">
                    <FormPopUp
                        v-model:show="showCreateForm"
                        :form-schema="createEventForm"
                        :submit="(state) => createDraftEvent(state, query)"
                        :submit-button="{
                            label: `Passer au formulaire de validation`,
                            icon: 'arrow-right',
                            reverse: true,
                        }"
                    >
                        <FormList
                            v-model="currentRegistrationForm"
                            :forms="club.forms"
                            :form-type="EVENT_REGISTRATION"
                            :team-id="club.id"
                            :select="true"
                            :default-form="{
                                id: null,
                                type: EVENT_REGISTRATION,
                                name: 'Inscription simple',
                                schema: DEFAULT_EVENT_REGISTRATION_FORM_SCHEMA,
                            }"
                        />
                    </FormPopUp>

                    <FormPopUp
                        v-model:show="showValidationForm"
                        :form-schema="
                            config.eventValidationForm ?? DEFAULT_TENANT_EVENT_VALIDATION_FORM_SCHEMA
                        "
                        :submit="(state) => submitEvent(state, query)"
                        :submit-button="{
                            class: 'button-green',
                            label: `Publier l'événement pour validation`,
                        }"
                    />
                </template>

                <template #default="{ data: events }">
                    <div class="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4">
                        <ClubEventCard v-for="event in events" :key="event" :event="event">
                            <template v-if="event.state === DRAFT" #buttons>
                                <button
                                    class="button-green z-20 rounded-full text-lg"
                                    @click="
                                        () => {
                                            showValidationForm = true
                                            validatingEvent = event
                                        }
                                    "
                                >
                                    Valider l'événement
                                </button>
                            </template>
                        </ClubEventCard>

                        <div class="card-2 flex flex-col items-center justify-center gap-4">
                            <button class="button-circle button-indigo" @click="showCreateForm = true">
                                <i class="fa fa-plus text-xl" />
                            </button>
                            <div class="text-center text-lg">Créer un nouvel événement</div>
                        </div>
                    </div>
                </template>
                <template #empty>
                    <div class="text-0 my-12 flex flex-col items-center gap-2">
                        <img class="h-48 w-48" :src="Calendar" />
                        <h2 class="text-center">Votre association n'a pas encore prévu d'événéments !</h2>
                        <button
                            class="button-green mt-3 rounded-full text-xl font-semibold"
                            @click="showCreateForm = true"
                        >
                            Créer un nouvel événement
                        </button>
                    </div>
                </template>
            </GraphQLQuery>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import Calendar from '@/assets/img/3dicons/calendar.png'
    import FormList from '@/components/FormKit/FormList.vue'

    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'

    import FormPopUp from '@/components/Form/FormPopUp.vue'

    import { useMutation } from '@vue/apollo-composable'
    import { ref } from 'vue'

    import { getTenant } from '@/utils/getTenant'

    import { getEvents } from '@/graphql/queries/events/getEvents'
    import { getConfig } from '@/graphql/queries/config/getConfig'

    import { createEvent } from '@/graphql/queries/events/createEvent'
    import { updateEvent } from '@/graphql/queries/events/updateEvent'

    import { createEventForm } from '@/shared/assets/form-schemas/create-event'

    import { DRAFT, SUBMITTED } from '@/shared/types/event-states.enum'
    import { EVENT_REGISTRATION } from '@/shared/types/team-form-types.enum'
    import {
        DEFAULT_EVENT_REGISTRATION_FORM_SCHEMA,
        DEFAULT_TENANT_EVENT_VALIDATION_FORM_SCHEMA,
    } from '@/shared/assets/form-schemas/default-schemas'

    import { showSuccessToast, showToastGraphQLError } from '@/utils/toast'

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const {
        mutate: createTeamEvent,
        onDone: onDoneCreateEvent,
        onError: onErrorCreateEvent,
    } = useMutation(createEvent)
    onErrorCreateEvent(showToastGraphQLError)

    const {
        mutate: updateTeamEvent,
        onDone: onDoneUpdateEvent,
        onError: onErrorUpdateEvent,
    } = useMutation(updateEvent)
    onErrorUpdateEvent(showToastGraphQLError)

    const showCreateForm = ref(false)
    const currentRegistrationForm = ref(null)

    const showValidationForm = ref(false)
    const validatingEvent = ref(null)

    // const createForm = ref(null)
    // const createEventData = ref({})

    const submitEvent = (state, query) => {
        onDoneUpdateEvent(() => {
            showSuccessToast('Événement soumis pour validation 📝')
            query.refetch()
            showValidationForm.value = false
        })

        updateTeamEvent({
            id: validatingEvent.value.id,
            updateEvent: {
                state: SUBMITTED,
                eventValidationSubmission: state,
            },
        })
    }

    const createDraftEvent = (state, query) => {
        const { supervisor, price, ...createEvent } = state
        onDoneCreateEvent((result) => {
            showSuccessToast("Brouillon d'événement enregistré 📝")
            query.refetch()
            showCreateForm.value = false
            if (result?.data?.createEvent) {
                showValidationForm.value = true
                validatingEvent.value = result.data.createEvent
            }
        })

        createTeamEvent({
            id: props.club.id,
            createEvent: {
                ...createEvent,
                price: parseFloat(price),
                supervisorId: supervisor[0].realId,
                formId: currentRegistrationForm.value?.id,
                state: DRAFT,
            },
        })
        // const start = new Date(event.eventDateStart)
        // start.setHours(event.eventTimeStart.split(':')[0])
        // start.setMinutes(event.eventTimeStart.split(':')[1])
        // const end = new Date(event.eventDateEnd)
        // end.setHours(event.eventTimeEnd.split(':')[0])
        // end.setMinutes(event.eventTimeEnd.split(':')[1])
    }
</script>
