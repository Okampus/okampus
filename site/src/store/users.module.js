import UserService from '@/services/users.service';

const initialState = { users: null, socialsAccounts: [], socials:[], userClubs:[], favorites: [] }

export const users = {
    namespaced: true,
    state: initialState,
    actions: {
        getUserById({commit}, userId) {
            return UserService.getUserById(userId).then(
                success => {
                    commit('fetchUserSuccess', success)
                    return Promise.resolve(success)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        getUserSocials({commit}, userId) {
            return UserService.getUserSocials(userId).then(
                success => {
                    commit('fetchSocialsAccountsSuccess', success)
                    return Promise.resolve(success)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        getSocials({commit}) {
            return UserService.getSocials().then(
                success => {
                    commit('fetchSocialsSuccess',success)
                    return Promise.resolve(success)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        getClubs({commit}) {
            return UserService.getClubs().then(
                success => {
                    commit('fetchClubsSuccess',success)
                    return Promise.resolve(success)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        getUserClubs({commit}, userId) {
            return UserService.getUserClubs(userId).then(
                success => {
                    commit('fetchUserClubsSuccess',success)
                    return Promise.resolve(success)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                })
        },
        updateUser({commit}, newUser) {
            newUser = {description: newUser.description}
            return UserService.updateUser(newUser).then(
                success => {
                    commit('modifyUserSuccess', success)
                    return Promise.resolve(success)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        addSocialAccount({commit},{userId,socialId,pseudo,link}){
            return UserService.addSocialAccount({userId,socialId,pseudo,link}).then(
                success => {
                    commit('addSocialAccountSuccess',success)
                    return Promise.resolve(success)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        updateSocialAccount({commit},{socialAccountId,pseudo,link}){
            return UserService.updateSocialAccount({socialAccountId,pseudo,link}).then(
                success => {
                    commit('updateSocialAccountSuccess',success)
                    return Promise.resolve(success)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        deleteSocialAccount({commit},socialAccountId){
            return UserService.deleteSocialAccount(socialAccountId).then(
                success => {
                    commit('deleteSocialAccountSuccess',socialAccountId)
                    return Promise.resolve(success)
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        replaceSocialAccount({commit}, {userId,socialId,socialAccountId,pseudo,link}){
            UserService.deleteSocialAccount(socialAccountId).then(
                () => {
                    return UserService.addSocialAccount({userId,socialId,pseudo,link}).then(
                        success =>{
                            commit("replaceSocialAccountSuccess",{socialAccount:success,socialAccountId})
                            return Promise.resolve(success)
                        },
                        error =>{
                            console.log(error)
                            return Promise.reject(error)
                        }
                    )
                },
                error => {
                    console.log(error)
                    return Promise.reject(error)
                }
            )
        },
        getFavorites({commit}){
            return UserService.getFavorites().then(
                success => {
                    commit("fetchUserFavorites",success)
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
        fetchUserSuccess(state,user){
            state.user = user
        },
        fetchSocialsAccountsSuccess(state,socialsAccounts){
            state.socialsAccounts = socialsAccounts
        },
        fetchSocialsSuccess(state,socials){
            state.socials = socials
        },
        fetchClubsSuccess(state,clubs){
            state.clubs = clubs
        },
        fetchUserClubsSuccess(state,userClubs){
            state.userClubs = userClubs
        },
        modifyUserSuccess(state,user){
            state.user = user
        },
        addSocialAccountSuccess(state, socialAccount){
            state.socialsAccounts.push(socialAccount)
        },
        updateSocialAccountSuccess(state,socialAccount){
            state.socialsAccounts = state.socialsAccounts.map((a)=> {
                if(a.socialAccountId != socialAccount.socialAccountId){
                    return a
                }return socialAccount})
        },
        deleteSocialAccountSuccess(state,socialAccountId){
            state.socialsAccounts = state.socialsAccounts.filter((a)=> a.socialAccountId!=socialAccountId)
        },
        replaceSocialAccountSuccess(state,{socialAccount,socialAccountId}){
            state.socialsAccounts = state.socialsAccounts.map((social)=> {
                if(social.socialAccountId != socialAccountId){
                    return social
                }
                return socialAccount
            })
        },
        fetchUserFavorites(state,favorites){
            state.favorites = favorites
        }
    }
}
