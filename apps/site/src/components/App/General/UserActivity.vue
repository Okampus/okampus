<template>
    <div class="flex gap-3 items-start">
        <router-link :to="user.id ? `/user/${user.id}` : 'users'" class="shrink-0">
            <ProfileAvatar :size="3" :avatar="user.avatar" :name="fullname(user)" />
        </router-link>
        <div class="flex flex-col">
            <div class="flex gap-1 items-center text-1">
                <router-link
                    :to="user.id ? `/user/${user.id}` : 'users'"
                    class="text-sm font-semibold"
                    :class="
                        labelName
                            ? 'px-1.5 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400 rounded-full'
                            : 'hover:underline'
                    "
                    >{{ fullname(user) }}</router-link
                >
                <TipPopper :tip="getRole(user)[$i18n.locale]">
                    <i class="ml-1" :class="`fa fa-${getRole(user).icon}`" />
                </TipPopper>
            </div>

            <div class="text-sm text-4">
                <div v-if="customString">
                    {{ customString }}
                </div>
                <div v-else>
                    {{ actionText }}
                    <TipRelativeDateModified :created-at="actionAt" :modified-at="actionAtModified" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import TipPopper from '@/components/UI/Tip/TipPopper.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import TipRelativeDateModified from '@/components/UI/Tip/TipRelativeDateModified.vue'

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
        actionAtModified: {
            type: [String, Date],
            default: null,
        },
        customString: {
            type: String,
            default: null,
        },
        labelName: {
            type: Boolean,
            default: false,
        },
    })
</script>
