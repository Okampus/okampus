import $axios from '../shared/config/axios.config'

class ThreadsService {
    async getThreadList(query) {
        return await $axios.get('threads', { params: query }).then((res) => res.data.items)
    }

    async addThread({ tags, title, body, type, assignees }) {
        assignees = assignees ?? []
        tags = tags ?? []

        await Promise.all(
            tags.map((tag) =>
                $axios
                    .post('tags', {
                        color: 'orange',
                        name: tag,
                    })
                    .catch(() => {}),
            ),
        )

        return await $axios
            .post('threads', {
                tags,
                title,
                body,
                type,
                assignees,
            })
            .then((res) => res.data)
    }

    async getThread(id) {
        return await $axios.get(`threads/${id}`).then((res) => res.data)
    }

    async getThreadInteractions(id) {
        return await $axios.get(`threads/${id}/interactions`).then((res) => res.data)
    }

    async updateThread({ threadId, title, body }) {
        return await $axios
            .patch(`threads/${threadId}`, {
                title,
                body,
            })
            .then((res) => res.data)
    }

    deleteThread({ threadId, force = false }) {
        if (force) {
            return $axios.delete(`threads/${threadId}`)
        } else {
            return $axios.patch(`threads/${threadId}`, { archived: true })
        }
    }

    async addReply(reply) {
        return await $axios
            .post('contents/replies/', { ...reply, contentMasterType: 'thread' })
            .then((res) => res.data)
    }

    async addComment(comment) {
        return await $axios
            .post('contents/comments/', { ...comment, contentMasterType: 'thread' })
            .then((res) => res.data)
    }

    async updateContent(contentId, body) {
        return await $axios.patch(`contents/${contentId}`, { body }).then((res) => res.data)
    }

    deleteContent({ contentId, force = false }) {
        if (force) {
            return $axios.delete(`contents/${contentId}`)
        } else {
            return $axios.patch(`contents/${contentId}`, { archived: true })
        }
    }

    async voteContent(contentId, value) {
        return await $axios.put(`votes/${contentId}`, { value }).then((res) => res.data)
    }

    async addFavorite(contentId) {
        return await $axios.post(`favorites/${contentId}`).then((res) => res.data)
    }

    deleteFavorite(favoriteId) {
        return $axios.delete(`favorites/${favoriteId}`)
    }
}

export default new ThreadsService()
