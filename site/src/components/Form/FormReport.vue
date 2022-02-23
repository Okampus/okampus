<template>
    <AppModal :show="showReport">
        <template #default="{ close }">
            <div class="flex flex-col gap-2 card">
                <div class="text-xl">Signaler ce contenu</div>
                <div class="label-title">Raison</div>

                <TipTapEditor
                    v-model="state.reason"
                    :char-count="{ limit: 1000, showAt: 900 }"
                    placeholder="Décris la raison de ton signalement..."
                    @input="v$.reason.$touch"
                >
                    <template #error>
                        <AppError
                            v-if="v$.reason.$error"
                            error="La raison de ton signalement doit faire entre 10 et 1000 caractères."
                        />
                    </template>
                </TipTapEditor>
                <button
                    class="font-bold text-blue-500"
                    @click="
                        () => {
                            submit()
                            close()
                        }
                    "
                >
                    Signaler
                </button>
            </div>
        </template>
    </AppModal>
</template>

<script setup>
    import AppModal from '@/components/App/AppModal.vue'
    import AppError from '@/components/App/AppError.vue'
    import TipTapEditor from '@/components/TipTap/TipTapEditor.vue'

    import { NOOP } from '@vue/shared'
    import useVuelidate from '@vuelidate/core'
    import { reactive } from 'vue'

    import { useReportsStore } from '@/store/reports.store'

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

    const state = reactive({ reason: '' })
    const rules = {
        reason: {
            required: true,
            minlength: 20,
            maxlength: 1000,
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
