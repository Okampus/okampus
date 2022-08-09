<template>
    <div class="text-0 flex flex-row items-center" :class="spacingClass">
        <div v-for="(entity, i) in entities.slice(0, numberShown)" :key="i">
            <Dropdown theme="popper" :triggers="isMobile ? ['click'] : ['hover']">
                <div
                    :class="!isMobile ? 'cursor-pointer' : ''"
                    @click="
                        !isMobile
                            ? entityType === 'user'
                                ? router.push(`/user/${entity.id}`)
                                : router.push(`/club/${entity.id}`)
                            : () => {}
                    "
                >
                    <ProfileAvatar
                        class="relative rounded-full border-4 p-1 !shadow-none transition-transform hover:z-20 hover:-translate-y-1"
                        :class="bgClass"
                        :size="size"
                        :avatar="entity.avatar"
                        :name="entityType === 'user' ? fullname(entity) : entity.name"
                    >
                        <template v-if="showPresence" #icon>
                            <PresenceIndicator :presence="entity.status" />
                        </template>
                    </ProfileAvatar>
                </div>
                <template #popper>
                    <AboutCard
                        :entity-type="entityType"
                        :entity="entity"
                        :title="entity.title ? entity.title : ''"
                    />
                </template>
            </Dropdown>
        </div>
        <div
            v-if="totalCount - numberShown > 0"
            :style="avatarSizeStyleFull"
            :class="bgClass"
            class="z-10 flex items-center justify-center rounded-full"
        >
            <button
                :style="avatarSizeStyle"
                class="z-10 flex items-center justify-center rounded-full bg-gray-700 p-1 font-semibold text-white hover:bg-gray-600"
                @click="link ? router.push(link) : action ? action : () => {}"
            >
                +{{ abbrNumbers(totalCount - numberShown) }}
            </button>
        </div>
    </div>
</template>

<script setup>
    import AboutCard from '@/components/Profile/AboutCard.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import PresenceIndicator from '@/components/Profile/PresenceIndicator.vue'

    import { Dropdown } from 'floating-vue'

    import { useRouter } from 'vue-router'
    import { fullname } from '@/utils/users'

    import abbrNumbers from 'approximate-number'
    import { computed } from 'vue'

    const router = useRouter()
    const props = defineProps({
        entityType: {
            type: String,
            default: 'user',
        },
        size: {
            type: Number,
            default: 4,
        },
        entities: {
            type: Array,
            required: true,
        },
        totalCount: {
            type: Number,
            default: (props) => props.entities.length,
        },
        numberShown: {
            type: Number,
            default: (props) => (props.entities.length < 3 ? props.entities.length : 3),
        },
        action: {
            type: Function,
            default: () => {},
        },
        link: {
            type: String,
            default: '',
        },
        showPresence: {
            type: Boolean,
            default: false,
        },
        spacingClass: {
            type: String,
            default: '-space-x-4',
        },
        bgClass: {
            type: String,
            default: 'bg-2 border-2-light dark:border-2-dark',
        },
    })

    const avatarSizeStyle = computed(() => ({
        width: `${props.size}rem`,
        height: `${props.size}rem`,
    }))
    const avatarSizeStyleFull = computed(() => ({
        width: `calc(${props.size}rem + 6px)`,
        height: `calc(${props.size}rem + 6px)`,
    }))
</script>
