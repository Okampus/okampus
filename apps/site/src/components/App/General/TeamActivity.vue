<template>
    <div class="flex items-start gap-3">
        <ProfileAvatar
            :id="team.id"
            :type="type"
            :size="avatarSize"
            :avatar="team.avatar"
            :name="team.name"
            :clickable="!deactivateClick"
        />
        <div class="flex flex-col">
            <slot v-if="$slots.title" name="title" />
            <router-link
                v-else
                :to="team.id ? `/club/${team.id}` : '/clubs'"
                :="deactivateClick ? { custom: true } : { class: 'hover:underline' }"
            >
                <div class="font-semibold line-clamp-1">{{ team.name }}</div>
            </router-link>

            <div v-if="$slots.subtitle || subtitle" class="text-4 text-sm line-clamp-1">
                <slot v-if="$slots.subtitle" name="subtitle" />
                <template v-else>{{ subtitle }}</template>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    defineProps({
        team: {
            type: Object,
            required: true,
        },
        type: {
            type: String,
            default: 'team',
        },
        subtitle: {
            type: String,
            default: null,
        },
        avatarSize: {
            type: Number,
            default: 3,
        },
        deactivateClick: {
            type: Boolean,
            default: false,
        },
    })
</script>
