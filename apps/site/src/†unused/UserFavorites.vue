<template>
    <div>
        <div class="hero absolute top-0 left-0 m-0 h-52 w-full py-12">
            <h3 class="text-0 mb-8 pl-10 text-4xl font-bold">Favoris</h3>
        </div>
        <div class="height text-0 relative mx-auto mt-32 mb-10 w-full p-0 md:w-11/12">
            <div v-for="(favorite, i) in favorites" :key="i">
                <!-- TODO: fuse into one component -->
                <FavoritePost v-if="favorite.content.kind === POST" :post="favorite.content" />
                <FavoriteReply v-else-if="favorite.content.kind === REPLY" :reply="favorite.content" />
                <FavoriteComment v-else-if="favorite.content.kind === COMMENT" :comment="favorite.content" />
            </div>
        </div>
    </div>
</template>

<script>
    import { POST, REPLY, COMMENT } from '@/shared/types/content-kinds.enum'
    import FavoritePost from '@/components/User/Favorite/FavoritePost.vue'
    import FavoriteComment from '@/components/User/Favorite/FavoriteComment.vue'
    import FavoriteReply from '@/components/User/Favorite/FavoriteReply.vue'
    export default {
        components: {
            FavoritePost,
            FavoriteComment,
            FavoriteReply,
        },
        data() {
            return {
                POST,
                REPLY,
                COMMENT,
            }
        },
        computed: {
            favorites() {
                return this.$store.state.user.favorites
            },
        },
        mounted() {
            this.$store.dispatch('user/getFavorites')
        },
    }
</script>
