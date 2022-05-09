import $axios from '@/shared/config/axios.config'
import { defineStore } from 'pinia'

import { upsert } from '@/utils/arrays'
import { onData, onItems } from '@/utils/store'

import ContentInteractions from '@/models/content-interactions'
import { COMMENT, ENDPOINTS, POST, REPLY } from '@/shared/types/content-kinds.enum'
import threadTypes from '@/shared/types/thread-types.enum'

import { isNil } from 'lodash'
import { computed } from 'vue'
import { useAuthStore } from './auth.store'

const $id = (thread) => thread.contentMasterId

const sameThread = (id) => (thread) => $id(thread) === id
const differentThread = (id) => (thread) => $id(thread) !== id

const sameContent = (id) => (content) => content.contentId === id
const differentContent = (id) => (content) => content.contentId !== id

// TODO: optimize content operations with currentThread? & refactor
export const useThreadsStore = defineStore('threads', {
    state: () => ({
        threads: [],
    }),

    actions: {
        initThread({ threadId, thread = null }) {
            thread = thread ?? this.threads.find(sameThread(threadId))

            thread.participants = thread.participants.map((participant) => ({
                ...participant,
                fullname: participant.firstname + ' ' + participant.lastname,
            }))
            thread.getUser = (userId) =>
                thread.participants?.find((participant) => participant.userId === userId)

            thread.lastUpdatedAt = computed(() => thread.post.lastEdit.createdAt)
            thread.lastUpdatedBy = computed(() => thread.getUser(thread.post.lastEdit.editedBy))

            thread._type = threadTypes[thread.type]

            thread.userSolved = !isNil(thread.opValidatedWith)
            thread.adminSolved = !isNil(thread.adminValidatedWith)

            thread.contents = thread.contents?.map((content) => this.initContent(thread, content)) ?? []

            thread._post = computed(() =>
                thread.contents?.length
                    ? thread.contents.find((content) => content.kind === POST)
                    : thread.post,
            )
            thread.replies = computed(() => thread.contents?.filter((content) => content.kind === REPLY))
            this.getThreadInteractions(thread.contentMasterId)

            return thread
        },
        initContent(thread, content) {
            content.contentMasterId = thread.contentMasterId

            content.interactions = new ContentInteractions()
            content.comments = computed(() =>
                thread.contents?.filter(
                    (c) => c.parent.contentId === content.contentId && c.kind === COMMENT,
                ),
            )

            content._author =
                typeof content.author === 'object' ? content.author : thread.getUser(content.author)

            content.lastUpdatedAt = computed(() => content.lastEdit.createdAt)
            content.lastUpdatedBy = computed(() => thread.getUser(content.lastEdit.editedBy))

            content.editing = false

            return content
        },
        getThreadContainingContent(contentId) {
            return this.threads.find((thread) => thread.contents?.some(sameContent(contentId)))
        },
        getThreadById(threadId) {
            return this.threads.find(sameThread(parseInt(threadId)))
        },
        replaceThread(thread) {
            const index = this.threads.findIndex(sameThread($id(thread)))
            if (index !== -1) {
                this.threads[index] = thread
            } else {
                this.threads.push(thread)
            }
            this.initThread({ threadId: $id(thread) })
            return thread
        },
        // upsertThread(thread) {
        //     upsert(this.threads, thread, sameThread($id(thread)), {
        //         beforeUpdate: (thread) => {
        //             const { contents, ...$thread } = thread
        //             contents.forEach((content) => this.upsertContent($id($thread), content))
        //             return $thread
        //         },
        //         onInsert: (thread) => this.initThread({ threadId: $id(thread) }),
        //     })
        //     return thread
        // },
        upsertContent(threadId, content) {
            const thread = this.threads.find(sameThread(threadId))
            if (thread) {
                upsert(thread.contents, content, sameContent(content.contentId), {
                    onAfter: () => this.initContent(thread, content),
                })
            } else {
                this.getThread(threadId)
            }

            return content
        },
        removeThread(threadId) {
            this.threads = this.threads.filter(differentThread(threadId))
            return true
        },
        removeContent({ contentId, ...content }) {
            const auth = useAuthStore()
            const thread = this.threads.find((thread) => thread?.contents?.some(sameContent(contentId)))
            if (!auth.user.roles.includes('admin')) {
                if (!isNil(thread) && !(thread.contents.find(sameContent(contentId)).kind === POST)) {
                    thread.contents = thread.contents.filter(differentContent(contentId))
                }
            } else {
                this.updateContent(thread.contentMasterId, { contentId, ...content })
            }
            return true
        },
        replaceThreads(threads, pageInfo) {
            if (threads.length) {
                this.threads = threads.map((thread) => {
                    thread.post.author.fullname =
                        thread.post.author.firstname + ' ' + thread.post.author.lastname
                    return thread
                })
            }
            return { items: threads, pageInfo }
        },
        addInteraction(thread, type, interaction, newInteraction = false) {
            console.log('addInteraction', type, interaction, newInteraction)
            if (isNil(thread)) {
                thread = this.threads.find((thread) =>
                    thread.contents?.some(sameContent(interaction.content.contentId)),
                )
            }

            const content = thread.contents.find(sameContent(interaction.content.contentId))

            if (type == 'votes' && newInteraction) {
                content.upvotes += content.interactions.voted === 1 ? -1 : interaction.value === 1 ? 1 : 0
                content.downvotes += content.interactions.voted === -1 ? -1 : interaction.value === -1 ? 1 : 0
            }

            content.interactions.addInteraction(type, interaction)
            return content
        },
        removeInteraction(type, interaction) {
            const content = this.threads
                .find((thread) => thread.contents?.some(sameContent(interaction.contentId)))
                .contents.find(sameContent(interaction.contentId))

            content.interactions.removeInteraction(type, interaction)
            return content
        },
        applyInteractions(threadId, threadInteractions) {
            const thread = this.threads.find(sameThread(threadId))
            for (const [type, interactions] of Object.entries(threadInteractions)) {
                for (const interaction of interactions) {
                    this.addInteraction(thread, type, interaction)
                }
            }
            return thread
        },
        editingContent(contentId, editing = true) {
            const thread = this.getThreadContainingContent(contentId)
            if (thread) {
                const content = thread.contents.find(sameContent(contentId))
                content.editing = editing
                return content
            } else {
                return null
            }
        },
        async getThreadInteractions(id) {
            return await $axios
                .get(`threads/${id}/interactions`)
                .then(onData((data) => this.applyInteractions(id, data)))
        },

        async getThreads(query) {
            return await $axios.get('threads', { params: query }).then(onItems(this.replaceThreads))
        },

        async addThread(thread) {
            return await $axios.post('threads', { ...thread, assignees: [] }).then(onData(this.replaceThread))
        },
        async getThread(id) {
            return await $axios.get(`threads/${id}`).then(onData(this.replaceThread))
        },
        async updateThread(thread) {
            return await $axios.patch(`threads/${$id(thread)}`, thread).then(onData(this.replaceThread))
        },
        // async deleteThread(id) {
        //     // TODO: check role; if admin, don't remove from store
        //     return await $axios.patch(`threads/${id}`, { hidden: true }).then(() => this.removeThread(id))
        // },
        // async forceDeleteThread(id) {
        //     return await $axios.delete(`threads/${id}`).then(() => this.removeThread(id))
        // },

        async addContent(threadId, content, kind) {
            return await $axios
                .post(`contents/${ENDPOINTS[kind]}/`, { ...content, contentMasterType: 'thread' })
                .then(onData((newContent) => this.upsertContent(threadId, newContent)))
        },
        async updateContent(threadId, content) {
            return await $axios
                .patch(`contents/${content.contentId}`, { body: content.body })
                .then(onData((newContent) => this.upsertContent(threadId, newContent)))
        },
        async deleteContent(id) {
            return await $axios.patch(`contents/${id}`, { hidden: true }).then(onData(this.removeContent))
        },
        async forceDeleteContent(id) {
            return await $axios.delete(`contents/${id}`).then(() => this.removeContent({ contentId: id }))
        },

        // TODO: add interaction before, and then remove in case of an error (instead of waiting for the query to be resolved)
        async voteContent(id, value) {
            return await $axios
                .put(`votes/${id}`, { value })
                .then(onData((vote) => this.addInteraction(null, 'votes', vote, true)))
        },
        async addFavorite(contentId) {
            return await $axios
                .post(`favorites/${contentId}`)
                .then(onData((favorite) => this.addInteraction(null, 'favorites', favorite)))
        },
        async removeFavorite(contentId) {
            return await $axios
                .delete(`favorites/${contentId}`)
                .then(onData(() => this.removeInteraction('favorites', { contentId })))
        },
    },
})
