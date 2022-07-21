<template>
    <div>
        <CardPage>
            <div class="flex flex-col space-y-5">
                <div>
                    <div class="label-title">Titre</div>
                    <input
                        v-model="formState.title"
                        class="w-full input"
                        type="text"
                        name="title"
                        placeholder="Titre clair, descriptif et complet"
                        @input="v$.title.$touch"
                    />
                    <div v-if="v$.title.$error" class="text-red-500">
                        {{
                            `Un titre de post doit faire entre ${titleCharLimit[0]} et ${titleCharLimit[1]} caractères.`
                        }}
                    </div>
                </div>
                <div>
                    <div class="label-title">
                        Type de post
                        <Popper :hover="true" placement="right">
                            <i class="ml-1 text-sm text-slate-400 fas fa-info-circle" />
                            <template #content>
                                <div class="font-normal popover">
                                    <ul>
                                        Types possibles:
                                        <li v-for="(type, i) in threadTypes" :key="i" class="text-blue-700">
                                            {{ type[$i18n.locale] }}
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </Popper>
                    </div>
                    <SelectInput
                        v-model="formState.type"
                        button-name="Type de post"
                        :choices="threadTypes.map((type) => type[$i18n.locale])"
                    />
                    <div v-if="v$.type.$error" class="text-red-500">
                        Choisissez un type de post dans la liste.
                    </div>
                </div>
                <div>
                    <div class="label-title">Contenu</div>
                    <div>
                        <MdEditor
                            ref="editor"
                            v-model="formState.body"
                            uid="new-thread"
                            name="editor"
                            mode="json"
                            :char-count="editorCharLimit[1]"
                            placeholder="Décris le plus précisément ce que tu souhaites faire et comment nous pouvons t'aider !"
                            @input="v$.body.$touch"
                        >
                            <template #error>
                                <div v-if="v$.body.$error" class="text-red-500">
                                    {{
                                        `Une description de post doit faire entre ${editorCharLimit[0]} et ${editorCharLimit[1]} caractères.`
                                    }}
                                </div>
                            </template>
                        </MdEditor>
                    </div>
                </div>
                <div>
                    <div class="label-title">
                        Tags
                        <Popper :hover="true">
                            <i class="ml-1 text-sm text-slate-400 fas fa-info-circle" />
                            <template #content>
                                <div class="max-w-sm font-normal popover">
                                    Ajoute des tags décrivant le sujet de ton post <br />
                                    <div class="mt-1.5 text-sm">
                                        <span class="font-bold">NOTE :</span> pour des tags de plusieurs mots,
                                        <span class="underline">séparer les mots avec des tirets</span> plutôt
                                        que des espaces
                                    </div>
                                </div>
                            </template>
                        </Popper>
                    </div>
                    <TagInput
                        v-model="formState.tags"
                        name="tags"
                        placeholder="Entre le nom du tag puis appuie sur espace/entrée..."
                        @error="tagsError = tagErrorEnum[$event][i18n.global.locale]"
                        @input="tagsError = null"
                        @keydown="v$.tags.$touch"
                    />
                    <div v-if="tagsError !== null" class="text-red-500">
                        {{ tagsError || `Un post doit avoir au moins ${minTags} tags.` }}
                    </div>
                </div>
                <div class="flex gap-4 items-center h-12">
                    <button class="shrink-0 button-green" @click="submit">Valider mon post</button>
                </div>
                <!-- TODO: add second panel (dos and don'ts of a good post) -->
            </div>
        </CardPage>
    </div>
</template>

<script setup>
    import CardPage from '@/views/App/CardPage.vue'

    import SelectInput from '@/components/Input/SelectInput.vue'
    import MdEditor from '@/components/Input/Editor/MdEditor.vue'
    import TagInput from '@/components/Input/TagInput.vue'

    import Popper from 'vue3-popper'

    import useVuelidate from '@vuelidate/core'
    import { between, maxLength, minLength, required } from '@vuelidate/validators'

    import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
    import { onBeforeRouteLeave, useRouter } from 'vue-router'

    import threadTypes from '@/shared/types/thread-types.enum'
    import tagErrorEnum from '@/shared/errors/tags-error.enum'

    import { addThread } from '@/graphql/queries/addThread'

    import { i18n } from '@/shared/modules/i18n'
    import { useMutation } from '@vue/apollo-composable'
    import { getThreads } from '@/graphql/queries/getThreads'
    import { emitter } from '@/shared/modules/emitter'

    const titleCharLimit = [10, 100]
    const editorCharLimit = [10, 10000]
    const minTags = 2

    const editor = ref(null)
    const router = useRouter()

    const formState = reactive({
        title: '',
        type: '',
        body: '',
        tags: [],
    })

    const rules = {
        title: {
            required,
            minLength: minLength(titleCharLimit[0]),
            maxLength: maxLength(titleCharLimit[1]),
        },
        type: {
            required,
            between: between(0, threadTypes.length - 1),
        },
        body: {
            editorCharCount: () => {
                const charCount = editor.value.charCount
                return charCount > editorCharLimit[0] && charCount < editorCharLimit[1]
            },
        },
        tags: { tagsLength: (tags) => tags.length >= minTags },
    }

    const v$ = useVuelidate(rules, formState)
    const formIsDirty = computed(
        () =>
            formState.title !== '' ||
            formState.type !== '' ||
            formState.body !== '' ||
            formState.tags.length !== 0,
    )

    const tagsError = ref(null)
    const success = ref(false)

    const {
        mutate: createThread,
        onDone,
        onError,
    } = useMutation(addThread, {
        update: (cache, { data: { addThread } }) => {
            const data = cache.readQuery({ query: getThreads })?.threads

            if (data) {
                cache.writeQuery({
                    query: getThreads,
                    data: {
                        threads: {
                            addThread,
                            ...data,
                        },
                    },
                })
            }
        },
    })
    onDone((result) => {
        success.value = true
        emitter.emit('show-toast', {
            message: 'Création réussie ! Tu vas être redirigé sur ton post.',
            type: 'success',
            onClose: () => {
                router.push(`/forum/post/${result.data.addThread.id}`)
            },
        })
    })
    onError((err) => {
        emitter.emit('show-toast', {
            message: err.message,
            type: 'error',
        })
    })

    onBeforeRouteLeave((to, from, next) => {
        if (!success.value && formIsDirty.value) {
            // TODO: custom modal
            if (window.confirm('Ês-tu sûr ? Toutes tes modifications non enregistrées seront perdues.')) {
                next()
            } else {
                return false
            }
        } else {
            next()
        }
    })

    const beforeWindowUnload = (e) => {
        if (!success.value && formIsDirty.value) {
            e.returnValue = 'Ês-tu sûr ? Toutes tes modifications non enregistrées seront perdues.'
            return true
        } else {
            e.returnValue = ''
        }
    }

    onMounted(() => {
        window.addEventListener('beforeunload', beforeWindowUnload)
    })

    onUnmounted(() => {
        window.removeEventListener('beforeunload', beforeWindowUnload)
    })

    const submit = () => {
        if (v$.$invalid) {
            v$.$touch()
            return
        }

        createThread({ thread: { ...formState, type: threadTypes[formState.type].key, assignees: [] } })
    }
</script>
