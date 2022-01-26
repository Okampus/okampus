import { uniqBy } from 'lodash'
import FilesService from '../services/files.service'
import { ITEMS_PER_PAGE } from './constants'

const initialState = {
    studyDocs: [],
    studyDocsPage: 1,
}

export const files = {
    namespaced: true,
    state: initialState,
    actions: {
        searchStudyDocs({ commit }, query) {
            return FilesService.getStudyDocs(query).then(
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
            return FilesService.getStudyDocs({
                page: state.studyDocsPage,
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
        getStudyDocs({ commit, state }, query) {
            return FilesService.getStudyDocs({
                page: state.studyDocsPage,
                itemsPerPage: ITEMS_PER_PAGE,
                ...query,
            }).then(
                (studyDocs) => {
                    commit('getStudyDocsSuccess', studyDocs)
                    return Promise.resolve(studyDocs)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
        addStudyDoc({ commit }, studyDoc) {
            return FilesService.addStudyDoc(studyDoc).then(
                (newStudyDoc) => {
                    commit('addStudyDocSuccess', newStudyDoc)
                    return Promise.resolve(newStudyDoc)
                },
                (error) => {
                    console.log(error)
                    return Promise.reject(error)
                },
            )
        },
    },
    mutations: {
        refreshStudyDocs(state) {
            state.studyDocs = []
            state.studyDocsPage = 1
        },
        searchStudyDocsSuccess(state, studyDocs) {
            state.studyDocs = uniqBy([...state.studyDocs, ...studyDocs], 'studyDocId')
            state.studyDocsPage++
        },
        getStudyDocsSuccess(state, studyDocs) {
            state.studyDocs = studyDocs
        },
        addStudyDocSuccess(state, newStudyDoc) {
            state.studyDocs.unshift(newStudyDoc)
        },
    },
}
