<template>
    <div class="mx-6 mt-8 mb-12 flex flex-col space-y-2">
        <div class="card">
            <div class="flex flex-col lg:flex-row lg:items-center lg:space-x-2">
                <strong class="mr-2">Nouvel Article</strong>
                <input
                    id="title"
                    type="text"
                    class="input mt-1 h-10 w-full lg:m-0"
                    name="title"
                    value=""
                    placeholder="Titre de l'article"
                    required
                />
                <div class="mt-3 flex min-w-fit lg:m-0">
                    <div class="flex min-w-fit pr-4 lg:ml-3">
                        <ProfileAvatar :avatar="user.avatar" :name="user.fullname" />
                        <div class="text-0 ml-3 flex flex-col text-sm">
                            <p class="whitespace-nowrap">Poster en tant que</p>
                            <strong class="whitespace-nowrap text-base">{{ user.fullname }}</strong>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="button-blue">
                            <p class="text-sm">Publier</p>
                        </button>
                        <button class="button-blue">
                            <p class="text-sm">Sauvegarder</p>
                        </button>
                        <button class="button-blue">
                            <p class="text-sm">Aperçu</p>
                        </button>
                        <button class="button-blue">
                            <p class="text-sm">Fermer</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col-reverse lg:flex-row lg:space-y-0 lg:space-x-2">
            <div class="card blog-editor lg:w-2/3">
                <strong> Éditeur d'article </strong>
                <MdEditor uid="new-blog" :char-count="10000" />
            </div>
            <!-- Sidebar -->
            <div class="card mb-2 space-y-2 lg:w-1/3">
                <div>
                    <strong> Miniature </strong>
                    <div class="flex">
                        <!-- TODO: File input -->
                        <label class="bg-primary-3 text-0 rounded-md py-2 px-4">
                            <span class="block">Changer l'image</span>
                            <input type="file" class="hidden" />
                        </label>
                    </div>
                </div>

                <div>
                    <strong>Table des matières</strong>
                    <textarea name="table-of-contents" class="input w-full" placeholder="(Optionnel)" />
                </div>

                <div>
                    <strong> Paramètres de l'article </strong>
                    <div class="text m-2 text-gray-600">Description</div>
                    <textarea name="description" class="input w-full" placeholder="(Optionnel)" />
                    <!-- <input
                        id="description"
                        type="text"
                        name="description"
                        placeholder="(Optionnel)"
                    > -->
                    <div class="text m-2 text-gray-600">Tags</div>

                    <TagInput />
                    <!-- <div class="text-md text-gray-600 mb-2 text-c2 mt-6">
                            Location
                        </div>
                        <div class="flex cursor-pointer border px-4 py-2 text-lg text-grey-darkest rounded-md">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 2048 1792"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M1024 672q119 0 203.5 84.5t84.5 203.5-84.5 203.5-203.5 84.5-203.5-84.5-84.5-203.5 84.5-203.5 203.5-84.5zm704-416q106 0 181 75t75 181v896q0 106-75 181t-181 75h-1408q-106 0-181-75t-75-181v-896q0-106 75-181t181-75h224l51-136q19-49 69.5-84.5t103.5-35.5h512q53 0 103.5 35.5t69.5 84.5l51 136h224zm-704 1152q185 0 316.5-131.5t131.5-316.5-131.5-316.5-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5z"
                                />
                            </svg>
                            <div class="pl-2">
                                --
                            </div>
                        </div>
                        <div class="text-md text-gray-600 mb-2 text-c2 mt-6">
                            Options
                        </div>
                        <div class="flex cursor-pointer border px-4 py-2 text-lg text-grey-darkest rounded-md">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 2048 1792"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M1024 672q119 0 203.5 84.5t84.5 203.5-84.5 203.5-203.5 84.5-203.5-84.5-84.5-203.5 84.5-203.5 203.5-84.5zm704-416q106 0 181 75t75 181v896q0 106-75 181t-181 75h-1408q-106 0-181-75t-75-181v-896q0-106 75-181t181-75h224l51-136q19-49 69.5-84.5t103.5-35.5h512q53 0 103.5 35.5t69.5 84.5l51 136h224zm-704 1152q185 0 316.5-131.5t131.5-316.5-131.5-316.5-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5z"
                                />
                            </svg>
                            <div class="pl-2">
                                --
                            </div>
                        </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { users } from '@/fake/blog'

    import TagInput from '@/components/Input/TagInput.vue'
    import MdEditor from '@/components/Input/Editor/MdEditor.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    export default {
        name: 'BlogPostForm',
        components: {
            TagInput,
            MdEditor,
            ProfileAvatar,
        },
        data() {
            return {
                user: users[0],
            }
        },
    }
</script>

<style lang="scss">
    /* stylelint-disable-next-line selector-class-pattern */
    .blog-editor .ProseMirror {
        min-height: 40rem;
        max-height: 40rem;
        overflow-y: scroll;
    }
</style>
