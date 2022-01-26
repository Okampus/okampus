import $axios from '../shared/config/axios.config'

class FilesService {
    getStudyDocList(query) {
        return $axios.get('files/study-docs', { params: query }).then((res) => res.data.items)
    }

    addStudyDoc(data) {
        return $axios
            .post('files/study-docs', data, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => res.data)
    }

    downloadFile({ query, label }) {
        return $axios.get(`/files/uploads/${query}`, { responseType: 'blob' }).then((response) => {
            const blob = new Blob([response.data])
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = label
            link.click()
            URL.revokeObjectURL(link.href)
        })
    }
}

export default new FilesService()
