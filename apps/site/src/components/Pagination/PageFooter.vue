<template>
    <div v-if="totalItemCount > 0" class="flex gap-3 justify-center items-center py-3 px-6">
        <i
            class="p-3 hover:bg-4-light hover:dark:bg-4-dark rounded-md cursor-pointer fa fa-chevron-left text-0"
            @click="currentPage > 1 && router.push(`${routeBase}?page=${currentPage - 1}`)"
        />
        <template v-for="(page, i) in pages" :key="i">
            <div
                v-if="page === '...'"
                class="flex justify-center items-center h-10 text-center text-0"
                @click="appearInput(i)"
            >
                <input
                    v-if="currentInput === i"
                    ref="inputRef"
                    v-model="pageInput"
                    class="w-10 input"
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
                class="py-2 w-10 h-10 text-lg leading-tight text-center rounded-md text-0"
                :class="[page === currentPage ? 'bg-blue-500' : 'hover:bg-3-light dark:hover:bg-3-dark']"
                >{{ page }}</router-link
            >
        </template>
        <i
            class="p-3 hover:bg-4-light hover:dark:bg-4-dark rounded-md cursor-pointer fa fa-chevron-right text-0"
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
