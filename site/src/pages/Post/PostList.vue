<template>
  <div>
    <div
      class="absolute hero h-52 w-full top-0 left-0 py-12"
    >
      <h3
        class="text-4xl font-bold text-0 px-10"
      >
        Liste des Posts
      </h3>
    </div>
    <div class="relative mt-32 mb-10 flex flex-col mx-auto w-11/12">
      <post-card
        v-for="(post, i) in posts"
        :key="i"
        class="mb-2"
        :post="post"
      />
    </div>
    <!-- <button
      class="relative button"
      @click="refreshPosts"
    >
      Refresh
    </button> -->
  </div>
</template>

<script lang="js">
import { watch } from 'vue'
import PostCard from '@/components/Card/PostCard.vue'

export default {
  components: { PostCard },
  data () {
    return {
      posts: this.$store.state.posts.posts
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.status.loggedIn
    }
  },
  mounted () {
    this.emitter.on('login', () => {
      this.loadPosts()
    })

    this.emitter.on('logout', () => {
      this.$store.dispatch('posts/refreshPosts')
    })

    watch(() => this.$store.getters['posts/getPosts'], (posts) => {
      this.posts = posts
    })

    if (this.loggedIn) {
      this.loadPosts()
    }
  },
  methods: {
    refreshPosts () {
      this.$store.dispatch('posts/newFetchPosts')
    },
    loadPosts () {
      if (this.$store.state.posts.page === 0) {
        this.$store.dispatch('posts/fetchPosts')
      }
    }
  }
}
</script>
