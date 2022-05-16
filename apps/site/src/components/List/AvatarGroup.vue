<template>
    <div class="flex gap-4 items-center">
        <div class="flex" :class="{ 'gap-1': !compact }">
            <div v-for="(_, i) in Array(iconNumber)" :key="i" :class="{ '-m-2': compact }">
                <UserAvatar :username="users[i].fullname" :size="iconSize" />
            </div>
        </div>

        <span v-if="users.length - iconNumber > 0" class="truncate"
            >+ {{ users.length - iconNumber }} utilisateurs</span
        >
    </div>
</template>

<script setup>
    import UserAvatar from '../User/UserAvatar.vue'
    defineProps({
        users: { type: Array, required: true },
        iconNumber: { type: Number, default: 3 },
        iconSize: { type: Number, default: 3 },
        compact: { type: Boolean, default: true },
    })
</script>
