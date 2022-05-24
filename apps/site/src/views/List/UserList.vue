<template>
    <ListPage :base-route="baseRoute" :route-name="routeName" :store-callback="users.getUsers">
        <template #default="{ items }">
            <div class="flex flex-col gap-4">
                <UserCard v-for="user in items" :key="user.userId" :user="user" />
            </div>
        </template>
    </ListPage>
</template>

<script setup>
    import { useUsersStore } from '@/store/users.store'
    import UserCard from '@/components/App/ListCard/UserCard.vue'
    import ListPage from '../App/ListPage.vue'

    const users = useUsersStore()

    defineProps({
        baseRoute: {
            type: String,
            default: '/users',
        },
        routeName: {
            type: String,
            default: 'users',
        },
    })
</script>
