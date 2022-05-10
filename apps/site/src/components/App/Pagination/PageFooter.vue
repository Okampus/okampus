<template>
    <div
        v-if="totalItemCount > 0"
        class="flex sticky bottom-0 justify-between items-center py-3 px-4 md:block md:bottom-[unset] md:px-6"
    >
        <div class="flex flex-1 justify-between md:hidden">
            <router-link
                :to="`${baseRoute}?page=${currentPage - 1}`"
                class="inline-flex relative justify-center items-center py-2 px-4 w-28 text-sm font-medium rounded-md text-0 bg-2"
            >
                Précédent
            </router-link>
            <div
                class="py-2 px-3 h-10 text-lg leading-tight text-center border border-opacity/40 bg-4 text-0 border-color-2"
            >
                {{ currentPage }}/{{ totalPages }}
            </div>
            <router-link
                :to="`${baseRoute}?page=${currentPage + 1}`"
                class="inline-flex relative justify-center items-center py-2 px-4 w-28 text-sm font-medium rounded-md text-0 bg-2"
            >
                Suivant
            </router-link>
        </div>

        <div class="hidden sm:items-center md:flex md:flex-1 md:justify-between">
            <div>
                <p class="flex gap-1 text-sm text-2">
                    <span class="font-medium text-0">{{ totalItemCount }}</span>
                    <span>résultat{{ totalItemCount > 1 ? 's' : '' }}</span>
                </p>
            </div>

            <div>
                <nav
                    class="inline-flex relative z-0 gap-2 items-center rounded-md shadow-sm"
                    aria-label="Pagination"
                >
                    <span :class="{ 'cursor-not-allowed': currentPage === 1 }">
                        <router-link
                            :to="`${baseRoute}?page=${currentPage - 1}`"
                            :class="[
                                currentPage === 1
                                    ? 'pointer-events-none text-4'
                                    : 'hover:bg-3-light dark:hover:bg-3-dark text-0',
                            ]"
                            class="inline-flex relative items-center p-2 h-10 text-sm font-medium rounded-md"
                        >
                            <span class="sr-only">Précédent</span>

                            <i class="w-5 h-5 fas fa-chevron-left" />
                        </router-link>
                    </span>

                    <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
                    <span class="flex gap-1 items-center">
                        <template v-for="(page, i) in pages" :key="i">
                            <div
                                v-if="page === '...'"
                                class="flex justify-center items-center w-10 h-10 text-0"
                            >
                                ...
                            </div>
                            <router-link
                                v-else
                                :to="`${baseRoute}?page=${page}`"
                                class="py-2 w-10 h-10 text-lg leading-tight text-center rounded-md text-0"
                                :class="[
                                    page === currentPage
                                        ? 'bg-2-light dark:bg-2-dark '
                                        : 'hover:bg-3-light dark:hover:bg-3-dark',
                                ]"
                                >{{ page }}</router-link
                            >
                        </template>
                    </span>

                    <span :class="{ 'cursor-not-allowed': currentPage === totalPages }">
                        <router-link
                            :to="`${baseRoute}?page=${currentPage + 1}`"
                            class="inline-flex relative items-center p-2 h-10 text-sm font-medium hover:bg-3-light dark:hover:bg-3-dark rounded-md text-0"
                            :class="[
                                currentPage === totalPages
                                    ? 'pointer-events-none text-4'
                                    : 'hover:bg-3-light dark:hover:bg-3-dark text-0',
                            ]"
                        >
                            <span class="sr-only">Suivant</span>
                            <i class="w-5 h-5 fas fa-chevron-right" />
                        </router-link>
                    </span>
                </nav>
            </div>

            <div></div>
        </div>
    </div>
</template>

<script setup>
    import { range } from 'lodash'
    import { computed } from 'vue'
    const numberPagesShownAround = 2
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
