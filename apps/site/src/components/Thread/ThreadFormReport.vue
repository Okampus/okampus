<template>
    <ModalPopup :show="showReport">
        <template #default="{ close }">
            <div class="flex flex-col gap-2 card">
                <div class="text-xl">Signaler ce contenu</div>
                <div class="label-title">Raison</div>

                <!-- TODO: Change editor to basic textarea ? -->
                <textarea v-model="state.reason" class="input" rows="10" @input="v$.reason.$touch" />

                <div v-if="v$.reason.$error" class="text-red-500">
                    {{
                        `La raison de ton signalement doit faire entre ${reportCharLimit[0]} et ${reportCharLimit[1]} caractères.`
                    }}
                </div>

                <button
                    class="font-bold text-blue-500"
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

    import { NOOP } from '@vue/shared'
    import useVuelidate from '@vuelidate/core'
    import { reactive } from 'vue'

    import { useReportsStore } from '@/store/reports.store'

    import { maxLength, minLength, required } from '@vuelidate/validators'

    const props = defineProps({
        showReport: {
            type: Boolean,
            default: false,
        },
        content: {
            type: Object,
            default: NOOP,
        },
    })

    const reports = useReportsStore()

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

    const submit = () => {
        if (!v$.$invalid) {
            reports.addReport(props.content.author, {
                reason: state.reason,
                contentId: props.content.contentId,
            })
        }
    }
</script>
