<template>
  <div><Breadcrumb class="mb-2" /></div>
  <!-- Haut de page : Timeline... -->
  <div class="flex mb-4">
    <div class="text-1 w-1/6 bg-1 rounded-md pl-1 border-1">
      <div>Demandé : Il y a <span class="font-bold"> 2 semaines</span></div>
      <div>
        Denière activité : Il y a <span class="font-bold">2 jours</span>
      </div>
      <div>Nombre de vues : <span class="font-bold">42069</span></div>
    </div>
    <div class="text-1 mx-2 w-4/6 border-1 bg-1 rounded-md">
      <Timeline />
      <!-- Timeline -->
    </div>
    <div class="w-1/6 h-auto">
      <div
        class="
          text-center
          bg-blue-400
          text-white
          hover:text-black
          border-opacity-50
          rounded-md
          p-2
          border-1
        "
      >
        Créer un Thread
      </div>
      <div
        class="
          text-center
          bg-blue-400
          text-white
          hover:text-black
          border-opacity-50
          rounded-md
          p-2
          border-1
          mt-2
        "
      >
        Suggérer une idée
      </div>
    </div>
  </div>
  <!-- Box contenant les posts -->
  <div class="flex">
    <div class="w-9/12 flex">
      <div>
        <div>
          <Post :post="post" />
        </div>
        <div class="mt-4 w-11/12 float-right">
          <Response :response="response" />
        </div>
      </div>
    </div>
    <div class="w-3/12 ml-4 text-1">
      <div class="sticky top-0 p-2 border-1 bg-1 rounded-md">
        <div class="bg-2 border-1 rounded-md px-2 pb-1">
          <div class="font-bold text-base mb-1/2">Tags :</div>
          <Tag class="mr-2" :title="'TagExample'" :color="'blue-500'" />
          <Tag class="mr-2" :title="'OneTag'" :color="'red-500'" />
          <Tag class="mr-2" :title="'Tags'" :color="'pink-500'" />
          <Tag class="mr-2" :title="'Example'" :color="'orange-500'" />
        </div>
        <div class="bg-2 border-1 rounded-md px-2 mt-4">
          <div class="font-bold text-base">Contributors :</div>
          <Contributors class="inline-block" />
          <Contributors class="inline-block" />
          <Contributors class="inline-block" />
          <Contributors class="inline-block" />
        </div>
        <div class="bg-2 border-1 rounded-md px-2 mt-4 pb-2">
          <div class="font-bold text-base mb-1/2">Sujets semblables :</div>
          <SimilarTopic :title="'#173 Probleme dans la salle 7'" class="mb-2" />
          <SimilarTopic :title="'#173 Probleme de professeur'" class="mb-2" />
          <SimilarTopic :title="'#173 Probleme dans la salle 7'" />
        </div>
      </div>
      <!-- Contibutors -->
      <!-- Sujets semblables -->
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import Post from '@/components/Post.vue'
import Response from '@/components/Response.vue'
import Timeline from '@/components/Timeline.vue'
import Tag from '@/components/Tag.vue'
import Contributors from '@/components/Contributor.vue'
import SimilarTopic from '@/components/SimilarTopic.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
// import Comment from '@/components/Comment.vue'

export default defineComponent({
  name: 'Thread',
  components: {
    Timeline,
    Tag,
    Contributors,
    SimilarTopic,
    Breadcrumb,
    Post,
    Response
    // Comment
  },
  props: {},

  data () {
    return {
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
      response: {
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
      }
    }
  },
  methods: {}
})
</script>

<style scoped>
.border {
  /* border: 1px solid white; */
}
</style>
