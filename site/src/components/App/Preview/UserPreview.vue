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
                    :tag-name="schoolRoleItem[$i18n.locale]"
                    :tag-color="schoolRoleItem.color"
                    :icon="schoolRoleItem.icon"
                />
                <!-- <div v-if="user.schoolRole === 'student'" class="flex gap-1 items-center text-2">
                    <i class="fas fa-trophy" />
                    <p>{{ abbrNumbers(user.reputation) }}</p>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
    import schoolRolesEnum from '@/shared/types/school-roles.enum'
    import { abbrNumbers } from '@/utils/abbrNumbers'
    import AppTag from '@/components/App/AppTag.vue'
    import UserAvatar from '@/components/User/UserAvatar.vue'

    export default {
        components: { AppTag, UserAvatar },
        props: {
            user: {
                type: Object,
                default: () => {},
            },
            mode: {
                type: String,
                default: 'horizontal',
            },
            imgSize: {
                type: Number,
                default: 3.2,
            },
            textClass: {
                type: String,
                default: 'text-base text-0',
            },
            textClassInfo: {
                type: String,
                default: 'text-sm text-gray-600 dark:text-gray-400',
            },
        },
        data() {
            return {
                schoolRoleItem: schoolRolesEnum.find(
                    (role) => role.key === (this.user.schoolRole || 'horizon'),
                ),
            }
        },
        methods: { abbrNumbers },
    }
</script>
