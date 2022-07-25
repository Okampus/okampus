<template>
    <div v-if="totalItemCount > 0" class="flex items-center justify-center gap-3 py-3 px-6">
        <i
            class="fa fa-chevron-left text-0 cursor-pointer rounded-md p-3 hover:bg-4-light hover:dark:bg-4-dark"
            @click="currentPage > 1 && router.push(`${routeBase}?page=${currentPage - 1}`)"
        />
        <template v-for="(page, i) in pages" :key="i">
            <div
                v-if="page === '...'"
                class="text-0 flex h-10 items-center justify-center text-center"
                @click="appearInput(i)"
            >
                <input
                    v-if="currentInput === i"
                    ref="inputRef"
                    v-model="pageInput"
                    class="input w-10"
                    @blur="
                        () => {
                            currentInput = null
                            pageInput = null
                        }
                    "
                    @keydown="
                        (e) => {
                            if (
                                e.key == 'Enter' &&
                                isNumeric(pageInput) &&
                                parseInt(pageInput) <= totalPages
                            ) {
                                router.push(`${props.routeBase}?page=${parseInt(pageInput)}`)
                                currentInput = null
                                pageInput = null
                            }
                        }
                    "
                />
                <p v-else class="w-10">...</p>
            </div>
            <router-link
                v-else
                :to="`${routeBase}?page=${page}`"
                class="text-0 h-10 w-10 rounded-md py-2 text-center text-lg leading-tight"
                :class="[
                    page === currentPage
                        ? 'bg-blue-500 !text-white'
                        : 'hover:bg-3-light dark:hover:bg-3-dark',
                ]"
                >{{ page }}</router-link
            >
        </template>
        <i
            class="fa fa-chevron-right text-0 cursor-pointer rounded-md p-3 hover:bg-4-light hover:dark:bg-4-dark"
            @click="currentPage < totalPages && router.push(`${routeBase}?page=${currentPage + 1}`)"
        />
    </div>
</template>

<script setup>
    import { range } from 'lodash'
    import { computed, ref, nextTick } from 'vue'
    import { useRouter } from 'vue-router'

    import { isNumeric } from '@/utils/stringUtils'

    const numberPagesShownAround = 2
    const maxPagesShown = numberPagesShownAround * 2 + 1

    const props = defineProps({
        routeBase: {
            type: String,
            required: true,
        },
        currentPage: {
            type: Number,
            required: true,
        },
        totalPages: {
            type: Number,
            required: true,
        },
        itemsPerPage: {
            type: Number,
            required: true,
        },
        totalItemCount: {
            type: Number,
            required: true,
        },
    })

    const currentInput = ref(null)
    const pageInput = ref('')
    const inputRef = ref(null)

    const router = useRouter()

    const appearInput = (i) => {
        currentInput.value = i
        nextTick(() => {
            inputRef.value[0].focus()
        })
    }

    const getPageNumbers = (currentPage, totalPages) => {
        if (currentPage < maxPagesShown - 1) {
            return [...range(1, maxPagesShown), '...', totalPages]
        }

        if (currentPage > totalPages - maxPagesShown + 2) {
            return [1, '...', ...range(totalPages - maxPagesShown + 2, totalPages + 1)]
        }

        const pageNumbers = [1, '...']

        const startPage = Math.max(2, currentPage - numberPagesShownAround + 1)
        const endPage = Math.min(totalPages, currentPage + numberPagesShownAround - 1)
        for (let page = startPage; page <= endPage; page++) {
            pageNumbers.push(page)
        }

        if (endPage < totalPages) {
            pageNumbers.push('...')
        }

        pageNumbers.push(totalPages)

        return pageNumbers
    }

    const pages = computed(() =>
        props.totalPages > maxPagesShown
            ? getPageNumbers(props.currentPage, props.totalPages)
            : range(1, props.totalPages + 1),
    )
</script>
