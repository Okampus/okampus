<template>
    <div v-if="mode == 'horizontal'" class="flex items-center min-h-fit text-sm">
        <div
            class="hidden relative mr-3 w-10 h-10 rounded-full md:block"
            :class="`w-${imgSize} h-${imgSize}`"
        >
            <img
                class="object-cover w-full h-full rounded-full"
                :src="avatar ?? defaultAvatar"
                :alt="username"
                loading="lazy"
            />
        </div>
        <div>
            <p class="whitespace-nowrap" :class="textClass">
                {{ username }}
            </p>
            <div v-if="reputation !== null" class="flex gap-1 items-center text-gray-600 dark:text-gray-400">
                <font-awesome-icon icon="trophy" />
                <p>{{ abbrNumbers(reputation) }}</p>
            </div>
        </div>
    </div>
    <div v-else class="flex flex-col gap-1.5 items-center min-h-fit text-sm">
        <img
            :src="avatar || defaultAvatar"
            alt="Profile Picture"
            :class="`w-${imgSize} h-${imgSize}`"
            class="mt-2 rounded-full"
        />
        <div class="font-medium text-center" :class="textClass">
            {{ username }}
        </div>
        <AppTag
            :tag-name="schoolRoleItem[$i18n.locale]"
            :tag-color="schoolRoleItem.color"
            :icon="schoolRoleItem.icon"
        />
        <div v-if="reputation !== null" class="flex gap-1 items-center text-gray-600 dark:text-gray-400">
            <font-awesome-icon icon="trophy" />
            <p>{{ abbrNumbers(reputation) }}</p>
        </div>
    </div>
</template>

<script>
    import defaultAvatar from '@/assets/img/default_avatars/user.png'
    import schoolRolesEnum from '@/shared/types/school-roles.enum'
    import { abbrNumbers } from '@/utils/abbrNumbers'
    import AppTag from '../App/AppTag.vue'

    export default {
        components: { AppTag },
        props: {
            username: {
                type: String,
                default: 'Anonyme',
            },
            avatar: {
                type: String,
                default: defaultAvatar,
            },
            reputation: {
                type: Number,
                default: null,
            },
            schoolRole: {
                type: String,
                default: null,
            },
            mode: {
                type: String,
                default: 'horizontal',
            },
            imgSize: {
                type: Number,
                default: 10,
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
                defaultAvatar,
                schoolRoleItem: schoolRolesEnum.find((role) => role.key === this.schoolRole || 'horizon'),
            }
        },
        methods: { abbrNumbers },
    }
</script>
