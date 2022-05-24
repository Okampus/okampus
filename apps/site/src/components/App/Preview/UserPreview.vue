<template>
    <div
        class="flex gap-3 items-center min-h-fit text-sm"
        :class="[mode === 'vertical' ? 'flex-col gap-1' : 'gap-3']"
    >
        <ProfileAvatar :size="imgSize" :avatar="user.avatar" :name="fullname(user)" />
        <div class="flex flex-col gap-1" :class="[mode === 'vertical' ? 'justify-center items-center' : '']">
            <div class="text-sm text-1">
                {{ fullname(user) }}
            </div>
            <div
                class="flex flex-col gap-2"
                :class="[mode === 'vertical' ? 'justify-center' : 'items-center']"
            >
                <LabelTag :tag-name="role[$i18n.locale]" :tag-color="role.color" :icon="role.icon" />
                <!-- <div v-if="user.schoolRole === 'student'" class="flex gap-1 items-center text-2">
                    <i class="fas fa-trophy" />
                    <p>{{ abbrNumbers(user.reputation) }}</p>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
    import LabelTag from '@/components/UI/Label/LabelTag.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import { fullname, getRole } from '@/utils/users'
    // import { abbrNumbers } from '@/utils/abbrNumbers'

    const props = defineProps({
        user: {
            type: Object,
            required: true,
        },
        imgSize: {
            type: Number,
            default: 3,
        },
        mode: {
            type: String,
            default: 'horizontal',
        },
    })

    const role = getRole(props.user)
</script>
