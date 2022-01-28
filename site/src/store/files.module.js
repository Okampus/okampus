import { uniqBy } from 'lodash'
import FilesService from '../services/files.service'
import { ITEMS_PER_PAGE } from './constants'

const initialState = {
    studyDocList: [],
    infoDocList: [],
    studyDocFileTree: [],
    infoDocFileTree: [],
    studyDocListPage: 1,
    infoDocListPage: 1,
}

export const files = {
    namespaced: true,
    state: initialState,
    actions: {
        searchStudyDocs({ commit, state }, query) {
            return FilesService.getStudyDocList({
                page: state.studyDocListPage,
                itemsPerPage: ITEMS_PER_PAGE,
                ...query,
            }).then(
                (studyDocs) => {
                    commit('searchStudyDocsSuccess', studyDocs)
                    return Promise.resolve(studyDocs)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        newSearchStudyDocs({ commit, state }, query) {
            commit('refreshStudyDocs')
            return FilesService.getStudyDocList({
                page: state.studyDocListPage,
                itemsPerPage: ITEMS_PER_PAGE,
                ...query,
            }).then(
                (studyDocs) => {
                    commit('searchStudyDocsSuccess', studyDocs)
                    return Promise.resolve(studyDocs)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },

        searchInfoDocs({ commit, state }, query) {
            return FilesService.getInfoDocList({
                page: state.infoDocListPage,
                itemsPerPage: ITEMS_PER_PAGE,
                ...query,
            }).then(
                (infoDocs) => {
                    commit('searchStudyDocsSuccess', infoDocs)
                    return Promise.resolve(infoDocs)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },

        newSearchInfoDocs({ commit, state }, query) {
            commit('refreshStudyDocs')
            return FilesService.getInfoDocList({
                page: state.infoDocListPage,
                itemsPerPage: ITEMS_PER_PAGE,
                ...query,
            }).then(
                (infoDocs) => {
                    commit('searchStudyDocsSuccess', infoDocs)
                    return Promise.resolve(infoDocs)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },

        addStudyDoc(_, studyDoc) {
            return FilesService.addStudyDoc(studyDoc).then(
                (newStudyDoc) => Promise.resolve(newStudyDoc),
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },

        addInfoDoc(_, infoDoc) {
            return FilesService.addInfoDoc(infoDoc).then(
                (newInfoDoc) => {
                    Promise.resolve(newInfoDoc)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },

        getStudyDocTree({ commit }, query) {
            return FilesService.getStudyDocTree(query).then(
                (fileTree) => {
                    commit('getStudyDocsTreeSuccess', fileTree)
                    Promise.resolve(fileTree)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },

        getInfoDocTree({ commit }, query) {
            return FilesService.getInfoDocTree(query).then(
                (fileTree) => {
                    commit('getInfoDocsTreeSuccess', fileTree)
                    Promise.resolve(fileTree)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },

        downloadFile(_, query) {
            return FilesService.downloadFile(query)
        },
    },
    mutations: {
        refreshStudyDocs(state) {
            state.studyDocList = []
            state.studyDocListPage = 1
        },
        refreshInfoDocs(state) {
            state.infoDocList = []
            state.infoDocListPage = 1
        },
        searchStudyDocsSuccess(state, studyDocs) {
            state.studyDocList = uniqBy([...state.studyDocList, ...studyDocs], 'studyDocId')
            state.studyDocListPage++
        },
        searchInfoDocsSuccess(state, infoDocs) {
            state.infoDocList = uniqBy([...state.infoDocList, ...infoDocs], 'infoDocId')
            state.infoDocListPage++
        },
        getStudyDocsTreeSuccess(state, fileTree) {
            state.studyDocFileTree = fileTree
        },
        getInfoDocsTreeSuccess(state, fileTree) {
            state.infoDocFileTree = fileTree
        },
    },
}
