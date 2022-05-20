<template>
    <div
        class="flex gap-3 items-center min-h-fit text-sm"
        :class="[mode === 'vertical' ? 'flex-col gap-1' : 'gap-3']"
    >
        <UserAvatar :size="imgSize" :img-src="user.avatar" :username="user.fullname ?? 'Anonyme'" />
        <div class="flex flex-col gap-1" :class="[mode === 'vertical' ? 'justify-center items-center' : '']">
            <div class="text-sm text-1">
                {{ user.fullname ?? 'Anonyme' }}
            </div>
            <div
                class="flex flex-col gap-2"
                :class="[mode === 'vertical' ? 'justify-center' : 'items-center']"
            >
                <AppTag
                    :tag-name="roleItem[$i18n.locale]"
                    :tag-color="roleItem.color"
                    :icon="roleItem.icon"
                />
                <!-- <div v-if="user.schoolRole === 'student'" class="flex gap-1 items-center text-2">
                    <i class="fas fa-trophy" />
                    <p>{{ abbrNumbers(user.reputation) }}</p>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
    import rolesEnum, { DEFAULT_ROLE } from '@/shared/types/school-roles.enum'
    // import { abbrNumbers } from '@/utils/abbrNumbers'
    import AppTag from '@/components/App/AppTag.vue'
    import UserAvatar from '@/components/User/UserAvatar.vue'

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

    const roleItem = rolesEnum.find((role) => role.key === (props.user.schoolRole || DEFAULT_ROLE))
</script>
