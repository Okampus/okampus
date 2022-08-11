<template>
    <Dropdown v-model:shown="showCard" theme="no-arrow" @apply-show="focusCard">
        <div
            class="bg-0 z-10 flex max-w-xs cursor-pointer items-center gap-2 rounded-md px-2.5 py-1 hover:bg-3-light dark:hover:bg-3-dark"
            tabindex="0"
            @click.stop="() => {}"
        >
            <ProfileAvatar
                v-if="avatarTypes.includes(entity.metaType)"
                :rounded-full="false"
                :avatar="entity.picture"
                :size="1.5"
                :name="entity.title"
            />
            <img v-else-if="entity.picture" :src="entity.picture" class="h-6 w-6 rounded-xl" />
            <div v-tooltip="entity.title" class="text-base line-clamp-1">{{ entity.title }}</div>
            <i v-if="closable" class="fa fa-times pl-1 text-base" @click="emit('close')" />
        </div>
        <template #popper>
            <AboutCard
                ref="aboutCard"
                :tabindex="0"
                :entity-type="entity.metaType"
                :entity="entity"
                @keydown.stop="() => {}"
            />
        </template>
    </Dropdown>
</template>

<script setup>
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import AboutCard from '@/components/Profile/AboutCard.vue'

    import { Dropdown } from 'floating-vue'

    import { ref } from 'vue'

    const avatarTypes = ['team', 'user']

    defineProps({
        entity: {
            type: Object,
            required: true,
        },
        closable: {
            type: Boolean,
            default: true,
        },
    })

    const emit = defineEmits(['close'])

    const aboutCard = ref(null)
    const showCard = ref(false)

    const focusCard = () => setTimeout(() => aboutCard.value.$el.focus(), 100)
</script>
