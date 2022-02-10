<template>
    <AppToast
        v-model:active="success"
        text="Création réussie ! Tu vas être redirigé sur ton post."
        type="success"
        @close="redirect"
    />
    <CardPage>
        <div class="flex flex-col space-y-5">
            <div>
                <div class="label-title">Titre</div>
                <input
                    v-model="state.title"
                    class="w-full input"
                    type="text"
                    name="title"
                    placeholder="Titre clair, descriptif et complet"
                    @input="v$.title.$touch"
                />
                <AppError
                    v-if="v$.title.$error"
                    :error="`Un titre de post doit faire entre ${titleCharLimit[0]} et ${titleCharLimit[1]} caractères.`"
                />
            </div>

            <div>
                <div class="label-title">
                    Type de post
                    <Popper :hover="true">
                        <font-awesome-icon icon="info-circle" class="ml-1 text-sm text-slate-400" />
                        <template #content>
                            <div class="font-normal popover">
                                <ul>
                                    Types possibles:
                                    <li
                                        v-for="postType in postTypesEnum"
                                        :key="postType"
                                        class="text-blue-700"
                                    >
                                        {{ postType[$i18n.locale] }}
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </Popper>
                </div>
                <SelectInput
                    v-model="state.type"
                    button-name="Type de post"
                    :choices="postTypesEnum.map((postType) => postType[$i18n.locale])"
                />
                <AppError
                    v-if="v$.type.$error"
                    :error="`Choisis un type de post dans la liste.`"
                    success="Type de post valide"
                />
            </div>

            <div>
                <div class="label-title">Contenu</div>

                <div>
                    <TipTapEditor
                        ref="editorRef"
                        v-model="state.body"
                        name="editor"
                        mode="json"
                        :char-count="{ limit: editorCharLimit[1], showAt: 9000 }"
                        placeholder="Décris le plus précisément ce que tu souhaites faire et comment nous pouvons t'aider !"
                        @input="v$.body.$touch"
                    >
                        <template #error>
                            <AppError
                                v-if="v$.body.$error"
                                :error="`Une description de post doit faire entre ${editorCharLimit[0]} et ${editorCharLimit[1]} caractères.`"
                            />
                        </template>
                    </TipTapEditor>
                </div>
            </div>

            <div>
                <div class="label-title">
                    Tags
                    <Popper :hover="true">
                        <font-awesome-icon icon="info-circle" class="ml-1 text-sm text-slate-400" />
                        <template #content>
                            <div class="max-w-sm font-normal popover bg-0">
                                Ajoute des tags décrivant le sujet de ton post <br />
                                <div class="mt-1.5 text-sm">
                                    <span class="font-bold">NOTE :</span> pour des tags de plusieurs mots,
                                    <span class="underline">séparer les mots avec des tirets</span> plutôt que
                                    des espaces
                                </div>
                            </div>
                        </template>
                    </Popper>
                </div>

                <TagInput
                    v-model="state.tags"
                    name="tags"
                    placeholder="Entre le nom du tag puis appuie sur espace/entrée..."
                    @error="tagsError"
                    @input-update="customTagError = null"
                    @keydown="v$.tags.$touch"
                />
                <AppError
                    v-if="v$.tags.$error"
                    :error="customTagError || `Un post doit avoir au moins ${minTags} tags.`"
                    success="Tags valides"
                />
            </div>

            <div class="flex gap-4 items-center h-12">
                <button class="shrink-0 button-green" @click="submit">
                    <p>Valider mon post</p>
                </button>

                <AppAlert v-if="show === 'error'" type="error" :dismissable="true" @dismiss="show = null">
                    <template #text>
                        <span class="font-bold">Échec de création du post !</span>
                        ({{ error || 'Erreur inconnue' }})
                    </template>
                </AppAlert>
            </div>

            <!-- TODO: add second panel (dos and don'ts of a good post) -->
        </div>
    </CardPage>
</template>

<script>
    import AppAlert from '@/components/App/AppAlert.vue'
    import AppError from '@/components/App/AppError.vue'

    import Popper from 'vue3-popper'
    import SelectInput from '@/components/Input/SelectInput.vue'
    import TagInput from '@/components/Input/TagInput.vue'
    import TipTapEditor from '@/components/TipTap/TipTapEditor.vue'

    import postTypesEnum from '@/shared/types/post-types.enum'
    import { defaultTipTapText } from '@/utils/tiptap'

    import useVuelidate from '@vuelidate/core'
    import { between, maxLength, minLength, required } from '@vuelidate/validators'

    import { reactive, ref } from 'vue'
    import CardPage from '../App/CardPage.vue'
    import AppToast from '@/components/App/AppToast.vue'

    import { noop } from 'lodash'

    export default {
        components: {
            TagInput,
            AppError,
            TipTapEditor,
            Popper,
            SelectInput,
            AppAlert,
            CardPage,
            AppToast,
        },
        inheritAttrs: false,
        props: {
            editorCharLimit: {
                type: Array,
                default: () => [10, 10000],
            },
            titleCharLimit: {
                type: Array,
                default: () => [15, 80],
            },
            minTags: {
                type: Number,
                default: 2,
            },
        },
        setup(props) {
            const editorRef = ref(null)
            const state = reactive({
                title: '',
                type: null,
                body: defaultTipTapText,
                tags: [],
            })

            const tagsLength = (tags) => tags.length >= props.minTags

            const inRange = (val, bounds) => val > bounds[0] && val < bounds[1]
            const editorCharCount = () => inRange(editorRef.value.getCharCount(), props.editorCharLimit)

            const rules = {
                title: {
                    required,
                    minLength: minLength(props.titleCharLimit[0]),
                    maxLength: maxLength(props.titleCharLimit[1]),
                },
                type: {
                    required,
                    between: between(0, postTypesEnum.length - 1),
                },
                body: { editorCharCount },
                tags: { tagsLength },
            }

            return {
                editorRef,
                state,
                v$: useVuelidate(rules, state),
            }
        },
        data() {
            return {
                postTypesEnum,
                customTagError: null,
                show: null,
                error: '',
                success: false,
                redirect: noop,
            }
        },
        methods: {
            tagsError(err) {
                if (err === 'unique') {
                    this.customTagError = 'Ce Tag est déjà présent dans la liste.'
                } else if (err === 'empty') {
                    this.customTagError = 'Un Tag ne peut pas être vide.'
                } else {
                    this.customTagError = 'Erreur: ces tags génèrent une erreur inconnue.'
                }
            },
            submit() {
                if (this.v$.$invalid) {
                    this.v$.$touch()
                    return
                }

                this.success = true

                this.$store
                    .dispatch('threads/addThread', {
                        title: this.state.title,
                        type: this.state.type,
                        body: this.state.body,
                        tags: this.state.tags,
                    })
                    .then((newThread) => {
                        this.show = 'success'
                        this.redirect = () => {
                            this.$router.push(`/posts/${newThread.contentMasterId}`)
                        }
                    })
                    .catch((err) => {
                        this.show = 'error'
                        this.error = err.toString()
                    })
            },
        },
    }
</script>
