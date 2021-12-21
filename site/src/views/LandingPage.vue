<template>
  <div class="m-0">
    <div
      class="py-12 px-10 hero"
    >
      <div class="px-6">
        <h2 class="text-2xl mb-2 text-2">
          Horizon Web 🌐
        </h2>
        <h3 class="text-4xl font-bold mb-8 text-0">
          Résolution de problèmes &amp; collaboration étudiante.
        </h3>
        <router-link to="/new-post">
          <button
            class="bg-white font-bold rounded-full py-4 px-8 shadow-lg uppercase"
          >
            Créer un post
          </button>
        </router-link>
      </div>
    </div>

    <!-- Features -->
    <section class="mx-auto px-8 py-10">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-1 mb-12 uppercase tracking-wider">
        Fonctionnalités
      </h2>
      <div class="flex w-items-center mb-20 flex-wrap">
        <div class="w-full md:w-1/2 pr-6">
          <h4 class="text-3xl text-1 font-medium mb-3">
            Posts Publics
          </h4>
          <p class="text-2 mb-8">
            Un post est une <u>question</u>, une <u>remontée de problème</u>, une <u>suggestion d'amélioration</u> ou une <u>opinion</u>.
            Quiconque peut participer aux fils de discussion des posts, les <u>upvoter/downvoter</u> ou <u>rechercher d'anciens posts archivés</u>.
          </p>
        </div>
        <post-card
          class="w-full md:w-1/2"
          :post="posts[0]"
        />
      </div>
      <div class="flex items-center flex-wrap mb-20">
        <div class="w-full md:w-1/2 pr-6 order-2 md:order-1">
          <img
            src="@/assets/img/landing/github.png"
            class="w-4/5 mx-auto"
          >
        </div>
        <div class="w-full md:w-1/2 order-1 md:order-2">
          <h4 class="text-3xl text-1 font-medium mb-3">
            Fils de discussion détaillés
          </h4>
          <p class="text-2 mb-8">
            Chaque Post public a un <u>fil de discussion</u> associé dans lequel <u>quiconque peut contribuer</u>; chaque action sur le Post est enregistrée dans <u>l'historique du Post</u>, et visible dans sa <u>vue "Historique"</u>
          </p>
        </div>
      </div>

      <div class="flex items-center flex-wrap">
        <div class="pr-6">
          <h4 class="text-3xl text-1 font-medium  mb-3">
            Recherche avancée &amp; Filtrage des Posts
          </h4>
          <p class="text-2 mb-8">
            <u>Une barre de recherche</u> disponible sur toutes les pages permet de chercher du contenu parmi <u>toutes les ressources</u> de la plateforme
            <br><br>
            Pour chaque <u>type de ressource</u>, des <u>filtres sur les tags, les dates de publication et l'état des ressources</u> permettent de simplifier et préciser les recherches
          </p>
        </div>
        <div class="w-full">
          <tags-input input-placeholder="Contient les tags..." />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="js">
import PostCard from '@/components/Card/PostCard.vue'
import TagsInput from '@/components/Input/TagsInput.vue'
import girl_1 from '@/assets/img/landing/girl_1.jpg'

export default {
    components: {
        PostCard,
        TagsInput
    },
    inheritAttrs: false,
    data () {
        return {
            posts: [
                { postId: 101, type: 3, locked: false, opened: false, solved: false,
                    tags: [
                        { name: 'émargement' },
                        { name: 'présence' },
                        { name: 'promo:l2' },
                    ], body: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Problème observé: les étudiants sont parfois notés absents à des cours auxquels ils sont présents (particulièrement en ligne)"}]},{"type":"paragraph","content":[{"type":"text","text":"Solution potentielle: mettre en place un système d’émargement électronique officiel"}]}]}', title: 'Problème avec le système d\'émargement en L2', author: { username: 'Sophie H.', avatar: girl_1, reputation: 50200 }, favorites: 33, upvotes: 243, views: 44653, downvotes: 3, createdAt: '2021-10-18T13:51:36.631Z', updatedAt: '2021-10-18T13:51:36.631Z' },
            ]
        }
    }
}
</script>
