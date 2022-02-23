<template>
    <div class="flex sticky bottom-0 justify-between items-center py-3 px-4 md:px-6 bg-0">
        <div class="flex flex-1 justify-between md:hidden">
            <router-link
                v-if="currentPage > 1"
                :to="`${baseRoute}?page=${currentPage - 1}`"
                class="inline-flex relative justify-center items-center py-2 px-4 w-28 text-sm font-medium rounded-md text-0 bg-2"
            >
                Previous
            </router-link>
            <div v-else class="w-28"></div>
            <div
                class="py-2 px-3 h-10 text-lg leading-tight text-center border border-opacity/40 bg-4 text-0 border-color-2"
            >
                {{ currentPage }} / {{ totalPages }}
            </div>
            <router-link
                v-if="currentPage < totalPages"
                :to="`${baseRoute}?page=${currentPage + 1}`"
                class="inline-flex relative justify-center items-center py-2 px-4 w-28 text-sm font-medium rounded-md text-0 bg-2"
            >
                Next
            </router-link>
            <div v-else class="w-28"></div>
        </div>
        <div class="hidden sm:items-center md:flex md:flex-1 md:justify-between">
            <div>
                <p class="flex gap-1 text-sm text-2">
                    <span>Résultats</span>
                    <span class="font-medium text-0">{{ itemsPerPage * (currentPage - 1) + 1 }}</span>
                    <span>à</span>
                    <span class="font-medium text-0">{{
                        Math.min(itemsPerPage * currentPage, totalItemCount)
                    }}</span>
                    <span>parmi</span>
                    <span class="font-medium text-0">{{ totalItemCount }}</span>
                    <span>résultats</span>
                </p>
            </div>
            <div>
                <nav
                    class="inline-flex relative z-0 gap-2 items-center rounded-md shadow-sm"
                    aria-label="Pagination"
                >
                    <router-link
                        v-if="currentPage > 1"
                        :to="`${baseRoute}?page=${currentPage - 1}`"
                        class="inline-flex relative items-center p-2 h-10 text-sm font-medium rounded-l-md bg-4 text-0"
                    >
                        <span class="sr-only">Previous</span>
                        <font-awesome-icon icon="chevron-left" class="w-5 h-5" aria-hidden="true" />
                    </router-link>
                    <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
                    <span class="flex -space-x-[1px]">
                        <template v-for="(page, i) in pages" :key="i">
                            <div v-if="page === '...'" class="flex justify-center items-center">...</div>
                            <router-link
                                v-else
                                :to="`${baseRoute}?page=${page}`"
                                class="py-2 px-3 h-10 text-lg leading-tight border border-opacity/40 bg-4 text-0 border-color-2"
                                :class="{ 'bg-blue-400 dark:bg-blue-700': page === currentPage }"
                                >{{ page }}</router-link
                            >
                        </template>
                    </span>
                    <router-link
                        v-if="currentPage < totalPages"
                        :to="`${baseRoute}?page=${currentPage + 1}`"
                        class="inline-flex relative items-center p-2 h-10 text-sm font-medium rounded-r-md bg-4 text-0"
                    >
                        <span class="sr-only">Next</span>
                        <font-awesome-icon icon="chevron-right" class="w-5 h-5" aria-hidden="true" />
                    </router-link>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { range } from 'lodash'
    import { computed } from 'vue'
    const numberPagesShownAround = 3
    const maxPagesShown = numberPagesShownAround * 2 + 1

    const props = defineProps({
        baseRoute: {
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

    const getPageNumbers = (currentPage, totalPages) => {
        if (currentPage < numberPagesShownAround + 1) {
            return [...range(1, maxPagesShown), '...', totalPages]
        }

        if (currentPage > totalPages - numberPagesShownAround) {
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
