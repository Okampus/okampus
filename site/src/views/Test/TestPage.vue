<template>
    <div class="text-4xl text-red-500 m-10 text-center">
        Utilisez ce component pour preview facilement des components, faire des tests...
        <br>
        (MERCI DE NE PAS COMMIT DE MODIFICATIONS)
        <br>
        <br>
        @/views/TestPage.vue
    </div>
    <PostCard
        class="w-1/2"
        :post="posts[0]"
    />
    <Carousel :data="['dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd','dsqsd']" />
</template>

<script lang="js">
import Carousel from '../../components/Carousel/Carousel.vue'

import PostCard from '../../components/Card/PostCard.vue'
import { posts } from '../../fake/posts'

export default {
    components:{
        PostCard,
        Carousel
    },
    props: {

    },
    data() {
        return {
            posts
        }
    },
    mounted() {
        console.log(this.posts)
    }
}
</script>
