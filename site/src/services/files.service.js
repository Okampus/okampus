import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

class PostsService {
    getStudyDocs (query) {
        return axios.get(`${API_URL}/files/study-docs`, { params: query, withCredentials: true }, ).then(
            (res) => {
                console.log(res.data.items)
                return res.data.items
            }
        )
    }

    addStudyDoc (data) {
        return axios.post(`${API_URL}/files/study-docs`, data, {
            withCredentials: true,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }).then(
            res => res.data
        )
    }

    downloadFile({ query, label }){
        return axios.get(`${API_URL}/files/uploads/${query}`, { responseType: 'blob', withCredentials: true, })
            .then(response => {
                const blob = new Blob([response.data])
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = label
                link.click()
                URL.revokeObjectURL(link.href)
            }).catch(console.error)
    }

}

export default new PostsService()
