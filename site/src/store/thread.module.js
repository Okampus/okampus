import ThreadService from '@/services/thread.service'

const initialState = { thread: undefined }

export const thread = {
    namespaced: true,
    state: initialState,
    getters: {
        getCurrentThread (state) {
            return state.thread
        }
    },
    actions: {
        fetchThread ({ commit }, id) {
            return ThreadService.fetchThread(id).then(
                thread => {
                    console.log("THREAD", thread)
                    commit('setThread', thread)
                    return Promise.resolve(thread)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        updatePost ({ commit }, newPost) {
            return ThreadService.updatePost(newPost).then(
                newPost => {
                    commit('updatePost', newPost)
                    return Promise.resolve(newPost)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        addReply({ commit }, { postId, body }) {
            return ThreadService.addReply(postId, body).then(
                reply => {
                    commit('addReply', reply)
                    return Promise.resolve(reply)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        updateReply({ commit }, newReply) {
            return ThreadService.updateReply(newReply).then(
                newReply => {
                    commit('updateReply', newReply)
                    return Promise.resolve(newReply)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        addPostComment({ commit }, { postId, body }) {
            return ThreadService.addPostComment(postId, body).then(
                comment => {
                    commit('addPostComment', comment)
                    return Promise.resolve(comment)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        updateComment({ commit }, { commentId, body }) {
            return ThreadService.updateComment(commentId, body).then(
                comment => {
                    commit('updateComment', comment)
                    return Promise.resolve(comment)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        addReplyComment({ commit }, { replyId, body }) {
            return ThreadService.addReplyComment(replyId, body).then(
                comment => {
                    commit('addReplyComment', { comment, replyId })
                    return Promise.resolve(comment)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        votePost({ commit }, { postId, value }) {
            return ThreadService.votePost(postId, value).then(
                () => {
                    commit('votePost', value)
                    return Promise.resolve(value)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        voteReply({ commit }, { replyId, value }) {
            return ThreadService.voteReply(replyId, value).then(
                () => {
                    commit('voteReply', { replyId, newVote: value })
                    return Promise.resolve(value)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        addFavoritePost({ commit }, postId) {
            return ThreadService.addFavoritePost(postId).then(
                worked => {
                    commit('addFavoritePost', worked)
                    return Promise.resolve(worked)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        deleteFavoritePost({ commit }, postId) {
            return ThreadService.deleteFavoritePost(postId).then(
                worked => {
                    commit('deleteFavoritePost', worked)
                    return Promise.resolve(worked)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        addFavoriteReply({ commit }, replyId) {
            return ThreadService.addFavoriteReply(replyId).then(
                worked => {
                    commit('addFavoriteReply', { replyId, worked })
                    return Promise.resolve(worked)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        deleteFavoriteReply({ commit }, replyId) {
            return ThreadService.deleteFavoriteReply(replyId).then(
                worked => {
                    commit('deleteFavoriteReply', { replyId, worked })
                    return Promise.resolve(worked)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        addFavoriteComment({ commit }, commentId) {
            return ThreadService.addFavoriteComment(commentId).then(
                worked => {
                    commit('addFavoriteComment', { commentId, worked })
                    return Promise.resolve(worked)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        deleteFavoriteComment({ commit }, commentId) {
            return ThreadService.deleteFavoriteComment(commentId).then(
                worked => {
                    commit('deleteFavoriteComment', { commentId, worked })
                    return Promise.resolve(worked)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
    },
    mutations: {
        setThread (state, thread) {
            state.thread = thread
        },
        updatePost(state, post) {
            state.thread.title = post.title
            state.thread.body = post.body
            state.thread.tags = post.tags
            state.thread.contentLastUpdatedAt = post.contentLastUpdatedAt
        },
        addReply(state, reply) {
            reply.comments = []
            state.thread.replies.unshift(reply)
        },
        addPostComment(state, comment) {
            state.thread.comments.unshift(comment)
        },
        addReplyComment(state, { comment, replyId }) {
            state.thread.replies.find(reply => reply.replyId === replyId)
                .comments.unshift(comment)
        },
        updateReply(state, reply) {
            const replyIndex = state.thread.replies.findIndex(
                r => r.replyId = reply.replyId
            )

            state.thread.replies[replyIndex].body = reply.body
        },
        updateComment(state, comment) {
            const index = state.thread.comments.findIndex(
                c => c.commentId === comment.commentId
            )

            if (index === -1) {
                for (let reply of state.thread.replies) {
                    const commentIndex = reply.comments.findIndex(
                        c => c.commentId === comment.commentId
                    )

                    if (commentIndex !== -1) {
                        reply.comments[commentIndex] = comment
                        break
                    }
                }
            } else {
                state.thread.comments[index] = comment
            }
        },
        votePost(state, newVote) {
            const oldVote = state.thread.currentVote
            state.thread.currentVote = newVote

            if (oldVote === 1) {
                state.thread.upvotes -= 1
            } else if (oldVote === -1) {
                state.thread.downvotes -= 1
            }

            if (newVote === 1) {
                state.thread.upvotes += 1
            } else if (newVote === -1) {
                state.thread.downvotes += 1
            }
        },
        voteReply(state, { replyId, newVote }) {
            const replyIndex = state.thread.replies.findIndex(
                r => r.replyId === replyId
            )

            const oldVote = state.thread.replies[replyIndex].currentVote
            state.thread.replies[replyIndex].currentVote = newVote

            if (oldVote === 1) {
                state.thread.replies[replyIndex].upvotes -= 1
            } else if (oldVote === -1) {
                state.thread.replies[replyIndex].downvotes -= 1
            }

            if (newVote === 1) {
                state.thread.replies[replyIndex].upvotes += 1
            } else if (newVote === -1) {
                state.thread.replies[replyIndex].downvotes += 1
            }
        },
        addFavoritePost(state, worked) {
            if (worked) {
                state.thread.favorited = true
            }
        },
        deleteFavoritePost(state, worked) {
            if (worked) {
                state.thread.favorited = false
            }
        },
        addFavoriteReply(state, { replyId, worked }) {
            if (worked) {
                state.thread.replies.find(reply => reply.replyId === replyId).favorited = true
            }
        },
        deleteFavoriteReply(state, { replyId, worked }) {
            if (worked) {
                state.thread.replies.find(reply => reply.replyId === replyId).favorited = false
            }
        },
        addFavoriteComment(state, { commentId, worked }) {
            if (worked) {
                const index = state.thread.comments.findIndex(
                    c => c.commentId === commentId
                )

                if (index === -1) {
                    for (let reply of state.thread.replies) {
                        const commentIndex = reply.comments.findIndex(
                            c => c.commentId === commentId
                        )

                        if (commentIndex !== -1) {
                            reply.comments[commentIndex].favorited = true
                            break
                        }
                    }
                } else {
                    state.thread.comments[index].favorited = true
                }
            }
        },
        deleteFavoriteComment(state, { commentId, worked }) {
            if (worked) {
                const index = state.thread.comments.findIndex(
                    c => c.commentId === commentId
                )

                if (index === -1) {
                    for (let reply of state.thread.replies) {
                        const commentIndex = reply.comments.findIndex(
                            c => c.commentId === commentId
                        )

                        if (commentIndex !== -1) {
                            reply.comments[commentIndex].favorited = false
                            break
                        }
                    }
                } else {
                    state.thread.comments[index].favorited = false
                }
            }
        },
    }
}
