import router from '@/router'
import ThreadsService from '@/services/threads.service'
import { COMMENT, POST, REPLY } from '@/shared/types/content-kind.enum'
import { groupBy, uniqBy } from 'lodash'
import { ITEMS_PER_PAGE, settleQuery } from './constants'

const initialState = {
    currentThread: null,
    threads: [],
    threadsPage: 1,
}

const updateThreadChildren = (thread) => {
    const { children, ...post } = thread.post
    const grouped = groupBy(children, 'kind')
    thread.post = post
    thread.post.author = thread.contributors.find((contributor) => contributor.userId === thread.post.author)
    thread.replies = grouped[REPLY] ?? []
    thread.replies.forEach((reply) => {
        reply.author = thread.contributors.find((contributor) => contributor.userId === reply.author)
        reply.comments = reply.children
        delete reply.children
        reply.comments.forEach((comment) => {
            comment.author = thread.contributors.find((contributor) => contributor.userId === comment.author)
        })
    })
    thread.post.comments = grouped[COMMENT] ?? []
    thread.post.comments.forEach((comment) => {
        comment.author = thread.contributors.find((contributor) => contributor.userId === comment.author)
    })
    return thread
}

const applyFuncOnContent = (func, targetContent, thread) => {
    if (targetContent.kind === POST) {
        if (func === 'delete') {
            delete thread.post
        } else {
            return func(thread.post)
        }
    } else if (targetContent.kind === REPLY) {
        if (func === 'delete') {
            thread.replies = thread.replies.filter((reply) => reply.contentId !== targetContent.contentId)
        } else {
            return func(thread.replies.find((reply) => reply.contentId === targetContent.contentId))
        }
    } else if (targetContent.kind === COMMENT) {
        if (targetContent.parent.kind === POST) {
            if (func === 'delete') {
                thread.post.comments = thread.post.comments.filter(
                    (comment) => comment.contentId !== targetContent.contentId,
                )
            } else {
                return func(
                    thread.post.comments.find((comment) => comment.contentId === targetContent.contentId),
                )
            }
        } else if (targetContent.parent.kind === REPLY) {
            if (func === 'delete') {
                const reply = thread.replies.find(
                    (reply) => reply.contentId === targetContent.parent.contentId,
                )
                reply.comments = reply.comments.filter(
                    (comment) => comment.contentId !== targetContent.contentId,
                )
            } else {
                return func(
                    thread.replies
                        .find((reply) => reply.contentId === targetContent.parent.contentId)
                        .comments.find((comment) => comment.contentId === targetContent.contentId),
                )
            }
        }
    }
}

