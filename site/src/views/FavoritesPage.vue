<template>
    <div>
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
