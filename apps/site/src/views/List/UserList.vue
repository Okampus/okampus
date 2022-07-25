<template>
    <ListPage :route-base="routeBase" :route-name="routeName" :callback="users.getUsers" :type="USER">
        <template #default="{ items }">
            <div class="centered-container flex flex-col flex-wrap gap-4 xs:flex-row">
                <UserCard v-for="user in items" :key="user.id" :user="user" />
            </div>
        </template>
    </ListPage>
</template>

<script setup>
    import UserCard from '@/components/App/ListCard/UserCard.vue'
    import ListPage from '@/views/App/ListPage.vue'

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
