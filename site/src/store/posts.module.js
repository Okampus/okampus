import PostsService from '../services/posts.service'
import router from '@/router'
import { uniqBy } from '@/utils/uniqBy'

const initialState = { posts: [], page: 0 }

export const posts = {
    namespaced: true,
    getters: {
        getPosts (state) {
            return state.posts
        }
    },
    state: initialState,
    actions: {
        fetchPosts ({ commit, state }, query) {
            state.page++
            return PostsService.getPosts({ page: state.page, itemsPerPage: 30,...query }).then(
                posts => {
                    commit('fetchSuccess', posts)
                    return Promise.resolve(posts)
                },
                error => {
                    return Promise.reject(error)
                }
            )
        },
        refreshPosts ({ commit }) {
            commit('refreshPosts')
        },
        newFetchPosts ({ dispatch }, query) {
            dispatch('refreshPosts')
            return dispatch('fetchPosts', query)
        },
        addPost ({ commit }, post) {
            return PostsService.addPost(post).then(
                newPost => {
                    commit('addPostSuccess', newPost)
                    return Promise.resolve(newPost)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        updatePost ({ commit }, id, newPost) {
            return PostsService.updatePost(id, newPost).then(
                modifiedPost => {
                    commit('updatePostSuccess', id, modifiedPost)
                    return Promise.resolve(modifiedPost)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        deletePost ({ commit }, id) {
            return PostsService.updatePost(id).then(
                success => {
                    commit('deletePostSuccess', id)
                    return Promise.resolve(success)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        }
    },
    mutations: {
        refreshPosts (state) {
            state.posts = []
            state.page = 0
        },
        fetchSuccess (state, posts) {
            state.posts = uniqBy([...state.posts, ...posts], (a, b) => a.postId === b.postId)
        },
        addPostSuccess (state, newPost) {
            router.push(`/post/${newPost.postId}`)
        },
        updatePostSuccess (state, id, modifedPost) {
            state.posts = state.posts.map(post => modifedPost ? post.id === id : post)
        },
        deletePostSuccess (state, id) {
            state.posts = state.posts.filter(post => post.id !== id)
        }
    }
}
