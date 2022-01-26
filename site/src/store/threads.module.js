import router from '@/router'
import ThreadService from '@/services/threads.service'
import { COMMENT, POST, REPLY } from '@/shared/types/content-kind.enum'
import { groupBy, uniqBy } from 'lodash'
import { ITEMS_PER_PAGE, settleQuery } from './constants'

const initialState = {
    currentThread: null,
    threadList: [],
    threadListPage: 1,
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
    console.log('APPLY', func, targetContent)

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
        getCurrentThread(state) {
            return state.currentThread
        },
        getThreadList(state) {
            return state.threadList
        },
    },
    actions: {
        getThreadList: ({ commit, state }, query) =>
            settleQuery(
                { commit, mutation: 'getThreadListSuccess' },
                ThreadService.getThreadList({
                    page: state.threadListPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                    ...query,
                }),
            ),
        addThread: ({ commit }, thread) =>
            settleQuery({ commit, mutation: 'addThreadSuccess' }, ThreadService.addThread(thread)),
        getThread: async ({ commit }, id) => {
            await settleQuery({ commit, mutation: 'getThreadSuccess' }, ThreadService.getThread(id))
            await settleQuery(
                { commit, mutation: 'getThreadInteractionsSuccess' },
                ThreadService.getThreadInteractions(id),
            )
        },
        updateThread: ({ commit }, thread) =>
            settleQuery({ commit, mutation: 'updateThreadSuccess' }, ThreadService.updateThread(thread)),
        deleteThread: ({ commit }, id) =>
            settleQuery({ commit, mutation: 'deleteThreadSuccess' }, ThreadService.deleteThread(id)),
        forceDeleteThread: ({ commit }, id) =>
            settleQuery({ commit, mutation: 'deleteThreadSuccess' }, ThreadService.deleteThread(id, true)),
        addReply: ({ commit }, reply) =>
            settleQuery({ commit, mutation: 'addReplySuccess' }, ThreadService.addReply(reply)),
        addComment: ({ commit }, comment) =>
            settleQuery({ commit, mutation: 'addCommentSuccess' }, ThreadService.addComment(comment)),
        updateContent: ({ commit }, { contentId, body }) =>
            settleQuery(
                { commit, mutation: 'updateContentSuccess' },
                ThreadService.updateContent(contentId, body),
            ),
        deleteContent: ({ commit }, id) =>
            settleQuery({ commit, mutation: 'deleteContentSuccess' }, ThreadService.deleteContent(id)),
        forceDeleteContent: ({ commit }, id) =>
            settleQuery({ commit, mutation: 'deleteContentSuccess' }, ThreadService.deleteContent(id, true)),
        voteContent: ({ commit }, { contentId, value }) =>
            settleQuery(
                { commit, mutation: 'voteContentSuccess' },
                ThreadService.voteContent(contentId, value),
            ),
        addFavorite: ({ commit }, contentId) =>
            settleQuery({ commit, mutation: 'addFavoriteSuccess' }, ThreadService.addFavorite(contentId)),
        deleteFavorite: ({ commit }, content) =>
            settleQuery(
                {
                    mutation: () => {
                        commit('deleteFavoriteSuccess', content)
                    },
                },
                ThreadService.deleteFavorite(content.contentId),
            ),
    },
    mutations: {
        refreshThreadList(state) {
            state.threadList = []
            state.threadListPage = 1
        },
        getThreadListSuccess(state, threads) {
            state.threadList = uniqBy([...state.threadList, ...threads], 'contentMasterId')
            state.threadListPage += 1
        },
        addThreadSuccess(state, thread) {
            state.threadList.unshift(thread)
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
            state.threadList = state.threadList.filter((thread) => thread.contentMasterId !== contentMasterId)
        },
        addReplySuccess(state, reply) {
            state.currentThread.replies.unshift(reply)
        },
        addCommentSuccess(state, comment) {
            console.log('ADD COMMENT SUCCESS', comment)
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
            console.log(favorite)
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
