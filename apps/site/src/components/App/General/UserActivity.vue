<template>
    <div class="flex gap-4">
        <ProfileAvatar :id="user.id" :size="avatarSize" :avatar="user.avatar" :name="fullname(user)" />
        <div class="flex flex-col">
            <slot v-if="$slots.title" name="title" />
            <div v-else class="-mt-0.5 inline">
                <router-link
                    :to="user.id ? `/user/${user.id}` : 'users'"
                    class="text-0 text-base font-medium hover:underline"
                    >{{ fullname(user) }}</router-link
                >
                <i v-tooltip="getRole(user)[locale]" class="ml-2" :class="`fa fa-${getRole(user).icon}`" />
            </div>

            <div v-if="$slots.subtitle || subtitle" class="text-4 text-sm line-clamp-1">
                <slot v-if="$slots.subtitle" name="subtitle" />
                <template v-else>{{ subtitle }}</template>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import { fullname, getRole } from '@/utils/users'
    import { useI18n } from 'vue-i18n'

    const { locale } = useI18n({ useScope: 'global' })

    defineProps({
        user: {
            type: Object,
            required: true,
        },
        subtitle: {
            type: String,
            default: null,
        },
        avatarSize: {
            type: Number,
            default: 2.5,
        },
    })
</script>
