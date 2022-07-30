<template>
    <ModalPopup :show="showReport">
        <template #default="{ close }">
            <div class="card flex flex-col gap-2">
                <div class="text-xl">Signaler ce contenu</div>
                <AppTitle icon="fa fa-bullhorn" title="Raison" />

                <!-- TODO: Change editor to basic textarea ? -->
                <textarea v-model="state.reason" class="input" rows="6" cols="30" @input="v$.reason.$touch" />

                <div v-if="v$.reason.$error" class="text-red-500">
                    {{
                        `La raison de ton signalement doit faire entre ${reportCharLimit[0]} et ${reportCharLimit[1]} caractères.`
                    }}
                </div>

                <button
                    class="button-blue font-semibold"
                    @click="
                        () => {
                            if (v$.$invalid) {
                                v$.$touch()
                                return
                            }
                            submit()
                            close()
                        }
                    "
                >
                    Signaler
                </button>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup>
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import AppTitle from '@/components/App/AppTitle.vue'

    import useVuelidate from '@vuelidate/core'
    import { reactive } from 'vue'
    import { noop } from 'lodash'

    import { useMutation } from '@vue/apollo-composable'

    import { maxLength, minLength, required } from '@vuelidate/validators'
    import { report } from '@/graphql/queries/interactions/reportContent'

    const props = defineProps({
        showReport: {
            type: Boolean,
            default: false,
        },
        content: {
            type: Object,
            default: noop,
        },
    })

    const reportCharLimit = [20, 1000]

    const state = reactive({ reason: '' })
    const rules = {
        reason: {
            required,
            minLength: minLength(reportCharLimit[0]),
            maxLength: maxLength(reportCharLimit[1]),
        },
    }
    const v$ = useVuelidate(rules, state)

    const { mutate: createReport } = useMutation(report)
    const submit = () => {
        if (!v$.$invalid) {
            createReport({ id: props.content.id, report: { reason: state.reason } })
        }
    }
</script>
