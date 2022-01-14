<template>
    <div>
        <div
            v-for="favorite in favorites"
            :key="favorite"
        >
            <FavPost
                v-if="'post' in favorite"
                :post="favorite.post"
            />
            <FavReply
                v-else-if="'reply' in favorite"
                :reply="favorite.reply"
            />
            <FavComment
                v-else
                :comment="favorite.comment"
            />
        </div>
    </div>
</template>

<script>
import FavPost from '@/components/FavPost.vue'
import FavComment from '@/components/FavComment.vue';
import FavReply from '@/components/FavReply.vue';
export default {
    components: { FavPost, FavComment, FavReply },
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
