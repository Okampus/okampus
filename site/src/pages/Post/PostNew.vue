<template>
  <div>
    <div
      class="absolute py-12 hero h-52 w-full top-0 left-0"
    >
      <h3
        class="text-4xl font-bold mb-8 text-0 px-10"
      >
        Créer un Post
      </h3>
    </div>
    <div class="relative mt-32 mb-10 flex mx-auto w-11/12">
      <form
        class="bg-1 flex flex-col space-y-4 card min-w-2/3"
        action="javascript:void(0);"
        @submit="onSubmit"
      >
        <div>
          <div class="label-title">
            Titre
          </div>

          <div class="label-desc">
            Donnez un titre simple et complet afin de décrire votre Post
          </div>
          <input
            v-model="titleValue"
            class="w-full input input-border bg-1"
            type="text"
            name="title"
            placeholder="Titre descriptif/complet"
            rules="required|min:20"
          >
          <error-wrapper
            :error="titleErrorMessage"
            success="Titre valide"
            :meta="titleMeta"
          />
        </div>

        <div>
          <div class="label-title">
            Type de Post
          </div>
          <div class="label-desc">
            Quel <u
              v-tippy="{ content: typeHtml }"
              class="text-blue-400 hover:text-orange-400 cursor-help"
            >type</u> de Post voulez-vous créer ?
          </div>
          <select
            v-model="typeValue"
            name="type"
            class="input input-border bg-1 pr-4"
            required
          >
            <option
              disabled
              value=""
              selected
            >
              Type de Post
            </option>
            <option value="1">
              Question
            </option>
            <option value="2">
              Suggestion
            </option>
            <option value="3">
              Problème
            </option>
            <option value="4">
              Discussion
            </option>
          </select>
          <error-wrapper
            :error="typeErrorMessage"
            success="Type de Post valide"
            :meta="typeMeta"
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
              v-model="editorValue"
              name="editor"
              :char-count="true"
              :buttons="editorButtons"
              input-placeholder="Décrivez votre question/suggestion/problème !"
            >
              <error-wrapper
                :error="editorErrorMessage"
                success="Post valide"
                :meta="editorMeta"
              />
            </tip-tap-editor>
          </div>
        </div>

        <div>
          <div class="label-title">
            Tags
          </div>
          <div class="label-desc">
            Ajoutez 2 Tags (ou plus) qui décrivent le sujet de votre Post
          </div>
          <tags-input
            ref="tagsInputRef"
            v-model="tagsValue"
            name="tags"
            input-placeholder="Entrez le nom du tag et appuyez sur entrée..."
            @error="tagsError"
            @inputUpdate="customTagError = undefined"
          />
          <ErrorWrapper
            :error="customTagError || tagsErrorMessage"
            success="Tags valides"
            :meta="tagsMeta"
          />
        </div>

        <div>
          <button
            class="button"
          >
            Soumettre le Post pour validation
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="js">
import { useField } from 'vee-validate'
import ErrorWrapper from '@/components/ErrorWrapper.vue'

import TagsInput from '@/components/Input/TagsInput.vue'
// import CardWithTitle from '@/components/Card/CardWithTitle.vue'
import TipTapEditor from '@/components/TipTapEditor.vue'

import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  components: {
    TagsInput,
    // CardWithTitle,
    ErrorWrapper,
    TipTapEditor
  },
  inheritAttrs: false,
  setup () {
    const store = useStore()
    const tagsInputRef = ref(null)
    const editorRef = ref(null)

    const {
      value: editorValue,
      errorMessage: editorErrorMessage,
      meta: editorMeta,
      validate: editorValidate
    } = useField('editor', 'postBody:50,250', { initialValue: '<p></p>' })

    const {
      value: titleValue,
      errorMessage: titleErrorMessage,
      meta: titleMeta,
      validate: titleValidate
    } = useField('title', 'postTitle:20,100', { initialValue: '' })

    const {
      value: typeValue,
      errorMessage: typeErrorMessage,
      meta: typeMeta,
      validate: typeValidate
    } = useField('type', 'postType', { initialValue: '' })

    const {
      value: tagsValue,
      errorMessage: tagsErrorMessage,
      meta: tagsMeta,
      validate: tagsValidate
    } = useField('tags', 'postTags:4,20', { initialValue: [] })

    const onSubmit = async (value) => {
      if ((await editorValidate())?.errors?.length || (await titleValidate())?.errors?.length || (await typeValidate())?.errors?.length || (await tagsValidate())?.errors?.length) {
        alert('Votre Post n\'est pas encore terminé.\nFinissez-le avant de le soumettre !')
      } else {
        const post = {
          title: titleValue.value,
          body: JSON.stringify(editorRef.value.getJSON()),
          type: Number.parseInt(typeValue.value, 10),
          tags: tagsValue.value
        }
        store.dispatch('posts/addPost', post)
      }
    }

    return {
      tagsInputRef,
      editorRef,
      editorErrorMessage,
      editorValue,
      editorMeta,
      editorValidate,
      titleValue,
      titleErrorMessage,
      titleMeta,
      titleValidate,
      typeValue,
      typeErrorMessage,
      typeMeta,
      typeValidate,
      tagsValue,
      tagsErrorMessage,
      tagsMeta,
      tagsValidate,
      onSubmit
    }
  },
  data () {
    return {
      customTagError: undefined,
      typeHtml: <ul>Types possibles: <li>Question: une question avec reponse </li> <li>Suggestion</li> <li>Problème</li> <li>Opinion</li> <li>Discussion</li></ul>,
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
  mounted () {
    this.editorValidate()
    this.titleValidate()
    this.tagsValidate()
    this.typeValidate()
  },
  methods: {
    tagsError (err) {
      if (err === 'unique') {
        this.customTagError = 'Ce tag est déjà présent dans la liste'
      } else if (err === 'empty') {
        this.customTagError = 'Un tag ne peut pas être vide'
      } else {
        this.customTagError = 'Erreur de tags'
      }
    }
  }
}
</script>
