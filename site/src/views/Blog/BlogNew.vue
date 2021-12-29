<template lang="">
    <!-- New BlogPost -->
    <!-- <div class="px-8 mt-10">
    <h1 class="text-4xl font-bold text-gray-700 uppercase">
      NEW POST
    </h1>
  </div> -->
    <div class="mx-6 my-12">
        <div class="flex p-1 mb-6  ">
            <input
                id="title"
                type="text"
                class="text-xl text-xlborder-2 border-gray-300 p-2 w-1/2 mr-10 rounded-md"
                name="title"
                value=""
                placeholder="Titre"
                required
            >
            <button
                role="submit"
                class="p-3 bg-secondary-3 text-white hover:bg-blue-400 mx-1 rounded-md"
                required
            >
                Publish
            </button>
            <button
                role="submit"
                class="p-3 bg-0-light text-black hover:bg-blue-300 mx-1 rounded-md"
                required
            >
                Save
            </button>
            <button
                role="submit"
                class="p-3 bg-0-light text-black hover:bg-blue-300 mx-1 rounded-md"
                required
            >
                Preview
            </button>
            <button
                role="submit"
                class="p-3 bg-0-light text-black hover:bg-blue-300 mx-1 rounded-md"
                required
            >
                Close
            </button>
        </div>
        <div class="flex">
            <div
                class="p-6 bg-0 md:w-3/4 flex flex-col "
            >
                <div class="blog-editor">
                    <tip-tap-editor
                        :char-count="true"
                        :buttons="editorButtons"
                        :char-count-limit="100000"
                    />
                </div>
            </div>

            <!-- Sidebar -->
            <div class="bg-0">
                <div class="px-6 py-4 my-3">
                    <div class="my-4">
                        <label class=" mb-2 text-md text-gray-600">Description</label>
                        <input
                            id="description"
                            type="text"
                            class="border-2 border-gray-300 p-2 w-full rounded-md mt-2"
                            name="description"
                            placeholder="(Optional)"
                        >
                    </div>
                    <div class="my-4">
                        <div class="text-md text-gray-600 m-2">
                            Tags
                        </div>
                        <tags-input />
                    </div>
                    <div class="text-md text-gray-600 mb-2 text-c2 mt-6">
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TagsInput from '@/components/Input/TagsInput.vue'
import TipTapEditor from '@/components/TipTapEditor.vue'
export default {
    components: { TipTapEditor, TagsInput },
    data () {
        return {
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
    }
}
</script>

<style lang="scss">
.blog-editor .ProseMirror {
  min-height:450px;
  max-height:650px;
  overflow-y:scroll;
}
</style>
