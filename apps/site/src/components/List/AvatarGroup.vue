<template>
    <div class="flex gap-4 items-center ml-2">
        <div class="flex" :class="{ 'gap-1': !compact }">
            <div v-for="(_, i) in Array(numberShown)" :key="i" :class="{ '-ml-2': compact }">
                <ProfileAvatar :avatar="users[i].avatar" :name="fullname(users[i])" :size="iconSize" />
            </div>
        </div>

        <span v-if="users.length - numberShown > 0" class="truncate"
            >+ {{ users.length - numberShown }} utilisateurs</span
        >
    </div>
</template>

<script setup>
    import { fullname } from '@/utils/users'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    defineProps({
        users: {
            type: Array,
            required: true,
        },
        numberShown: {
            type: Number,
            default: (props) => (props.users.length < 3 ? props.users.length : 3),
        },
        iconSize: {
            type: Number,
            default: 3,
        },
        compact: {
            type: Boolean,
            default: true,
        },
    })
</script>
