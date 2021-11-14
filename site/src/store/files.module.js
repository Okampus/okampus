import FileService from '../services/files.service'
import { uniqBy } from '@/utils/uniqBy'

const initialState = { studyDocs: [] }

export const files = {
  namespaced: true,
  state: initialState,
  actions: {
    searchStudyDocs ({ commit }, query) {
      return FileService.getStudyDocs(query).then(
        studyDocs => {
          commit('searchStudyDocsSuccess', studyDocs)
          return Promise.resolve(studyDocs)
        },
        error => {
          console.log(error)
          return Promise.reject(error)
        }
      )
    },
    newSearchStudyDocs ({ commit }, query) {
      commit('refreshStudyDocs')
      return FileService.getStudyDocs({ page: 1, ...query }).then(
        studyDocs => {
          commit('searchStudyDocsSuccess', studyDocs)
          return Promise.resolve(studyDocs)
        },
        error => {
          console.log(error)
          return Promise.reject(error)
        }
      )
    },
    addStudyDoc ({ commit }, studyDoc) {
      return FileService.addStudyDoc(studyDoc).then(
        newStudyDoc => {
          commit('addStudyDocSuccess', newStudyDoc)
          return Promise.resolve(newStudyDoc)
        },
        error => {
          console.log(error)
          return Promise.reject(error)
        }
      )
    }
  },
  mutations: {
    refreshStudyDocs (state) {
      state.studyDocs = []
      state.page = 1
    },
    searchStudyDocsSuccess (state, studyDocs) {
      state.studyDocs = uniqBy([...state.studyDocs, ...studyDocs], (a, b) => a.id === b.id)
      state.page++
    },
    addStudyDocSuccess (state, newStudyDoc) {
      state.studyDocs.unshift(newStudyDoc)
    }
  }
}
