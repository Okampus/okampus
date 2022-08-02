<template>
    <div class="flex items-start gap-3">
        <ProfileAvatar :id="user.id" :size="3" :avatar="user.avatar" :name="fullname(user)" />
        <div class="flex flex-col">
            <slot v-if="$slots.title" name="title" />
            <div v-else class="text-1 inline">
                <router-link
                    :to="user.id ? `/user/${user.id}` : 'users'"
                    class="text-sm font-semibold hover:underline"
                    >{{ fullname(user) }}</router-link
                >
                <TipPopper :tip="getRole(user)[locale]">
                    <i class="ml-2" :class="`fa fa-${getRole(user).icon}`" />
                </TipPopper>
            </div>

            <div v-if="$slots.subtitle || subtitle" class="text-4 text-sm line-clamp-1">
                <slot v-if="$slots.subtitle" name="subtitle" />
                <template v-else>{{ subtitle }}</template>
            </div>
        </div>
    </div>
</template>

<script setup>
    import TipPopper from '@/components/UI/Tip/TipPopper.vue'
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
    })
</script>
