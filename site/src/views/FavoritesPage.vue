<template>
    <div>
        <div
            v-for="favorite in favorites"
            :key="favorite"
        >
            <FavPost
                v-if="'postId' in favorite"
                :post="favorite"
            />
            <FavComment
                v-else-if="'replyId' in favorite"
                :comment="favorite"
            />
            <FavReply
                v-else
                :reply="favorite"
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
        favorites: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
        };
    }
}
</script>
<style >

</style>
