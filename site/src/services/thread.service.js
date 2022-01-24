import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

class ThreadService {
    async fetchThread(id) {
        const replies = await axios
            .get(`${API_URL}/posts/${id}/replies`, { withCredentials: true })
            .then((res) => res.data.items)

        const rawResponses = await Promise.all([
            axios.get(`${API_URL}/posts/${id}`, { withCredentials: true }),
            axios.get(`${API_URL}/posts/${id}/comments`, { withCredentials: true }),
            ...replies.map((reply) =>
                axios.get(`${API_URL}/posts/replies/${reply.replyId}/comments`, { withCredentials: true }),
            ),
        ])

        const rawVoteResponses = await Promise.all([
            axios.get(`${API_URL}/posts/${id}/vote`, { withCredentials: true }),
            ...replies.map((reply) =>
                axios.get(`${API_URL}/posts/replies/${reply.replyId}/vote`, { withCredentials: true }),
            ),
        ])

        const rawFavoriteResponses = await Promise.all([
            axios
                .get(`${API_URL}/favorites/posts/${id}`, { withCredentials: true })
                .then(() => true)
                .catch(() => false),
            ...replies.map((reply) =>
                axios
                    .get(`${API_URL}/favorites/replies/${reply.replyId}`, { withCredentials: true })
                    .then(() => true)
                    .catch(() => false),
            ),
        ])

        const responses = rawResponses.map((response) => response.data)
        const voteResponses = rawVoteResponses.map((response) => response.data)

        const post = responses[0]

        post.currentVote = voteResponses[0].value
        post.replies = replies
        post.comments = responses[1].items ?? []
        const rawFavoriteComments = await Promise.all(
            post.comments.map((comment) =>
                axios
                    .get(`${API_URL}/favorites/comments/${comment.commentId}`, { withCredentials: true })
                    .then(() => true)
                    .catch(() => false),
            ),
        )

        for (const comment of post.comments) {
            comment.favorited = rawFavoriteComments[post.comments.indexOf(comment)]
        }

        post.favorited = rawFavoriteResponses[0]

        for (const reply of replies) {
            reply.comments = responses[replies.indexOf(reply) + 2].items ?? []
            const rawFavoriteComments = await Promise.all(
                reply.comments.map((comment) =>
                    axios
                        .get(`${API_URL}/favorites/comments/${comment.commentId}`, { withCredentials: true })
                        .then(() => true)
                        .catch(() => false),
                ),
            )

            for (const comment of reply.comments) {
                comment.favorited = rawFavoriteComments[reply.comments.indexOf(comment)]
            }
            reply.currentVote = voteResponses[replies.indexOf(reply) + 1].value
            reply.favorited = rawFavoriteResponses[replies.indexOf(reply) + 1]
        }
        return post
    }

    updatePost({
        postId, title, body, 
    }) {
        return axios
            .patch(
                `${API_URL}/posts/${postId}/`,
                {
                    title,
                    body,
                },
                { withCredentials: true },
            )
            .then((res) => res.data)
    }

    addReply(postId, body) {
        return axios
            .post(`${API_URL}/posts/${postId}/replies`, { body }, { withCredentials: true })
            .then((res) => res.data)
    }

    updateReply({
        replyId, body, 
    }) {
        return axios
            .patch(`${API_URL}/posts/replies/${replyId}`, { body }, { withCredentials: true })
            .then((res) => res.data)
    }

    addPostComment(postId, body) {
        return axios
            .post(`${API_URL}/posts/${postId}/comments`, { body }, { withCredentials: true })
            .then((res) => res.data)
    }

    addReplyComment(replyId, body) {
        return axios
            .post(`${API_URL}/posts/replies/${replyId}/comments`, { body }, { withCredentials: true })
            .then((res) => res.data)
    }

    updateComment(commentId, body) {
        return axios
            .patch(`${API_URL}/posts/replies/comments/${commentId}`, { body }, { withCredentials: true })
            .then((res) => res.data)
    }

    votePost(postId, value) {
        return axios
            .post(`${API_URL}/posts/${postId}/vote`, { value }, { withCredentials: true })
            .then((res) => res.data)
    }

    voteReply(replyId, value) {
        return axios
            .post(`${API_URL}/posts/replies/${replyId}/vote`, { value }, { withCredentials: true })
            .then((res) => res.data)
    }

    addFavoritePost(postId) {
        return axios
            .post(`${API_URL}/favorites/posts/${postId}`, {}, { withCredentials: true })
            .then((res) => res.data)
    }

    deleteFavoritePost(postId) {
        return axios
            .delete(`${API_URL}/favorites/posts/${postId}`, { withCredentials: true })
            .then(() => true)
            .catch(() => false)
    }

    addFavoriteReply(replyId) {
        return axios
            .post(`${API_URL}/favorites/replies/${replyId}`, {}, { withCredentials: true })
            .then(() => true)
            .catch(() => false)
    }

    deleteFavoriteReply(replyId) {
        return axios
            .delete(`${API_URL}/favorites/replies/${replyId}`, { withCredentials: true })
            .then(() => true)
            .catch(() => false)
    }

    addFavoriteComment(commentId) {
        return axios
            .post(`${API_URL}/favorites/comments/${commentId}`, {}, { withCredentials: true })
            .then(() => true)
            .catch(() => false)
    }

    deleteFavoriteComment(commentId) {
        return axios
            .delete(`${API_URL}/favorites/comments/${commentId}`, { withCredentials: true })
            .then(() => true)
            .catch(() => false)
    }

    favoriteComment(commentId) {
        return axios
            .post(`${API_URL}/favorites/comments/${commentId}`, {}, { withCredentials: true })
            .then((res) => res.data)
    }
}

export default new ThreadService()
