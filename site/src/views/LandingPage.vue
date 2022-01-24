<template>
    <!-- TODO: Improve landing page! -->
    <div class="m-0">
        <div class="py-12 px-10 hero">
            <div class="px-6">
                <h2 class="mb-2 text-2xl text-2">Horizon Web 🌐</h2>
                <h3 class="mb-8 text-4xl font-bold text-0">
                    Résolution de problèmes &amp; collaboration étudiante.
                </h3>
                <router-link to="/posts/new">
                    <button class="py-4 px-8 font-bold uppercase bg-white rounded-full shadow-lg">
                        Créer un post
                    </button>
                </router-link>
            </div>
        </div>

        <!-- Features -->
        <section class="py-10 px-8 mx-auto">
            <h2 class="mb-12 text-3xl font-bold tracking-wider text-center uppercase md:text-4xl text-1">
                Fonctionnalités
            </h2>
            <div class="flex flex-wrap mb-20 w-items-center">
                <div class="pr-6 w-full md:w-1/2">
                    <h4 class="mb-3 text-3xl font-medium text-1">Posts Publics</h4>
                    <p class="mb-8 text-2">
                        Un post est une <u>question</u>, une <u>remontée de problème</u>, une
                        <u>suggestion d'amélioration</u> ou une <u>opinion</u>. Quiconque peut participer aux
                        fils de discussion des posts, les <u>upvoter/downvoter</u> ou
                        <u>rechercher d'anciens posts archivés</u>.
                    </p>
                </div>
                <PostCard class="w-full md:w-1/2" :post="posts[0]" />
            </div>
            <div class="flex flex-wrap items-center mb-20">
                <div class="order-2 pr-6 w-full md:order-1 md:w-1/2">
                    <img src="@/assets/img/landing/github.png" class="mx-auto w-4/5" />
                </div>
                <div class="order-1 w-full md:order-2 md:w-1/2">
                    <h4 class="mb-3 text-3xl font-medium text-1">Fils de discussion détaillés</h4>
                    <p class="mb-8 text-2">
                        Chaque Post public a un <u>fil de discussion</u> associé dans lequel
                        <u>quiconque peut contribuer</u>; chaque action sur le Post est enregistrée dans
                        <u>l'historique du Post</u>, et visible dans sa <u>vue "Historique"</u>
                    </p>
                </div>
            </div>

            <div class="flex flex-wrap items-center">
                <div class="pr-6">
                    <h4 class="mb-3 text-3xl font-medium text-1">
                        Recherche avancée &amp; Filtrage des Posts
                    </h4>
                    <p class="mb-8 text-2">
                        <u>Une barre de recherche</u> disponible sur toutes les pages permet de chercher du
                        contenu parmi <u>toutes les ressources</u> de la plateforme <br /><br />
                        Pour chaque <u>type de ressource</u>, des
                        <u>filtres sur les tags, les dates de publication et l'état des ressources</u>
                        permettent de simplifier et préciser les recherches
                    </p>
                </div>
                <div class="w-full">
                    <TagInput placeholder="Contient les tags..." />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="js">
import PostCard from '@/components/App/Card/PostCard.vue'
import TagInput from '@/components/Input/TagInput.vue'
import { posts } from '@/fake/posts'

export default {
    components: {
        PostCard,
        TagInput,
    },
    inheritAttrs: false,
    data () {
        return { posts }
    },
}
</script>
