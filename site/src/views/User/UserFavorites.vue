<template>
    <div class="absolute top-0 left-0 py-12 m-0 w-full h-52 hero">
        <h3 class="mb-8 text-4xl font-bold text-0" style="padding-left: 5%; padding-right: 5%">Favoris</h3>
    </div>
    <div class="relative p-0 mx-auto mt-32 mb-10 w-full md:w-11/12 height text-0">
        <div v-for="favorite in favorites" :key="favorite">
            <FavoritePost v-if="'post' in favorite" :post="favorite.post" />
            <FavoriteReply v-else-if="'reply' in favorite" :reply="favorite.reply" />
            <FavoriteComment v-else :comment="favorite.comment" />
        </div>
    </div>
</template>

<script>
import FavoritePost from '@/components/User/Favorite/FavoritePost.vue'
import FavoriteComment from '@/components/User/Favorite/FavoriteComment.vue'
import FavoriteReply from '@/components/User/Favorite/FavoriteReply.vue'
export default {
    components: {
        FavoritePost,
        FavoriteComment,
        FavoriteReply,
    },
    props: {},
    data() {
        return {}
    },
    computed: {
        favorites() {
            return this.$store.state.users.favorites
        },
    },
    mounted() {
        this.$store.dispatch('users/getFavorites')
    },
}
</script>
<style></style>
