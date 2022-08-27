<template>
    <Dropdown theme="no-arrow" placement="bottom-start">
        <div
            ref="dropdown"
            :class="[inputClass, textClass]"
            class="flex cursor-pointer items-center gap-4"
            :="focused ? { focused: '' } : {}"
            @click="focused = true"
        >
            <div v-if="isEmpty(selected)" :class="placholderClass">{{ placeholder }}</div>
            <div v-else class="flex items-center gap-2">
                <div
                    v-if="selected.emoji || selected.icon"
                    class="bg-4 text-0 flex h-8 w-8 items-center justify-center rounded-lg text-sm"
                    :class="[selected.icon]"
                >
                    {{ selected.emoji }}
                </div>
                {{ selected.name }}
            </div>
            <i class="fa fa-caret-down" />
        </div>
        <template #popper="{ hide }">
            <div class="bg-0 flex-col gap-1 rounded-b-lg">
                <div
                    v-for="(option, i) in options"
                    :key="i"
                    class="flex cursor-pointer items-center gap-2 py-2 px-3 hover:bg-2-light dark:hover:bg-2-dark"
                    @click="() => updateSelected(option, hide)"
                >
                    <div
                        v-if="option.emoji || option.icon"
                        class="bg-3 text-0 flex items-center justify-center rounded-lg p-3"
                        :class="[option.icon]"
                    >
                        {{ option.emoji }}
                    </div>
                    <ProfileAvatar
                        v-if="!isNil(option.avatar)"
                        :size="2"
                        :name="option.name"
                        :avatar="option.avatar"
                    />
                    <div class="flex flex-col gap-1">
                        <div class="text-1">{{ option.name }}</div>
                        <div v-if="option.subtitle" class="text-3 flex gap-1 text-sm">
                            {{ option.subtitle }}
                            <span v-if="option.highlight" class="text-2 font-medium">{{
                                option.highlight
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Dropdown>
</template>

<script setup>
    import { Dropdown } from 'floating-vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import { isNil, isEmpty } from 'lodash'

    import { onClickOutside } from '@vueuse/core'
    import { ref } from 'vue'

    const props = defineProps({
        placeholder: {
            type: String,
            default: 'Choix...',
        },
        textClass: {
            type: String,
            default: 'text-1',
        },
        inputClass: {
            type: String,
            default: 'select-2',
        },
        placholderClass: {
            type: String,
            default: 'text-placeholder',
        },
        modelValue: {
            type: null,
            default: () => ({}),
        },
        defaultOption: {
            type: Number,
            default: null,
        },
        options: {
            type: Array,
            default: () => [],
        },
        update: {
            type: Function,
            default: (value) => value,
        },
    })

    const selected = ref({})

    const emit = defineEmits(['update:model-value'])

    const updateSelected = (value, after = () => {}) => {
        selected.value = value
        emit('update:model-value', props.update(value))
        after()
    }

    if (!isNil(props.defaultOption)) updateSelected(props.options[props.defaultOption])
    const focused = ref(false)
    const dropdown = ref(null)
    onClickOutside(dropdown, () => (focused.value = false))
</script>
