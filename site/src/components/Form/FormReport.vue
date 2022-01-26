<template>
    <AppModal :show="showReport">
        <Transition name="fade" as="template">
            <div class="flex flex-col">
                <div>Tu t'apprêtes à signaler {{ reportedUser.fullname }}</div>
                <div class="label-title">Raison</div>
                <TipTapEditor
                    v-model="state.reason"
                    :char-count-show-at="900"
                    :char-count="1000"
                    placeholder="Décrivez la raison de votre signalement..."
                    @input="v$.reason.$touch"
                >
                    <template #error>
                        <AppError
                            v-if="v$.body.$error"
                            error="La raison de ton signalement doit faire entre 10 et 1000 caractères."
                        />
                    </template>
                </TipTapEditor>
                <button class="button red">Signaler</button>
            </div>
        </Transition>
    </AppModal>
</template>

<script lang="js">
    import useVuelidate from '@vuelidate/core'
    import { reactive } from 'vue'
    import AppModal from '@/components/App/AppModal.vue'

    export default {
        components: { AppModal },
        props: {
            user: {
                type: Object,
                default: () => {},
            },
            content: {
                type: Object,
                default: () => {},
            },
        },
        setup() {
            const state = reactive({ reason: '' })
            const rules = {
                reason: {
                    required: true,
                    minlength: 20,
                    maxlength: 1000,
                },
            }

            return {
                state,
                v$: useVuelidate(rules, state),
            }
        },
        methods: {
            submit() {
                if (this.v$.$invalid) {
                    return
                }

                this.$store.dispatch('reports/addReport', {
                    userId: this.reportedUser.userId,
                    contentId: this.content.contentId,
                    reason: this.state.reason,
                })
            },
        },
    }
</script>