export const threads = {
    namespaced: true,
    state: initialState,
    getters: {
        getThreads(state) {
            return state.threads
        },
        getCurrentThread(state) {
            return state.currentThread
        },
    },
    actions: {
        getThreads: ({ commit, state }, query) =>
            settleQuery(
                { commit, mutation: 'getThreadsSuccess' },
                ThreadsService.getThreads({
                    page: state.threadsPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                    ...query,
                }),
            ),
        addThread: ({ commit }, thread) =>
            settleQuery({ commit, mutation: 'addThreadSuccess' }, ThreadsService.addThread(thread)),
        getThread: async ({ commit }, id) => {
            await settleQuery({ commit, mutation: 'getThreadSuccess' }, ThreadsService.getThread(id))
            await settleQuery(
                { commit, mutation: 'getThreadInteractionsSuccess' },
                ThreadsService.getThreadInteractions(id),
            )
        },
        updateThread: ({ commit }, thread) =>
            settleQuery({ commit, mutation: 'updateThreadSuccess' }, ThreadsService.updateThread(thread)),
        deleteThread: ({ commit }, id) =>
            settleQuery({ commit, mutation: 'deleteThreadSuccess' }, ThreadsService.deleteThread(id)),
        forceDeleteThread: ({ commit }, id) =>
            settleQuery({ commit, mutation: 'deleteThreadSuccess' }, ThreadsService.deleteThread(id, true)),
        addReply: ({ commit }, reply) =>
            settleQuery({ commit, mutation: 'addReplySuccess' }, ThreadsService.addReply(reply)),
        addComment: ({ commit }, comment) =>
            settleQuery({ commit, mutation: 'addCommentSuccess' }, ThreadsService.addComment(comment)),
        updateContent: ({ commit }, { contentId, body }) =>
            settleQuery(
                { commit, mutation: 'updateContentSuccess' },
                ThreadsService.updateContent(contentId, body),
            ),
        deleteContent: ({ commit }, id) =>
            settleQuery({ commit, mutation: 'deleteContentSuccess' }, ThreadsService.deleteContent(id)),
        forceDeleteContent: ({ commit }, id) =>
            settleQuery({ commit, mutation: 'deleteContentSuccess' }, ThreadsService.deleteContent(id, true)),
        voteContent: ({ commit }, { contentId, value }) =>
            settleQuery(
                { commit, mutation: 'voteContentSuccess' },
                ThreadsService.voteContent(contentId, value),
            ),
        addFavorite: ({ commit }, contentId) =>
            settleQuery({ commit, mutation: 'addFavoriteSuccess' }, ThreadsService.addFavorite(contentId)),
        deleteFavorite: ({ commit }, content) =>
            settleQuery(
                {
                    mutation: () => {
                        commit('deleteFavoriteSuccess', content)
                    },
                },
                ThreadsService.deleteFavorite(content.contentId),
            ),
    },
    mutations: {
        setCurrentThread(state, thread) {
            state.currentThread = thread
        },
        refreshThreads(state) {
            state.threads = []
            state.threadsPage = 1
        },
        getThreadsSuccess(state, threads) {
            state.threads = uniqBy([...state.threads, ...threads], 'contentMasterId')
            state.threadsPage++
        },
        addThreadSuccess(state, thread) {
            state.threads.unshift(thread)
        },
        getThreadSuccess(state, thread) {
            state.currentThread = updateThreadChildren(thread)
        },
        getThreadInteractionsSuccess(state, threadInteractions) {
            function initContentInteractions(content) {
                content.userFavorited = false
                content.userReported = false
                content.userVote = 0
                content.userReactions = []
            }

            initContentInteractions(state.currentThread.post)
            state.currentThread.post.comments.forEach(initContentInteractions)
            state.currentThread.replies.forEach((reply) => {
                initContentInteractions(reply)
                reply.comments.forEach((comment) => {
                    initContentInteractions(comment)
                })
            })

            function applyInteraction(interaction) {
                return (content) => {
                    if (interaction.type === 'favorite') {
                        content.userFavorited = true
                    } else if (interaction.type === 'report') {
                        content.userReported = true
                    } else if (interaction.type === 'vote') {
                        content.userVote = interaction.value
                    } else if (interaction.type === 'reaction') {
                        content.userReactions.push(interaction.reaction)
                    }
                }
            }

            let allInteractions = [
                {
                    interactions: threadInteractions.favorites,
                    type: 'favorite',
                },
                {
                    interactions: threadInteractions.votes,
                    type: 'vote',
                },
                {
                    interactions: threadInteractions.reactions,
                    type: 'reaction',
                },
                {
                    interactions: threadInteractions.reports,
                    type: 'report',
                },
            ]

            allInteractions = allInteractions
                .map((typeInteract) =>
                    typeInteract.interactions.map((interact) => ({
                        ...interact,
                        type: typeInteract.type,
                    })),
                )
                .flat()

            for (const interaction of allInteractions) {
                applyFuncOnContent(applyInteraction(interaction), interaction.content, state.currentThread)
            }
        },
        updateThreadSuccess(state, newThread) {
            state.currentThread = {
                ...state.currentThread,
                ...updateThreadChildren(newThread),
            }
        },
        deleteThreadSuccess(state, { contentMasterId }) {
            if (state.currentThread.contentMasterId === contentMasterId) {
                state.currentThread = null
                router.push('/')
            }
            state.threads = state.threads.filter((thread) => thread.contentMasterId !== contentMasterId)
        },
        addReplySuccess(state, reply) {
            state.currentThread.replies.unshift(reply)
        },
        addCommentSuccess(state, comment) {
            if (comment.parent.kind === POST) {
                state.currentThread.post.comments.unshift(comment)
            } else if (comment.parent.kind === REPLY) {
                state.currentThread.replies
                    .find((reply) => reply.contentId === comment.parent.contentId)
                    .comments.unshift(comment)
            }
        },
        updateContentSuccess(state, content) {
            applyFuncOnContent(
                (c) => {
                    c.body = content.body
                    c.contentLastUpdatedAt = content.contentLastUpdatedAt
                    c.upvotes = content.upvotes
                    c.downvotes = content.downvotes
                },
                content,
                state.currentThread,
            )
        },
        deleteContentSuccess(state, content) {
            applyFuncOnContent('delete', content, state.currentThread)
        },
        voteContentSuccess(state, { content, value }) {
            applyFuncOnContent(
                (content) => {
                    if (value != content.userVote) {
                        content.upvotes += content.userVote === 1 ? -1 : value === 1 ? 1 : 0
                        content.downvotes += content.userVote === -1 ? -1 : value === -1 ? 1 : 0
                        content.userVote = value
                    }
                },
                content,
                state.currentThread,
            )
        },
        addFavoriteSuccess(state, favorite) {
            applyFuncOnContent(
                (content) => {
                    content.userFavorited = true
                },
                favorite.content,
                state.currentThread,
            )
        },
        deleteFavoriteSuccess(state, content) {
            applyFuncOnContent(
                (content) => {
                    content.userFavorited = false
                },
                content,
                state.currentThread,
            )
        },
    },
}
