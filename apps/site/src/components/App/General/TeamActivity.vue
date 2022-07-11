<template>
    <div class="flex gap-3 items-start">
        <router-link :to="team.teamId ? `/club/${team.teamId}` : '/clubs'">
            <ProfileAvatar :size="3" :avatar="team.avatar" :name="team.name" />
        </router-link>
        <div class="flex flex-col">
            <router-link
                class="text-sm font-semibold hover:underline line-clamp-1"
                :to="team.teamId ? `/club/${team.teamId}` : '/clubs'"
            >
                {{ team.name }}
            </router-link>

            <div class="text-sm line-clamp-1 text-4">
                <template v-if="customString">
                    {{ customString }}
                </template>
                <template v-else>{{ actionText }} <TipRelativeDate :date="actionAt" /></template>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    // import TipPopper from '@/components/UI/Tip/TipPopper.vue'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'

    defineProps({
        team: {
            type: Object,
            required: true,
        },
        actionText: {
            type: String,
            default: null,
        },
        actionAt: {
            type: [String, Date],
            default: null,
        },
        customString: {
            type: String,
            default: null,
        },
    })
</script>
