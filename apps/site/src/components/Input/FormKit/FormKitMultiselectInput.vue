<template>
    <div class="flex flex-col gap-1">
        <VueMultiselect
            :options="options"
            :disabled="disabled"
            :searchable="searchable"
            :allow-empty="allowEmpty"
            :close-on-select="!multiple"
            :placeholder="placeholder"
            :multiple="multiple"
            :model-value="context._value"
            :group-label="groupLabel"
            :group-values="groupValues"
            label="name"
            track-by="name"
            :limit="showMultipleBelow ? 0 : limit"
            :limit-text="showMultipleBelow ? () => '' : (count) => `+ ${count} autres`"
            @update:model-value="handleInput"
        >
            <template #singleLabel="{ option }">
                <div class="inline-flex items-center gap-1">
                    <div>{{ singleSelectPrefix }}</div>
                    <div>{{ option.prefix }}</div>
                    <ProfileAvatar
                        v-if="option.avatar !== undefined"
                        :name="option.name"
                        :avatar="option.avatar"
                        :size="1.5"
                    />
                    <div>{{ option.highlight ?? option.name }}</div>
                </div>
            </template>
            <template #tag="{ option, remove }">
                <div class="bg-2 ml-1 inline-flex items-center gap-1 rounded-md py-1 px-3">
                    <div>{{ singleSelectPrefix }}</div>
                    <div>{{ option.prefix }}</div>
                    <ProfileAvatar
                        v-if="option.avatar !== undefined"
                        :name="option.name"
                        :avatar="option.avatar"
                        :size="1.5"
                    />
                    <div>{{ option.highlight ?? option.name }}</div>
                    <span
                        class="cursor-pointer pl-2 text-sm"
                        @mousedown.prevent="() => {}"
                        @click.prevent="remove(option)"
                        >❌</span
                    >
                </div>
            </template>
            <template #option="{ option }">
                <div v-if="option.$groupLabel">{{ option.$groupLabel }}</div>
                <div v-else class="flex items-center gap-2">
                    <div
                        v-if="option.prefix"
                        class="bg-3 text-0 flex items-center justify-center rounded-lg p-3"
                    >
                        {{ option.prefix }}
                    </div>
                    <ProfileAvatar
                        v-if="option.avatar !== undefined"
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
            </template>
            <template #noResult>
                <div>Pas de résultat.</div>
            </template>
            <template #noOptions>
                <div>La liste d'options est vide.</div>
            </template>
        </VueMultiselect>
        <div v-if="showMultipleBelow">
            <div v-for="(val, i) in context._value" :key="i">
                {{ val.name }}
            </div>
        </div>
    </div>
</template>

<script setup>
    import VueMultiselect from 'vue-multiselect'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import { computed } from 'vue'

    const props = defineProps({
        context: {
            type: Object,
            required: true,
        },
    })

    const options = computed(() => props.context.options)
    const disabled = computed(() => props.context.disabled)
    const multiple = computed(() => props.context.multiple)
    const allowEmpty = computed(() => props.context.allowEmpty)
    const searchable = computed(() => props.context.searchable)
    const showMultipleBelow = computed(() => props.context.showMultipleBelow)
    const limit = computed(() => props.context.limit)

    const groupLabel = computed(() => props.context.groupLabel)
    const groupValues = computed(() => props.context.groupValues)
    const placeholder = computed(() => props.context.placeholder)
    const singleSelectPrefix = computed(() => props.context.singleSelectPrefix)

    const handleInput = (value) => {
        props.context.node.input(value)
    }
</script>
