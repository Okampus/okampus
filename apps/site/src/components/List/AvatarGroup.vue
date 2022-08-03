<template>
    <div class="text-0 ml-4 flex flex-row -space-x-4">
        <div v-for="(user, i) in users" :key="i">
            <Dropdown theme="popper" :triggers="isMobile ? ['click'] : ['hover']">
                <div
                    :class="!isMobile ? 'cursor-pointer' : ''"
                    @click="!isMobile ? router.push(`/user/${user.id}`) : () => {}"
                >
                    <ProfileAvatar
                        class="relative rounded-full !shadow-none transition-transform hover:z-20 hover:-translate-y-1"
                        :class="bgClass"
                        :size="3"
                        :avatar="user.avatar"
                        :name="fullname(user)"
                    />
                </div>
                <template #popper>
                    <UserAboutCard :user="user" :title="user.title ? user.title : ''" />
                </template>
            </Dropdown>
        </div>
        <div
            v-if="totalUserCount - numberShown > 0"
            :class="bgClass"
            class="z-10 flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-full"
        >
            <button
                class="z-10 flex h-[3.1rem] w-[3.1rem] items-center justify-center rounded-full bg-gray-700 p-1 text-sm font-semibold text-white hover:bg-gray-600"
                @click="link ? router.push(link) : () => {}"
            >
                +{{ abbrNumbers(totalUserCount - numberShown) }}
            </button>
        </div>
    </div>
</template>

<script setup>
    import UserAboutCard from '@/components/User/UserAboutCard.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import { Dropdown } from 'floating-vue'

    import { useRouter } from 'vue-router'
    import { fullname } from '@/utils/users'

    import abbrNumbers from 'approximate-number'

    const router = useRouter()

    defineProps({
        users: {
            type: Array,
            required: true,
        },
        totalUserCount: {
            type: Number,
            default: (props) => props.users.length,
        },
        numberShown: {
            type: Number,
            default: (props) => (props.users.length < 3 ? props.users.length : 3),
        },
        compact: {
            type: Boolean,
            default: true,
        },
        link: {
            type: String,
            default: '',
        },
        bgClass: {
            type: String,
            default: 'bg-2',
        },
    })
</script>
