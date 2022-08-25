<template>
    <div>
        <HorizontalTabs
            v-model="currentTab"
            :tabs="computedTabs"
            route-base="/admin/events"
            route-name="admin"
        />

        <div v-if="currentTab === OVERVIEW">
            <button
                class="button-blue mt-4 mr-4 flex items-center gap-3 text-base"
                @click="editValidationForm"
            >
                <i class="fa fa-pencil" /> Modifier le formulaire de description d'événement
            </button>
        </div>
        <div v-else-if="loading">
            <AppLoader :whole-page="true" :size="3.5" />
        </div>
        <div v-else class="mt-8 flex flex-col">
            <FormSubmission :show="!!validationFormSubmission" :form-submission="validationFormSubmission" @update:show="validationFormSubmission = null" />
            <ModalPopup :show="!!validatingEvent" @close="validatingEvent = null">
                <template #default>
                    <div class="card flex flex-col gap-2">
                        <h2 class="mb-4 text-center">
                            Validation de l'événement {{ validatingEvent?.name }}
                        </h2>
                        <h4>Étape '{{ validatingStep?.name }}'</h4>
                        <!-- TODO: Change editor to basic textarea ? -->
                        <FormKit
                            ref="createValidationForm"
                            type="form"
                            :actions="false"
                            @submit="
                                validate({
                                    id: validatingEvent?.id,
                                    createValidation: {
                                        approved: validatingApproved,
                                        message: $event.message,
                                        stepId: validatingStep.id,
                                    },
                                })
                            "
                        >
                            <FormKit
                                type="textarea"
                                name="message"
                                :validation="`required|length:${messageCharLimit.join(',')}`"
                                rows="6"
                                outer-class="!mb-0"
                                validation-visibility="dirty"
                                :validation-messages="{
                                    required: 'Vous devez expliquer la raison de votre validation/refus.',
                                    length: `Votre message doit faire entre ${messageCharLimit[0]} et ${messageCharLimit[1]} caractères.`,
                                }"
                            />
                        </FormKit>

                        <button
                            class="font-semibold"
                            :class="{
                                'button-blue': validatingApproved,
                                'button-red': !validatingApproved,
                            }"
                            @click="() => createValidationForm.node.submit()"
                        >
                            {{ validatingApproved ? "Valider l'événement" : "Refuser l'événement" }}
                        </button>
                    </div>
                </template>
            </ModalPopup>

            <ScrollableTable
                class="h-[65vh]"
                :items="computedEvents"
                :columns="[
                    {
                        id: 'club',
                        title: 'Association',
                        sortable: true,
                    },
                    {
                        id: 'name',
                        title: `Nom de l'événement`,
                    },
                    {
                        id: 'description',
                        title: `Programme`,
                    },
                    {
                        id: 'eventValidationSubmission',
                        title: 'Fiche de validation',
                    },
                    {
                        id: 'validationStep',
                        title: 'Étape de validation actuelle',
                        sortable: true,
                    },
                    {
                        id: 'date',
                        title: 'Date de demande',
                        sortable: true,
                    },
                    {
                        id: 'location',
                        title: 'Lieu',
                        sortable: true,
                    },
                    {
                        id: 'start',
                        title: 'Date de début',
                        sortable: true,
                    },
                    {
                        id: 'price',
                        title: 'Prix',
                        sortable: true,
                    },
                    {
                        id: 'supervisor',
                        title: 'Géré par',
                    },
                    {
                        id: 'participants',
                        title: 'Participants',
                    },
                ]"
                :first-column-fixed="true"
            >
                <template #club="{ data }">
                    <div class="flex items-center gap-4">
                        <TeamActivity :team="data.team">
                            <template #subtitle>
                                {{ data.team.category }}
                            </template>
                        </TeamActivity>
                        <div v-if="data.state === SUBMITTED && config.userValidations.length === 1">
                            <button
                                class="button-green flex h-8 w-8 items-center justify-center"
                                @click="
                                    () => {
                                        validatingEvent = data
                                        validatingApproved = true
                                        validatingStep = config.userValidations[0]
                                    }
                                "
                            >
                                <i class="fa fa-check" />
                            </button>
                            <button
                                class="button-red flex h-8 w-8 items-center justify-center"
                                @click="
                                    () => {
                                        validatingEvent = data
                                        validatingApproved = true
                                        validatingStep = config.userValidations[0]
                                    }
                                "
                            >
                                <i class="fa fa-xmark" />
                            </button>
                        </div>
                        <div v-else-if="data.state === SUBMITTED" class="flex gap-2">
                            <ModalDropdown
                                :buttons="
                                    config.userValidations.map((validation) => ({
                                        name: `Valider l'étape '${validation.name}'`,
                                        action: () => {
                                            validatingEvent = data
                                            validatingApproved = true
                                            validatingStep = validation
                                        },
                                        class: 'hover:bg-green-600',
                                    }))
                                "
                            >
                                <button class="button-green flex h-8 w-8 items-center justify-center">
                                    <i class="fa fa-check" />
                                </button>
                            </ModalDropdown>
                            <ModalDropdown
                                :buttons="
                                    config.userValidations.map((validation) => ({
                                        name: `Refuser l'étape de validation '${validation.name}'`,
                                        action: () => {
                                            validatingEvent = data
                                            validatingApproved = false
                                            validatingStep = validation
                                        },
                                        class: 'hover:bg-red-600',
                                    }))
                                "
                            >
                                <button class="button-red flex h-8 w-8 items-center justify-center">
                                    <i class="fa fa-xmark" />
                                </button>
                            </ModalDropdown>
                        </div>
                    </div>
                </template>
                <template #description="{ data: { description } }">
                    <div class="line-clamp-2">
                        {{ description }}
                    </div>
                </template>
                <template #eventValidationSubmission="{ data: { eventValidationSubmission } }">
                    <div class="flex justify-center"><button class="button-grey" @click="validationFormSubmission = eventValidationSubmission">Voir la fiche</button></div>
                </template>
                <template #validationStep="{ data }">
                    {{ data?.lastValidationStep?.name ?? '<Aucune>' }} ({{
                        data.state === PUBLISHED
                            ? 'Validé ✅'
                            : data.state === REFUSED
                            ? 'Refusé ❌'
                            : `${validationStepsCount - lastStep(data)} restante${
                                  validationStepsCount - lastStep(data) > 1 ? 's' : ''
                              }`
                    }})
                </template>
                <template #date="{ data: { createdAt } }">
                    <TipRelativeDate :date="createdAt" />
                </template>
                <template #start="{ data: { start } }">
                    <TipRelativeDate :date="start" />
                </template>
                <template #price="{ data: { price } }">
                    {{ price > 0 ? `${price} €` : 'Gratuit' }}
                </template>
                <template #supervisor="{ data: { supervisor } }">
                    <UserActivity :user="supervisor.user">
                        <template #subtitle>
                            {{ supervisor.role }}
                        </template>
                    </UserActivity>
                </template>
                <template #participants="{ data: { id, registrations }, row }">
                    <AvatarGroup
                        v-if="registrations.length"
                        :link="`/event/${id}`"
                        :bg-class="
                            row % 2
                                ? 'bg-0 border-0-light dark:border-0-dark'
                                : 'bg-2 border-2-light dark:border-2-dark'
                        "
                        :total-count="registrations.length"
                        :entities="
                            registrations.map((registration) => ({
                                ...registration.user,
                                text: `${registration.status}`,
                            }))
                        "
                    />
                    <div v-else class="text-sm italic">
                        <div class="whitespace-nowrap">Pas de participants</div>
                        <div class="whitespace-nowrap">(pour le moment)</div>
                    </div>
                </template>
            </ScrollableTable>
        </div>
    </div>
