import $axios from '@/shared/config/axios.config'
import { defineStore } from 'pinia'

import { onData, onItems } from '@/utils/store'

export const useUsersStore = defineStore('users', {
    state: () => ({
        users: [],
    }),
    actions: {
        async replaceUsers(users, pageInfo) {
            this.users = users
            await users.forEach(async (element, idx) => {
                this.users[idx] = await this.getUserClub(element)
            })
            return { items: users, pageInfo }
        },
        replaceUser(user) {
            const index = this.users.findIndex((u) => u.userId === user.userId)
            if (index !== -1) {
                this.users[index] = user
            } else {
                this.users.push(user)
            }
            return user
        },
        // upsertUser(user) {
        //     this.users = upsert(this.users, user, 'userId')
        //     return user
        // },
        async getUsers(query) {
            return await $axios.get('users', { params: query }).then(onItems(this.replaceUsers))
        },
        async getUser(id) {
            return await $axios.get(`users/${id}`).then(onData(this.replaceUser))
        },
        async updateUser(id, user) {
            return await $axios.patch(`users/${id}`, user).then(onData(this.replaceUser))
        },
        async getUserClub(user) {
            return await $axios
                .get(`teams/memberships/${user.userId}`)
                .then((res) => ({ ...user, clubs: res.data.items }))
        },
        async changeImage(formData, uploadType, config = {}) {
            return await $axios
                .put(`users/${uploadType}`, formData, {
                    ...config,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(onData(this.replaceUser))
        },
    },
})
