<template>
    <div class="flex items-start gap-3">
        <router-link :to="team.teamId ? `/club/${team.teamId}` : '/clubs'" class="shrink-0">
            <ProfileAvatar :size="3" :avatar="team.avatar" :name="team.name" />
        </router-link>
        <div class="flex flex-col">
            <router-link
                class="text-sm font-semibold line-clamp-1 hover:underline"
                :to="team.teamId ? `/club/${team.teamId}` : '/clubs'"
            >
                {{ team.name }}
            </router-link>

            <div class="text-4 text-sm line-clamp-1">
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
