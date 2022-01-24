import UserService from '@/services/users.service'

const initialState = {
    users: null,
    socialsAccounts: [],
    socials: [],
    userClubs: [],
    favorites: [],
    clubMembers: [],
}

export const users = {
    namespaced: true,
    state: initialState,
    actions: {
        getUserById({ commit }, userId) {
            return UserService.getUserById(userId).then(
                (success) => {
                    commit('fetchUserSuccess', success)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        getUserSocials({ commit }, userId) {
            return UserService.getUserSocials(userId).then(
                (success) => {
                    commit('fetchSocialsAccountsSuccess', success)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        getSocials({ commit }) {
            return UserService.getSocials().then(
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
            return UserService.getClubs().then(
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
            return UserService.getUserClubs(userId).then(
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
        updateUser({ commit }, newUser) {
            newUser = { description: newUser.description }
            return UserService.updateUser(newUser).then(
                (success) => {
                    commit('modifyUserSuccess', success)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        addSocialAccount({ commit }, {
            userId, socialId, pseudo, link, 
        }) {
            return UserService.addSocialAccount({
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
        updateSocialAccount({ commit }, {
            socialAccountId, pseudo, link, 
        }) {
            return UserService.updateSocialAccount({
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
            return UserService.deleteSocialAccount(socialAccountId).then(
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
        replaceSocialAccount({ commit }, {
            userId, socialId, socialAccountId, pseudo, link, 
        }) {
            UserService.deleteSocialAccount(socialAccountId).then(
                () =>
                    UserService.addSocialAccount({
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
            return UserService.getFavorites().then(
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
        votePostFav({ commit }, {
            postId, value, 
        }) {
            return UserService.votePost(postId, value).then(
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
        voteReplyFav({ commit }, {
            replyId, value, 
        }) {
            return UserService.voteReply(replyId, value).then(
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
        voteCommentFav({ commit }, {
            commentId, value, 
        }) {
            return UserService.voteComment(commentId, value).then(
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
            return UserService.addFavoritePost(postId).then(
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
            return UserService.deleteFavoritePost(postId).then(
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
            return UserService.addFavoriteReply(replyId).then(
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
            return UserService.deleteFavoriteReply(replyId).then(
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
            return UserService.addFavoriteComment(commentId).then(
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
            return UserService.deleteFavoriteComment(commentId).then(
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
        getClubMembers({ commit }, clubId) {
            return UserService.getClubMembers(clubId).then(
                (success) => {
                    commit('fetchClubMembersSuccess', success)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        addClubMember({ commit }, {
            clubId, userId, 
        }) {
            return UserService.addClubMember({
                clubId,
                userId,
            }).then(
                (success) => {
                    commit('addClubMemberSuccess', success)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        deleteClubMember({ commit }, {
            clubId, userId, 
        }) {
            return UserService.deleteClubMember({
                clubId,
                userId,
            }).then(
                (success) => {
                    commit('deleteClubMemberSuccess', {
                        userId,
                        clubId,
                    })
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        updateClubMember({ commit }, {
            clubId, userId, role, 
        }) {
            return UserService.updateMemberRole({
                clubId,
                userId,
                role,
            }).then(
                (success) => {
                    commit('updateRoleSuccess', success)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        leaveClub({ commit }, {
            clubId, userId, 
        }) {
            return UserService.deleteClubMember({
                clubId,
                userId,
            }).then(
                (success) => {
                    commit('leaveClubSuccess', clubId)
                    return Promise.resolve(success)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        getUsers({ commit }) {
            return UserService.getUsers().then(
                (success) => {
                    commit('getUsersSuccess', success)
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
        fetchUserSuccess(state, user) {
            state.user = user
        },
        fetchSocialsAccountsSuccess(state, socialsAccounts) {
            state.socialsAccounts = socialsAccounts
        },
        fetchSocialsSuccess(state, socials) {
            state.socials = socials
        },
        fetchClubsSuccess(state, clubs) {
            state.clubs = clubs
        },
        fetchUserClubsSuccess(state, userClubs) {
            state.userClubs = userClubs
        },
        modifyUserSuccess(state, user) {
            state.user = user
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
        replaceSocialAccountSuccess(state, {
            socialAccount, socialAccountId, 
        }) {
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
        votePostSuccess(state, {
            success, value, 
        }) {
            state.favorites = state.favorites.map((a) => {
                if ('post' in a) {
                    if (a.post.postId === success.postId) {
                        a.post.currentVote = value
                        a.post.upvotes = success.upvotes
                        a.post.downvotes = success.downvotes
                    }
                }
                return a
            })
        },
        voteReplySuccess(state, {
            success, value, 
        }) {
            state.favorites = state.favorites.map((a) => {
                if ('reply' in a) {
                    if (a.reply.replyId === success.replyId) {
                        a.reply.currentVote = value
                        a.reply.upvotes = success.upvotes
                        a.reply.downvotes = success.downvotes
                    }
                }
                return a
            })
        },
        voteCommentSuccess(state, {
            success, value, 
        }) {
            state.favorites = state.favorites.map((a) => {
                if ('comment' in a) {
                    if (a.comment.commentId === success.commentId) {
                        a.comment.currentVote = value
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
                    if (a.post.postId === success) a.post.favorited = true
                }
                return a
            })
        },
        deleteFavoritePostSuccess(state, success) {
            state.favorites = state.favorites.map((a) => {
                if ('post' in a) {
                    if (a.post.postId === success) a.post.favorited = false
                }
                return a
            })
        },
        addFavoriteReplySuccess(state, success) {
            state.favorites = state.favorites.map((a) => {
                if ('reply' in a) {
                    if (a.reply.replyId === success) a.reply.favorited = true
                }
                return a
            })
        },
        deleteFavoriteReplySuccess(state, success) {
            state.favorites = state.favorites.map((a) => {
                if ('reply' in a) {
                    if (a.reply.replyId === success) a.reply.favorited = false
                }
                return a
            })
        },
        addFavoriteCommentSuccess(state, success) {
            state.favorites = state.favorites.map((a) => {
                if ('comment' in a) {
                    if (a.comment.commentId === success) a.comment.favorited = true
                }
                return a
            })
        },
        deleteFavoriteCommentSuccess(state, success) {
            state.favorites = state.favorites.map((a) => {
                if ('comment' in a) {
                    if (a.comment.commentId === success) a.comment.favorited = false
                }
                return a
            })
        },
        fetchClubMembersSuccess(state, success) {
            state.clubMembers = success
        },
        addClubMemberSuccess(state, success) {
            state.userClubs = [...state.userClubs, success]
        },
        deleteClubMemberSuccess(state, {
            clubId, userId, 
        }) {
            state.clubMembers = state.clubMembers.filter((a) => {
                if (a.user.userId != userId || a.club.clubId != clubId) {
                    return a
                }
            })
        },
        updateRoleSuccess(state, success) {
            state.clubMembers = state.clubMembers.map((a) =>
                a.clubMemberId === success.clubMemberId ? success : a,
            )
        },
        leaveClubSuccess(state, clubId) {
            state.userClubs = state.userClubs.filter((a) => {
                if (a.club.clubId !== clubId) {
                    return a
                }
            })
        },
        getUsersSuccess(state, success) {
            state.users = success
        },
    },
}
