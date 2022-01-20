<template>
    <div>
        <div
            class="absolute py-12 hero h-52 w-full top-0 left-0"
        />
        <div class="relative mt-12 mb-10 mx-auto w-11/12 flex flex-col space-y-4 card-0 min-w-2/3">
            <div>
                <div class="label-title">
                    Titre
                </div>

                <div class="label-desc">
                    Titre simple et complet décrivant votre Post
                </div>
                <input
                    v-model="state.title"
                    class="w-full input"
                    type="text"
                    name="title"
                    placeholder="Titre descriptif/complet"
                    @input="v$.title.$touch"
                >
                <error-wrapper
                    v-if="v$.title.$error"
                    :error="`Un titre de Post doit faire entre ${titleCharLimit[0]} et ${titleCharLimit[1]} caractères.`"
                />
            </div>

            <div>
                <div class="label-title">
                    Type de Post
                </div>
                <div class="label-desc">
                    Quel
                    <Popper :hover="true">
                        <u
                            class="text-blue-400 hover:text-orange-400 cursor-help"
                        >
                            type
                        </u>

                        <template #content>
                            <div class="popover">
                                <ul>
                                    Types possibles: <li
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
                    de Post voulez-vous créer ?
                </div>
                <select-input
                    v-model="state.type"
                    button-name="Type de Post"
                    :choices="postTypesEnum.map(postType => postType[$i18n.locale])"
                />
                <error-wrapper
                    v-if="v$.type.$error"
                    :error="`Choisissez un type de Post dans la liste.`"
                    success="Type de Post valide"
                />
            </div>

            <div>
                <div class="label-title">
                    Contenu
                </div>
                <div class="label-desc">
                    Décrivez le plus précisément possible votre Post
                </div>
                <div>
                    <tip-tap-editor
                        ref="editorRef"
                        v-model="state.body"
                        name="editor"
                        mode="json"
                        :char-count-show-at="9000"
                        :char-count="editorCharLimit[1]"
                        placeholder="Décrivez votre question/suggestion/problème !"
                        @input="v$.body.$touch"
                    >
                        <template #error>
                            <error-wrapper
                                v-if="v$.body.$error"
                                :error="`Une description de Post doit faire entre ${editorCharLimit[0]} et ${editorCharLimit[1]} caractères.`"
                            />
                        </template>
                    </tip-tap-editor>
                </div>
            </div>

            <div>
                <div class="label-title">
                    Tags
                </div>
                <div class="label-desc">
                    Ajoutez {{ minTags }} Tags (ou plus) qui décrivent le sujet de votre Post
                </div>
                <tags-input
                    v-model="state.tags"
                    name="tags"
                    placeholder="Entrez le nom du tag et appuyez sur entrée..."
                    @error="tagsError"
                    @input-update="customTagError = null"
                    @keydown="v$.tags.$touch"
                />
                <error-wrapper
                    v-if="v$.tags.$error"
                    :error="customTagError || `Un Post doit avoir au moins ${minTags} Tags.`"
                    success="Tags valides"
                />
            </div>

            <div class="flex">
                <!-- TODO: message in case post validation doesn't work, refactor error warnings, redirect -->
                <button
                    class="button"
                    @click="submit"
                >
                    <p>
                        Soumettre le Post pour validation
                    </p>
                </button>
                <div
                    v-if="submitSuccess===1"
                    class="text-green-500 bg-green-500 bg-opacity-25 font-bold p-2 rounded-md my-auto ml-4 flex gap-2"
                >
                    <i class="ri-check-fill my-auto" />
                    <div class="my-auto">
                        Création réussie
                    </div>
                </div>
                <div
                    v-else-if="submitSuccess===-1"
                    class="text-red-500 bg-red-500 bg-opacity-25 font-bold p-2 rounded-md my-auto ml-4 flex gap-2"
                >
                    <i class="ri-close-fill my-auto" />
                    <div class="my-auto">
                        Erreur lors de l'enregistrement du post
                    </div>
                </div>
            </div>

            <!-- TODO: add second panel (dos and don'ts of a good post) -->
        </div>
    </div>
</template>

<script lang="js">
import Popper from "vue3-popper"

import SelectInput from '@/components/Input/SelectInput.vue'
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import useVuelidate from '@vuelidate/core'
import { between, required, minLength, maxLength } from '@vuelidate/validators'
import postTypesEnum from '@/shared/types/post-types.enum'

import TagsInput from '@/components/Input/TagsInput.vue'
import TipTapEditor from '@/components/TipTap/TipTapEditor.vue'

import { ref, reactive } from 'vue'
import { defaultTipTapText } from '@/utils/tiptap'

export default {
    components: {
        TagsInput,
        ErrorWrapper,
        TipTapEditor,
        Popper,
        SelectInput
    },
    inheritAttrs: false,
    props: {
        editorCharLimit: {
            type: Array,
            default: () => [10, 10000]
        },
        titleCharLimit: {
            type: Array,
            default: () => [15, 80]
        },
        minTags: {
            type: Number,
            default: 2
        }
    },
    setup (props) {
        const editorRef = ref(null)
        const state = reactive({
            title: '',
            type: null,
            body: defaultTipTapText,
            tags: []
        })

        const tagsLength = (tags) => tags.length >= props.minTags

        const inRange = (val, bounds) => val > bounds[0] && val < bounds[1]
        const editorCharCount = () => inRange(editorRef.value.getCharCount(), props.editorCharLimit)

        const rules = {
            title: { required, minLength: minLength(props.titleCharLimit[0]), maxLength: maxLength(props.titleCharLimit[1]) },
            type: { required, between: between(0, postTypesEnum.length-1) },
            body: { editorCharCount },
            tags: { tagsLength }
        }

        return {
            editorRef,
            state,
            v$: useVuelidate(rules, state)
        }
    },
    data () {
        return {
            postTypesEnum,
            customTagError: null,
            submitSuccess: 0
        }
    },
    methods: {
        tagsError (err) {
            if (err === 'unique') {
                this.customTagError = 'Ce Tag est déjà présent dans la liste.'
            } else if (err === 'empty') {
                this.customTagError = 'Un Tag ne peut pas être vide.'
            } else {
                this.customTagError = 'Erreur: ces tags génèrent une erreur inconnue.'
            }
        },
        submit () {
            this.submitSuccess = 1
            if (this.v$.$invalid) {
                this.v$.$touch()
                this.submitSuccess = -1
                return
            }

            this.$store.dispatch('posts/addPost', {
                title: this.state.title,
                type: this.state.type,
                body: this.state.body,
                tags: this.state.tags
            }).then().catch(()=> {
                this.submitSuccess = -1
            })
        }
    }
}
</script>
