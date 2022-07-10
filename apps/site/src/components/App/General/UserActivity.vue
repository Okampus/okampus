<template>
    <div class="flex gap-3 items-start">
        <ProfileAvatar :size="3" :avatar="user.avatar" :name="fullname(user)" />
        <div class="flex flex-col">
            <div class="flex gap-1 items-center text-0">
                <div class="text-sm font-semibold">{{ fullname(user) }}</div>
                <TipPopper :tip="getRole(user)[$i18n.locale]">
                    <i class="ml-1" :class="`fa fa-${getRole(user).icon}`" />
                </TipPopper>
            </div>

            <div class="text-sm text-4">
                <div v-if="customString">
                    {{ customString }}
                </div>
                <div v-else>{{ actionText }} <TipRelativeDate :date="actionAt" /></div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import TipPopper from '@/components/UI/Tip/TipPopper.vue'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'

    import { fullname, getRole } from '@/utils/users'

    defineProps({
        user: {
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
