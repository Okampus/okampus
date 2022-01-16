import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/`

class UserService {
    getPublicContent () {
        return axios.get(API_URL + 'posts', { withCredentials: true })
    }

    getUserById (userId) {
        return axios.get(API_URL +`users/${userId}`, {withCredentials: true})
            .then(res => res.data)
    }

    getUserSocials (userId) {
        return axios.get(API_URL +`socials/user/${userId}`, {withCredentials: true})
            .then(res => res.data)
    }

    getSocials () {
        return axios.get(API_URL +`socials`, {withCredentials: true})
            .then(res => res.data)
    }

    getClubs () {
        return axios.get(API_URL +`clubs/names`, {withCredentials: true})
            .then(res => res.data)
    }

    getUserClubs (userId) {
        return axios.get(API_URL +`clubs/member/${userId}`, {withCredentials: true})
            .then(res => res.data.items)
    }

    updateUser ( newUser ) {
        return axios.patch(API_URL + `users/update`,newUser, {withCredentials:true}).then(res=>res.data)
    }

    addSocialAccount({userId,socialId,pseudo,link}){
        return axios.post(API_URL + `socials/user/${userId}/${socialId}`,{pseudo,link}, {withCredentials:true}).then(res => res.data)
    }

    updateSocialAccount({socialAccountId,pseudo,link}){
        return axios.patch(API_URL + `socials/user/${socialAccountId}`,{pseudo,link}, {withCredentials:true}).then(res => res.data)
    }

    deleteSocialAccount(socialAccountId){
        return axios.delete(API_URL + `socials/user/${socialAccountId}`, {withCredentials:true})
    }

    async getFavorites(){
        const postList = await axios.get(API_URL + `favorites`, {withCredentials: true}).then( res => Promise.all(res.data.items.map(async (fav) => {
            if ("post" in fav){
                const vote = await axios.get(API_URL + `posts/${fav.post.postId}/vote`, {withCredentials: true}).then(res => res.data.value)
                const favorited = true
                return {...fav, post:{...fav.post,currentVote:vote,favorited}}
            }else if ("reply" in fav){
                const vote = await axios.get(API_URL + `posts/replies/${fav.reply.replyId}/vote`, {withCredentials: true}).then(res => res.data.value)
                const favorited = true
                return {...fav, reply:{...fav.reply,currentVote:vote,favorited}}
            }else {
                const vote = await axios.get(API_URL + `posts/replies/comments/${fav.comment.commentId}/vote`, {withCredentials: true}).then(res => res.data.value)
                const favorited = true
                return {...fav, comment:{...fav.comment,currentVote:vote, favorited}}
            }
        })))
        return postList
    }

    votePost(postId, value) {
        return axios.post(API_URL + `posts/${postId}/vote`, { value }, { withCredentials: true }).then(
            res => res.data
        )
    }

    voteReply(replyId, value) {
        return axios.post(API_URL + `posts/replies/${replyId}/vote`, { value }, { withCredentials: true }).then(
            res => res.data
        )
    }

    voteComment(commentId, value) {
        return axios.post(API_URL + `posts/replies/comments/${commentId}/vote`, { value }, { withCredentials: true }).then(
            res => res.data
        )
    }

    addFavoritePost(postId) {
        return axios.post(`${API_URL}favorites/posts/${postId}`, {}, { withCredentials: true }).then(
            res => res.data
        )
    }

    deleteFavoritePost(postId) {
        return axios.delete(`${API_URL}favorites/posts/${postId}`, { withCredentials: true }).then(() => true).catch(() => false)
    }

    addFavoriteReply(replyId) {
        return axios.post(`${API_URL}favorites/replies/${replyId}`, {}, { withCredentials: true }).then(() => true).catch(() => false)
    }

    deleteFavoriteReply(replyId) {
        return axios.delete(`${API_URL}favorites/replies/${replyId}`, { withCredentials: true }).then(() => true).catch(() => false)
    }

    addFavoriteComment(commentId) {
        return axios.post(`${API_URL}favorites/comments/${commentId}`, {}, { withCredentials: true }).then(() => true).catch(() => false)
    }

    deleteFavoriteComment(commentId) {
        return axios.delete(`${API_URL}favorites/comments/${commentId}`, { withCredentials: true }).then(() => true).catch(() => false)
    }
}

export default new UserService()
