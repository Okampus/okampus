<template>
    <ListPage :route-base="routeBase" :route-name="routeName" :callback="users.getUsers" :type="USER">
        <template #default="{ items }">
            <div class="flex flex-col gap-4">
                <UserCard v-for="user in items" :key="user.userId" :user="user" />
            </div>
        </template>
    </ListPage>
</template>

<script setup>
    import UserCard from '@/components/App/ListCard/UserCard.vue'
    import ListPage from '../App/ListPage.vue'

    import { useUsersStore } from '@/store/users.store'
    import { USER } from '@/shared/types/resource-names.enum'

    const users = useUsersStore()

    defineProps({
        routeBase: {
            type: String,
            default: '/users',
        },
        routeName: {
            type: String,
            default: 'users',
        },
    })
</script>
