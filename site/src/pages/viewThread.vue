<template>
  <div>
    <div class="mb-2"><Breadcrumb /></div>
    <div><Thread :thread="thread" /></div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Thread from '@/components/Thread.vue'

export default defineComponent({
  name: 'viewTag',
  props: {
  },
  components: {
    Thread,
    Breadcrumb
  },

  data () {
    return {
      thread: {
        post: {
          number: '194',
          upvotes: '69',
          title: 'Les ordinateurs sur la deuxième rangée en salle E103 ne fonctionnent plus !',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut nihil reprehenderit esse aperiam odit dignissimos, praesentium quia blanditiis autem atque molestias officiis deleniti magnam libero a? Optio recusandae totam soluta! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit optio, praesentium obcaecati facere quasi',
          creator: {
            pseudo: 'Pseudo',
            role: 'Role',
            img: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
          },
          responses: [{
            author: 'Pseudo',
            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
            likes: '185'
          },
          {
            author: 'Pseudo',
            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
            likes: '185'
          },
          {
            author: 'Pseudo',
            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
            likes: '185'
          }]
        },
        responses: [{
          number: '194',
          upvotes: '69',
          title: 'Les ordinateurs sur la deuxième rangée en salle E103 ne fonctionnent plus !',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut nihil reprehenderit esse aperiam odit dignissimos, praesentium quia blanditiis autem atque molestias officiis deleniti magnam libero a? Optio recusandae totam soluta! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit optio, praesentium obcaecati facere quasi',
          creator: {
            pseudo: 'Pseudo',
            role: 'Role',
            img: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
          },
          responses: [{
            author: 'Pseudo',
            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
            likes: '185'
          },
          {
            author: 'Pseudo',
            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
            likes: '185'
          },
          {
            author: 'Pseudo',
            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
            likes: '185'
          }]
        },
        {
          number: '194',
          upvotes: '69',
          title: 'Les ordinateurs sur la deuxième rangée en salle E103 ne fonctionnent plus !',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut nihil reprehenderit esse aperiam odit dignissimos, praesentium quia blanditiis autem atque molestias officiis deleniti magnam libero a? Optio recusandae totam soluta! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit optio, praesentium obcaecati facere quasi',
          creator: {
            pseudo: 'Pseudo',
            role: 'Role',
            img: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
          },
          responses: [{
            author: 'Pseudo',
            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
            likes: '185'
          },
          {
            author: 'Pseudo',
            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
            likes: '185'
          },
          {
            author: 'Pseudo',
            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
            likes: '185'
          }]
        }]
      }
    }
  },
  methods: {
  }
})
</script>

<style scoped>
</style>