</template>

<script setup>
    import { FormKit } from '@formkit/vue'

    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import ModalDropdown from '@/components/UI/Modal/ModalDropdown.vue'
    import FormSubmission from '@/components/Form/FormSubmission.vue'

    import AppLoader from '@/components/App/AppLoader.vue'

    import AvatarGroup from '@/components/List/AvatarGroup.vue'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'

    import UserActivity from '@/components/App/General/UserActivity.vue'
    import TeamActivity from '@/components/App/General/TeamActivity.vue'

    import ScrollableTable from '@/components/App/ScrollableTable.vue'
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'

    import FormKitBuilder from '@/components/FormKit/FormKitBuilder.vue'

    import { computed, markRaw, ref } from 'vue'

    import { getEvents } from '@/graphql/queries/events/getEvents'
    import { validateEvent } from '@/graphql/queries/events/validateEvent'

    import { emitter } from '@/shared/modules/emitter'

    import { updateConfig } from '@/graphql/queries/config/updateConfig'
    import { useMutation } from '@vue/apollo-composable'
    import { showSuccessToast, showToastGraphQLError } from '@/utils/toast'
    import { DEFAULT_TENANT_EVENT_VALIDATION_FORM_SCHEMA } from '@/shared/assets/form-schemas/default-schemas'

    import { PUBLISHED, REJECTED, SUBMITTED } from '@/shared/types/event-states.enum'

    import { useQuery } from '@vue/apollo-composable'

    const { result: events, loading, onError } = useQuery(getEvents, { filter: {} })
    onError((errors) => showToastGraphQLError(errors, "La liste des événements n'a pas pu être récupérée !"))

    const props = defineProps({
        config: {
            type: Object,
            required: true,
        },
    })

    const validationStepsCount = parseInt(props.config.validationSteps.length)

    const {
        mutate: updateTenant,
        onDone: onDoneUpdateConfig,
        onError: onErrorUpdateConfig,
    } = useMutation(updateConfig)
    onDoneUpdateConfig(() => showSuccessToast("Formulaire de validation d'événement mis à jour"))
    onErrorUpdateConfig(showToastGraphQLError)

    const {
        mutate: validate,
        onDone: onDoneValidateEvent,
        onError: onErrorValidateEvent,
    } = useMutation(validateEvent)
    onDoneValidateEvent(() => {
        validatingEvent.value = null
        showSuccessToast('Vous avez donné votre validation pour cet événement ✅')
    })
    onErrorValidateEvent(showToastGraphQLError)

    const editValidationForm = () => {
        emitter.emit('show-bottom-sheet', {
            title: 'Modification de formulaire ✏️',
            component: markRaw(FormKitBuilder),
            props: {
                form: {
                    meta: {
                        schema:
                            props.config.eventValidationForm ?? DEFAULT_TENANT_EVENT_VALIDATION_FORM_SCHEMA,
                    },
                },
                includeTitle: true,
                saveCallback: (form) =>
                    updateTenant({ id: props.config.id, updateTenant: { eventValidationForm: form.schema } }),
            },
        })
    }

    const messageCharLimit = [10, 10000]

    const validatingApproved = ref(false)
    const validatingEvent = ref(null)
    const validatingStep = ref(null)

    const validationFormSubmission = ref(null)

    const createValidationForm = ref(() => {})

    const OVERVIEW = 'overview'
    const VALIDATION = 'validations'
    const PENDING_TAB = 'pending'
    const VALIDATED_TAB = 'validated'
    const REJECTED_TAB = 'rejected'

    const lastStep = (event) => event.lastValidationStep?.step ?? 0

    const computedTabs = computed(() => [
        {
            id: OVERVIEW,
            name: "Vue d'ensemble",
            route: '/admin/events',
            icon: 'list',
        },
        {
            id: VALIDATION,
            name: 'Vos validations',
            icon: 'unlock',
            amount: events.value?.events?.filter(
                (event) =>
                    event.state === SUBMITTED &&
                    props.config.userValidations.some((val) => val.step >= lastStep(event)),
            ).length,
        },
        {
            id: PENDING_TAB,
            name: 'Autres validations en attente',
            icon: 'envelope',
            amount: events.value?.events?.filter(
                (event) =>
                    event.state === SUBMITTED &&
                    !props.config.userValidations.some((val) => val.step >= lastStep(event)),
            ).length,
        },
        {
            id: VALIDATED_TAB,
            name: 'Validés',
            icon: 'check',
            amount: events.value?.events?.filter((event) => event.state === PUBLISHED).length,
        },
        {
            id: REJECTED_TAB,
            name: 'Rejetés',
            icon: 'xmark',
            amount: events.value?.events?.filter((event) => event.state === REJECTED).length,
        },
    ])

    const currentTab = ref(null)

    const computedEvents = computed(() =>
        currentTab.value === VALIDATION
            ? events.value?.events?.filter(
                  (event) =>
                      event.state === SUBMITTED &&
                      props.config.userValidations.some((val) => val.step >= lastStep(event)),
              )
            : currentTab.value === PENDING_TAB
            ? events.value?.events?.filter(
                  (event) =>
                      event.state === SUBMITTED &&
                      !props.config.userValidations.some((val) => val.step >= lastStep(event)),
              )
            : currentTab.value === VALIDATED_TAB
            ? events.value?.events?.filter((event) => event.state === PUBLISHED)
            : events.value?.events?.filter((event) => event.state === REJECTED),
    )
</script>
