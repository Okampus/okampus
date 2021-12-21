<template>
  <div>
    <div
      class="absolute py-12 hero h-52 w-full top-0 left-0"
    />
    <div class="relative mt-12 mb-10 mx-auto w-11/12 bg-1 flex flex-col space-y-4 card min-w-2/3">
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
          :error="`Un titre de Post doit faire entre ${editorCharLimit[0]} et ${editorCharLimit[1]} caractères.`"
        />
      </div>

      <div>
        <div class="label-title">
          Type de Post
        </div>
        <div class="label-desc">
          Quel
          <v-menu>
            <u
              class="text-blue-400 hover:text-orange-400 cursor-help"
            >
              type
            </u>

            <template #popper>
              <div>
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
          </v-menu>
          de Post voulez-vous créer ?
        </div>
        <select
          v-model="state.type"
          name="type"
          class="select bg-1 pr-4"
          required
          @input="v$.type.$touch"
        >
          <option
            disabled
            value=""
            selected
          >
            Type de Post
          </option>
          <option
            v-for="(opt, i) in postTypesEnum"
            :key="i"
            :value="i+1"
          >
            {{ opt[$i18n.locale] }}
          </option>
        </select>
        <error-wrapper
          v-if="v$.type.$error"
          :error="typeErrorMessage"
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
            v-model="state.editor"
            name="editor"
            :char-count="true"
            :char-count-limit="editorCharLimit[1]"
            :buttons="editorButtons"
            input-placeholder="Décrivez votre question/suggestion/problème !"
            @input="v$.editor.$touch"
          >
            <error-wrapper
              v-if="v$.editor.$error"
              :error="`Une description de post doit faire entre ${editorCharLimit[0]} et ${editorCharLimit[1]} caractères.`"
            />
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
          ref="tagsInputRef"
          v-model="state.tags"
          name="tags"
          input-placeholder="Entrez le nom du tag et appuyez sur entrée..."
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

      <div>
        <button
          class="button"
          @click="submit"
        >
          <p>
            Soumettre le Post pour validation
          </p>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import useVuelidate from '@vuelidate/core'
import { between, required, minLength, maxLength } from '@vuelidate/validators'
import postTypesEnum from '@/shared/types/post-types.enum'

import TagsInput from '@/components/Input/TagsInput.vue'
import TipTapEditor from '@/components/TipTapEditor.vue'

import { ref, reactive } from 'vue'

export default {
    components: {
        TagsInput,
        ErrorWrapper,
        TipTapEditor,
    },
    inheritAttrs: false,
    props: {
        editorCharLimit: {
            type: Array,
            default: () => [10, 10000]
        },
        titleCharLimit: {
            type: Array,
            default: () => [10, 80]
        },
        minTags: {
            type: Number,
            default: 4
        }
    },
    setup (props) {
        const tagsInputRef = ref(null)
        const editorRef = ref(null)
        const postTypesTipRef = ref(null)

        const state = reactive({
            title: '',
            type: '',
            editor: '',
            tags: []
        })

        const tagsLength = (tags) => tags.length > props.minTags

        const inRange = (val, bounds) => val > bounds[0] && val < bounds[1]
        const editorCharCount = () => inRange(editorRef.value.getCharCount(), props.editorCharLimit)

        const rules = {
            title: { required, minLength: minLength(props.titleCharLimit[0]), maxLength: maxLength(props.titleCharLimit[1]) },
            type: { required, between: between(1, postTypesEnum.length) },
            editor: { editorCharCount },
            tags: { tagsLength }
        }

        return {
            tagsInputRef,
            editorRef,
            postTypesTipRef,
            state,
            v$: useVuelidate(rules, state)
        }
    },
    data () {
        return {
            postTypesEnum,
            customTagError: null,
            editorButtons: [
                { action: 'paragraph', icon: 'ri-paragraph ri-lg', content: 'Paragraphe (Ctrl+Alt+0)' },
                { action: 'bold', icon: 'ri-bold ri-lg', content: 'Gras (Ctrl+B)' },
                { action: 'italic', icon: 'ri-italic ri-lg', content: 'Italique (Ctrl+I)' },
                { action: 'strike', icon: 'ri-strikethrough ri-lg', content: 'Barré (Ctrl+Shift+X)' },
                { action: 'underline', icon: 'ri-underline ri-lg', content: 'Souligné (Ctrl+U)' },
                { action: 'highlight', icon: 'ri-mark-pen-line ri-lg', content: 'Surligné (Ctrl+Shift+H)' },
                { action: 'clearMarks', icon: 'ri-format-clear ri-lg', content: 'Enlever les styles' }
            ]
        }
    },
    methods: {
        tagsError (err) {
            if (err === 'unique') {
                this.customTagError = 'Ce Tag est déjà présent dans la liste.'
            } else if (err === 'empty') {
                this.customTagError = 'Un Tag ne peut pas être vide.'
            } else {
                // TODO
                this.customTagError = 'Erreur: ces tags génèrent une erreur inconnue.'
            }
        }
    }
}
</script>

<style lang="scss">
.v-popper {
  @apply inline-block;
}
</style>
