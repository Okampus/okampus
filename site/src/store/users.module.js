import UsersService from '@/services/users.service'
import { uniqBy } from 'lodash'
import { ITEMS_PER_PAGE, settleQuery } from './constants'

const initialState = {
    currentUser: { user: null },
    userList: [],
    userListPage: 1,
    favoriteList: [],
    socialList: [],
    socialAccountList: [],
    favorites: [],
}

export const users = {
    namespaced: true,
    state: initialState,
    getters: {
        getUserList: (state) => state.userList,
        getFavoritesList: (state) => state.favoritesList,
        getSocialsList: (state) => state.socialsList,
        getSocialsAccounts: (state) => state.socialsAccounts,
        getFavorites: (state) => state.favorites,
    },
    actions: {
        getUserList: ({ commit, state }, query) =>
            settleQuery(
                { commit, mutation: 'getUserListSuccess' },
                UsersService.getUsers({
                    page: state.userListPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                    ...query,
                }),
            ),
        getUser: ({ commit }, userId) =>
            settleQuery({ commit, mutation: 'getUserSuccess' }, UsersService.getUser(userId)),
        updateUser: ({ commit }, newUser) =>
            settleQuery({ commit, mutation: 'updateUserSuccess' }, UsersService.updateUser(newUser)),
        getUserSocialList: ({ commit }, userId) =>
            settleQuery({ commit, mutation: 'getUserSocialList' }, UsersService.getUserSocialList(userId)),
        getSocials({ commit }) {
            return UsersService.getSocials().then(
                (success) => {
                    commit('fetchSocialsSuccess', success)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        getClubs({ commit }) {
            return UsersService.getClubs().then(
                (success) => {
                    commit('fetchClubsSuccess', success)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        getUserClubs({ commit }, userId) {
            return UsersService.getUserClubs(userId).then(
                (success) => {
                    commit('fetchUserClubsSuccess', success)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        addSocialAccount({ commit }, { userId, socialId, pseudo, link }) {
            return UsersService.addSocialAccount({
                userId,
                socialId,
                pseudo,
                link,
            }).then(
                (success) => {
                    commit('addSocialAccountSuccess', success)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        updateSocialAccount({ commit }, { socialAccountId, pseudo, link }) {
            return UsersService.updateSocialAccount({
                socialAccountId,
                pseudo,
                link,
            }).then(
                (success) => {
                    commit('updateSocialAccountSuccess', success)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        deleteSocialAccount({ commit }, socialAccountId) {
            return UsersService.deleteSocialAccount(socialAccountId).then(
                (success) => {
                    commit('deleteSocialAccountSuccess', socialAccountId)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        replaceSocialAccount({ commit }, { userId, socialId, socialAccountId, pseudo, link }) {
            UsersService.deleteSocialAccount(socialAccountId).then(
                () =>
                    UsersService.addSocialAccount({
                        userId,
                        socialId,
                        pseudo,
                        link,
                    }).then(
                        (success) => {
                            commit('replaceSocialAccountSuccess', {
                                socialAccount: success,
                                socialAccountId,
                            })
                            return Promise.resolve(success)
                        },
                        (error) => {
                            console.log(error)
                            return Promise.reject(error)
                        },
                    ),
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        getFavorites({ commit }) {
            return UsersService.getFavorites().then(
                (success) => {
                    commit('fetchUserFavorites', success)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        votePostFav({ commit }, { postId, value }) {
            return UsersService.votePost(postId, value).then(
                (success) => {
                    commit('votePostSuccess', {
                        success,
                        value,
                    })
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        voteReplyFav({ commit }, { replyId, value }) {
            return UsersService.voteReply(replyId, value).then(
                (success) => {
                    commit('voteReplySuccess', {
                        success,
                        value,
                    })
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        voteCommentFav({ commit }, { commentId, value }) {
            return UsersService.voteComment(commentId, value).then(
                (success) => {
                    commit('voteCommentSuccess', {
                        success,
                        value,
                    })
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        addFavoritePost({ commit }, postId) {
            return UsersService.addFavoritePost(postId).then(
                (worked) => {
                    commit('addFavoritePostSuccess', postId)
                    return Promise.resolve(worked)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        deleteFavoritePost({ commit }, postId) {
            return UsersService.deleteFavoritePost(postId).then(
                (worked) => {
                    commit('deleteFavoritePostSuccess', postId)
                    return Promise.resolve(worked)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        addFavoriteReply({ commit }, replyId) {
            return UsersService.addFavoriteReply(replyId).then(
                (worked) => {
                    commit('addFavoriteReplySuccess', replyId)
                    return Promise.resolve(worked)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        deleteFavoriteReply({ commit }, replyId) {
            return UsersService.deleteFavoriteReply(replyId).then(
                (worked) => {
                    commit('deleteFavoriteReplySuccess', replyId)
                    return Promise.resolve(worked)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        addFavoriteComment({ commit }, commentId) {
            return UsersService.addFavoriteComment(commentId).then(
                (worked) => {
                    commit('addFavoriteCommentSuccess', commentId)
                    return Promise.resolve(worked)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        deleteFavoriteComment({ commit }, commentId) {
            return UsersService.deleteFavoriteComment(commentId).then(
                (success) => {
                    commit('deleteFavoriteCommentSuccess', commentId)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
    },
    mutations: {
        refreshUserList(state) {
            state.userList = []
            state.userListPage = 1
        },
        getUserListSuccess(state, users) {
            state.userList = uniqBy([...state.userList, ...users], 'userId')
            state.userListPage++
        },
        getUserSuccess(state, user) {
            state.currentUser = user
        },
        updateUserSuccess(state, user) {
            state.user = user
        },
        fetchSocialsAccountsSuccess(state, socialsAccounts) {
            state.socialsAccounts = socialsAccounts
        },
        fetchSocialsSuccess(state, socials) {
            state.socials = socials
        },
        addSocialAccountSuccess(state, socialAccount) {
            state.socialsAccounts.push(socialAccount)
        },
        updateSocialAccountSuccess(state, socialAccount) {
            state.socialsAccounts = state.socialsAccounts.map((a) => {
                if (a.socialAccountId != socialAccount.socialAccountId) {
                    return a
                }
                return socialAccount
            })
        },
        deleteSocialAccountSuccess(state, socialAccountId) {
            state.socialsAccounts = state.socialsAccounts.filter((a) => a.socialAccountId != socialAccountId)
        },
        replaceSocialAccountSuccess(state, { socialAccount, socialAccountId }) {
            state.socialsAccounts = state.socialsAccounts.map((social) => {
                if (social.socialAccountId != socialAccountId) {
                    return social
                }
                return socialAccount
            })
        },
        fetchUserFavorites(state, favorites) {
            state.favorites = favorites
        },
        votePostSuccess(state, { success, value }) {
            state.favorites = state.favorites.map((a) => {
                if ('post' in a) {
                    if (a.post.postId === success.postId) {
                        a.post.userVote = value
                        a.post.upvotes = success.upvotes
                        a.post.downvotes = success.downvotes
                    }
                }
                return a
            })
        },
        voteReplySuccess(state, { success, value }) {
            state.favorites = state.favorites.map((a) => {
                if ('reply' in a) {
                    if (a.reply.replyId === success.replyId) {
                        a.reply.userVote = value
                        a.reply.upvotes = success.upvotes
                        a.reply.downvotes = success.downvotes
                    }
                }
                return a
            })
        },
        voteCommentSuccess(state, { success, value }) {
            state.favorites = state.favorites.map((a) => {
                if ('comment' in a) {
                    if (a.comment.commentId === success.commentId) {
                        a.comment.userVote = value
                        a.comment.upvotes = success.upvotes
                        a.comment.downvotes = success.downvotes
                    }
                }
                return a
            })
        },
        addFavoritePostSuccess(state, success) {
            state.favorites = state.favorites.map((a) => {
                if ('post' in a) {
                    if (a.post.postId === success) a.post.userFavorited = true
                }
                return a
            })
        },
        deleteFavoritePostSuccess(state, success) {
            state.favorites = state.favorites.map((a) => {
                if ('post' in a) {
                    if (a.post.postId === success) a.post.userFavorited = false
                }
                return a
            })
        },
        addFavoriteReplySuccess(state, success) {
            state.favorites = state.favorites.map((a) => {
                if ('reply' in a) {
                    if (a.reply.replyId === success) a.reply.userFavorited = true
                }
                return a
            })
        },
        deleteFavoriteReplySuccess(state, success) {
            state.favorites = state.favorites.map((a) => {
                if ('reply' in a) {
                    if (a.reply.replyId === success) a.reply.userFavorited = false
                }
                return a
            })
        },
        addFavoriteCommentSuccess(state, success) {
            state.favorites = state.favorites.map((a) => {
                if ('comment' in a) {
                    if (a.comment.commentId === success) a.comment.userFavorited = true
                }
                return a
            })
        },
        deleteFavoriteCommentSuccess(state, success) {
            state.favorites = state.favorites.map((a) => {
                if ('comment' in a) {
                    if (a.comment.commentId === success) a.comment.userFavorited = false
                }
                return a
            })
        },
    },
}
