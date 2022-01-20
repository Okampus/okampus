<template>
    <div class="m-0 absolute py-12 hero h-52 w-full top-0 left-0">
        <h3
            class="text-4xl font-bold mb-8 text-0"
            style="padding-left: 5%; padding-right: 5%"
        >
            Favoris
        </h3>
    </div>
    <div
        class="
        height
        relative
        mt-32
        mb-10
        text-0
        p-0
        w-full
        md:w-11/12
        mx-auto
      "
    >
        <div
            v-for="favorite in favorites"
            :key="favorite"
        >
            <favorite-post
                v-if="'post' in favorite"
                :post="favorite.post"
            />
            <favorite-reply
                v-else-if="'reply' in favorite"
                :reply="favorite.reply"
            />
            <favorite-comment
                v-else
                :comment="favorite.comment"
            />
        </div>
    </div>
</template>

<script>
import FavoritePost from '@/components/FavoritePost.vue'
import FavoriteComment from '@/components/FavoriteComment.vue';
import FavoriteReply from '@/components/FavoriteReply.vue';
export default {
    components: { FavoritePost, FavoriteComment, FavoriteReply },
    props:{
    },
    data() {
        return {
        };
    },
    computed: {
        favorites(){
            return this.$store.state.users.favorites
        }
    },
    mounted () {
        this.$store.dispatch('users/getFavorites')
    }
}
</script>
<style >

</style>
