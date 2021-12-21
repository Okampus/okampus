<template>
  <div class="text-1">
    <input
      ref="fileInput"
      type="file"
    >
    <button
      class="button ml-4"
      @click="upload"
    >
      Upload
    </button>

    <pre
      ref="response"
      class="mb-4"
    />

    <button
      class="button"
      @click="search"
    >
      Search
    </button>

    <pre
      ref="receive"
      class="mb-4"
    />

    <input
      ref="fileId"
      type="number"
      class="input input-border text-2 bg-2"
    >
    <button
      class="button ml-4"
      @click="show=`${filesEndpoint}/get-file/${fileId.value}`"
    >
      Show
    </button>
    <img
      :src="show"
      class="mt-4"
      width="250"
      height="500"
    >
  </div>
</template>

<script lang="js">
import { ref } from 'vue'

export default {
  setup () {
    const fileInput = ref(null)
    const fileId = ref(null)
    const receive = ref(null)
    const response = ref(null)

    return {
      fileInput, fileId, receive, response
    }
  },
  data () {
    return {
      files: [],
      filesEndpoint: 'http://localhost:5000/files',
      studyDocsEndpoint: 'http://localhost:5000/files/study-docs',
      show: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.status.loggedIn
    }
  },
  methods: {
    async upload () {
      const file = this.fileInput.files[0]

      if (this.loggedIn) {
        if (file) {
          const data = new FormData()
          data.append('file', file)
          this.$store.dispatch('files/addStudyDoc', data).then(
            data => {
              this.response.innerHTML = JSON.stringify(data)
              this.studyDocs = this.$store.state.files.studyDocs
            },
            error => {
              this.message = (error.response && error.response.data) || error.message || error.toString()
            }
          )
        }
      } else {
        this.response.innerHTML = 'Upload : Vous devez être connecté pour uploader un fichier !'
      }
    },

    async search () {
      if (this.loggedIn) {
        this.$store.dispatch('files/searchStudyDocs', { page: this.$store.state.posts.page }).then(
          data => {
            this.receive.innerHTML = JSON.stringify(data)
            this.studyDocs = this.$store.state.files.studyDocs
          },
          error => {
            this.message = (error.response && error.response.data) || error.message || error.toString()
          }
        )
      } else {
        this.receive.innerHTML = 'Receive : Vous devez être connecté pour uploader un fichier !'
      }
    }
  }
}
</script>
