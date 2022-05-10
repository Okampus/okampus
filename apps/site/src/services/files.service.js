import $axios from '../shared/config/axios.config'

class FilesService {
    getStudyDocList(query) {
        return $axios
            .get('files/study-docs', { params: query, headers: { Accept: 'application/json' } })
            .then((res) => res.data.items)
    }

    getInfoDocList(query) {
        return $axios
            .get('/files/info-docs', { params: query, headers: { Accept: 'application/json' } })
            .then((res) => res.data.items)
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

    addInfoDoc(data) {
        return $axios
            .post('/files/info-docs', data, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => res.data)
    }

    getStudyDocTree(query) {
        return $axios
            .get('/files/study-docs/categories', {
                params: { categories: query },
                headers: { Accept: 'application/json' },
            })
            .then((res) => res.data)
    }

    getInfoDocTree(query) {
        return $axios
            .get('/files/info-docs/categories', {
                params: { categories: query },
                headers: { Accept: 'application/json' },
            })
            .then((res) => res.data)
    }

    downloadFile({ url, label }) {
        return $axios.get(url, { responseType: 'blob' }).then((response) => {
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
