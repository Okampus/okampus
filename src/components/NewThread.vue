<template>
  <div class="ml-32 mr-32">
    <div class="text-2xl text-1 mt-8">
      Créer un nouveau Thread
    </div>
    <div class="flex mt-8">
      <form
        class="w-4/6"
        method="post"
        action="#"
      >
        <div class="bg-2 border-1 text-1 p-4">
          <div>
            <div class="text-xl">
              Titre du Thread :
            </div>
            <input
              id="title"
              class="bg-1 w-full pl-1 border-1"
              type="text"
              name="title"
              placeholder="Ex : problème de machine dans la salle E001"
            />
          </div>
          <div class="mt-4">
            <div class="text-xl">
              Contenu du Thread :
            </div>
            <textarea
              id="title"
              class="bg-1 w-full min-h-32 border-1"
              type="text"
              name="title"
              placeholder="Ex : Avec mes amis on a rencontré un dysfonctionnement de windows sur les ordinateurs de la 3ème rangée en partant du mur, en effet... "
            />
            <markdown-editor
              toolbar="bold italic upload"
              :extend="custom"
              @command:upload="upload"
            >
            </markdown-editor>
          </div>
          <div>
            <div class="text-xl">
              Tags :
            </div>
            <div class="text-sm">
              Ajoutez 5 Tags qui décrivent le sujet de votre Thread
            </div>
            <input
              id="title"
              class="bg-1 w-full pl-1 border-1"
              type="text"
              name="title"
              placeholder="Ex : problème de machine dans la salle E001"
            />
          </div>
        </div>
        <input
          class="
            bg-2
            border-1
            rounded-md
            px-1
            bc-mouse-brand
            text-hover-brand text-xl
            mt-4
            text-1
          "
          type="submit"
          value="Créer le Thread ✉"
        />
      </form>
      <div class="w-2/6 ml-8">
        <div class="border-1 text-1">
          <div class="bg-3 px-4 text-1 text-l">
            Qu'est-ce qu'un Thread ?
          </div>
          <div class="bg-2 p-2 px-4">
            Les Threads sont là pour faciliter les échanges entre
            l'établissement et les élèves, utilisez les quand vous avez un
            problème à faire remonter, besoin d'une aide, une question à
            poser...
          </div>
        </div>
        <div class="mt-4 border-1 text-1">
          <div class="bg-3 px-4 text-l">
            Etapes de création :
          </div>
          <div class="bg-2 p-2 px-4">
            <ol>
              <li>Entrez le titre</li>
              <li>Décrivez le problème</li>
              <li>Entrez des Tags</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NewThread',
  props: {
    title: {
      type: String
    },
    color: {
      type: String,
      required: true
    }
  },

  methods: {
  }
})
</script>

<style scoped>
</style>
