<template>
    <!--Begin Data Cards-->
    <div>
        <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-6">
            <div
                v-for="(card, i) in cards"
                :key="i"
                class="group flex items-center justify-between rounded-md border-b-4 p-3 font-medium text-white shadow-md md:flex-col"
                :class="card.class"
            >
                <div class="flex space-x-4 text-center md:flex-col md:space-x-0">
                    <div class="text-xl">
                        {{ card.quantity }}
                    </div>
                    <div class="font-bold">
                        {{ card.title }}
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <a :href="card.link" class="text-5 bg-2 rounded px-2 font-bold hover:bg-white"
                        >View all</a
                    >
                </div>
            </div>
        </div>
        <!--End Data Cards-->
        <div class="mt-2 mb-10 h-full">
            <div>
                <select
                    class="text-3 bg-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200/50"
                >
                    <option>Dernière semaine</option>
                    <option>Dernier mois</option>
                    <option>Dernière année</option>
                </select>
            </div>
            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
                <div
                    v-for="(statistic, j) in statistics"
                    :key="j"
                    class="group flex items-center justify-between rounded-md border-b-4 border-blue-600 bg-blue-500 p-3 font-medium text-white shadow-md dark:border-gray-600 dark:bg-gray-800"
                >
                    <div class="text-left">
                        <p class="text-2xl">
                            {{ statistic.quantity }}
                        </p>
                        <p>{{ statistic.title }}</p>
                    </div>
                </div>
            </div>
            <!-- ./Statistics Cards -->
            <div class="grid grid-cols-1 gap-5 p-4 lg:grid-cols-2">
                <!-- Recent Activities -->
                <div
                    class="relative flex w-full min-w-0 flex-col break-words rounded bg-gray-50 dark:bg-gray-800"
                >
                    <div class="mb-0 rounded-t border-0 px-0">
                        <div class="flex flex-wrap items-center py-2 px-4">
                            <div class="relative w-full max-w-full flex-1 grow">
                                <h3 class="text-base font-semibold text-gray-900 dark:text-gray-50">
                                    Recent Activities
                                </h3>
                            </div>
                            <div class="relative w-full max-w-full flex-1 grow text-right">
                                <button
                                    class="mr-1 mb-1 rounded bg-blue-500 py-1 px-3 text-xs font-bold uppercase text-white outline-none transition-all duration-150 ease-linear focus:outline-none active:bg-blue-600 dark:bg-gray-100 dark:text-gray-800 dark:active:text-gray-700"
                                    type="button"
                                >
                                    See all
                                </button>
                            </div>
                        </div>
                        <div class="block w-full">
                            <div
                                class="whitespace-nowrap border border-x-0 border-solid border-gray-200 bg-gray-100 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-500 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                            >
                                Today
                            </div>
                            <ul class="my-1">
                                <li class="flex px-4">
                                    <div class="bg-6 my-2 mr-3 h-9 w-9 shrink-0 rounded-full bg-indigo-500">
                                        <svg class="h-9 w-9 fill-current text-indigo-50" viewBox="0 0 36 36">
                                            <path
                                                d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        class="flex grow items-center border-b border-gray-100 py-2 text-sm text-gray-600 dark:border-gray-400 dark:text-gray-100"
                                    >
                                        <div class="flex grow items-center justify-between">
                                            <div class="self-center">
                                                <a
                                                    class="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-100"
                                                    href="#0"
                                                    style="outline: none"
                                                    >Nick Mark</a
                                                >
                                                mentioned
                                                <a
                                                    class="font-medium text-gray-800 dark:text-gray-50 dark:hover:text-gray-100"
                                                    href="#0"
                                                    style="outline: none"
                                                    >Sara Smith</a
                                                >
                                                in a new post
                                            </div>
                                            <div class="ml-2 shrink-0">
                                                <a
                                                    class="flex items-center font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                                                    href="#0"
                                                    style="outline: none"
                                                >
                                                    View<span
                                                        ><svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            class="transition-transform duration-500 ease-in-out"
                                                        >
                                                            <path
                                                                fill-rule="evenodd"
                                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                                clip-rule="evenodd"
                                                            /></svg
                                                    ></span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="flex px-4">
                                    <div class="bg-6 my-2 mr-3 h-9 w-9 shrink-0 rounded-full bg-red-500">
                                        <svg class="h-9 w-9 fill-current text-red-50" viewBox="0 0 36 36">
                                            <path
                                                d="M25 24H11a1 1 0 01-1-1v-5h2v4h12v-4h2v5a1 1 0 01-1 1zM14 13h8v2h-8z"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        class="flex grow items-center border-gray-100 py-2 text-sm text-gray-600 dark:text-gray-50"
                                    >
                                        <div class="flex grow items-center justify-between">
                                            <div class="self-center">
                                                The post
                                                <a
                                                    class="font-medium text-gray-800 dark:text-gray-50 dark:hover:text-gray-100"
                                                    href="#0"
                                                    style="outline: none"
                                                    >Post Name</a
                                                >
                                                was removed by
                                                <a
                                                    class="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-100"
                                                    href="#0"
                                                    style="outline: none"
                                                    >Nick Mark</a
                                                >
                                            </div>
                                            <div class="ml-2 shrink-0">
                                                <a
                                                    class="flex items-center font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                                                    href="#0"
                                                    style="outline: none"
                                                >
                                                    View<span
                                                        ><svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            class="transition-transform duration-500 ease-in-out"
                                                        >
                                                            <path
                                                                fill-rule="evenodd"
                                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                                clip-rule="evenodd"
                                                            /></svg
                                                    ></span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div
                                class="whitespace-nowrap border border-x-0 border-solid border-gray-200 bg-gray-100 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-500 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                            >
                                Yesterday
                            </div>
                            <ul class="my-1">
                                <li class="flex px-4">
                                    <div class="bg-6 my-2 mr-3 h-9 w-9 shrink-0 rounded-full bg-green-500">
                                        <svg
                                            class="text-light-blue-50 h-9 w-9 fill-current"
                                            viewBox="0 0 36 36"
                                        >
                                            <path
                                                d="M23 11v2.085c-2.841.401-4.41 2.462-5.8 4.315-1.449 1.932-2.7 3.6-5.2 3.6h-1v2h1c3.5 0 5.253-2.338 6.8-4.4 1.449-1.932 2.7-3.6 5.2-3.6h3l-4-4zM15.406 16.455c.066-.087.125-.162.194-.254.314-.419.656-.872 1.033-1.33C15.475 13.802 14.038 13 12 13h-1v2h1c1.471 0 2.505.586 3.406 1.455zM24 21c-1.471 0-2.505-.586-3.406-1.455-.066.087-.125.162-.194.254-.316.422-.656.873-1.028 1.328.959.878 2.108 1.573 3.628 1.788V25l4-4h-3z"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        class="flex grow items-center border-gray-100 py-2 text-sm text-gray-600 dark:text-gray-50"
                                    >
                                        <div class="flex grow items-center justify-between">
                                            <div class="self-center">
                                                <a
                                                    class="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-100"
                                                    href="#0"
                                                    style="outline: none"
                                                    >240+</a
                                                >
                                                users have subscribed to
                                                <a
                                                    class="font-medium text-gray-800 dark:text-gray-50 dark:hover:text-gray-100"
                                                    href="#0"
                                                    style="outline: none"
                                                    >Newsletter #1</a
                                                >
                                            </div>
                                            <div class="ml-2 shrink-0">
                                                <a
                                                    class="flex items-center font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                                                    href="#0"
                                                    style="outline: none"
                                                >
                                                    View<span
                                                        ><svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            class="transition-transform duration-500 ease-in-out"
                                                        >
                                                            <path
                                                                fill-rule="evenodd"
                                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                                clip-rule="evenodd"
                                                            /></svg
                                                    ></span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <ul class="my-1">
                                <li class="flex px-4">
                                    <div class="bg-6 my-2 mr-3 h-9 w-9 shrink-0 rounded-full bg-red-500">
                                        <svg class="h-9 w-9 fill-current text-red-50" viewBox="0 0 36 36">
                                            <path
                                                d="M25 24H11a1 1 0 01-1-1v-5h2v4h12v-4h2v5a1 1 0 01-1 1zM14 13h8v2h-8z"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        class="flex grow items-center border-gray-100 py-2 text-sm text-gray-600 dark:text-gray-50"
                                    >
                                        <div class="flex grow items-center justify-between">
                                            <div class="self-center">
                                                <a
                                                    class="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-100"
                                                    href="#0"
                                                    style="outline: none"
                                                    >500+</a
                                                >
                                                users have removed at least
                                                <a
                                                    class="font-medium text-gray-800 dark:text-gray-50 dark:hover:text-gray-100"
                                                    href="#0"
                                                    style="outline: none"
                                                    >1 post</a
                                                >
                                            </div>
                                            <div class="ml-2 shrink-0">
                                                <a
                                                    class="flex items-center font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                                                    href="#0"
                                                    style="outline: none"
                                                >
                                                    View<span
                                                        ><svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            class="transition-transform duration-500 ease-in-out"
                                                        >
                                                            <path
                                                                fill-rule="evenodd"
                                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                                clip-rule="evenodd"
                                                            /></svg
                                                    ></span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <ul class="my-1">
                                <li class="flex px-4">
                                    <div class="bg-6 my-2 mr-3 h-9 w-9 shrink-0 rounded-full bg-indigo-500">
                                        <svg class="h-9 w-9 fill-current text-indigo-50" viewBox="0 0 36 36">
                                            <path
                                                d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        class="flex grow items-center border-gray-100 py-2 text-sm text-gray-600 dark:text-gray-50"
                                    >
                                        <div class="flex grow items-center justify-between">
                                            <div class="self-center">
                                                <a
                                                    class="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-100"
                                                    href="#0"
                                                    style="outline: none"
                                                    >650+</a
                                                >
                                                users have mentioned the
                                                <a
                                                    class="font-medium text-gray-800 dark:text-gray-50 dark:hover:text-gray-100"
                                                    href="#0"
                                                    style="outline: none"
                                                    >Efrei PARIS account</a
                                                >
                                            </div>
                                            <div class="ml-2 shrink-0">
                                                <a
                                                    class="flex items-center font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                                                    href="#0"
                                                    style="outline: none"
                                                >
                                                    View<span
                                                        ><svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            class="transition-transform duration-500 ease-in-out"
                                                        >
                                                            <path
                                                                fill-rule="evenodd"
                                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                                clip-rule="evenodd"
                                                            /></svg
                                                    ></span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!--Recent activities end-->
                <!-- Task Summaries -->
                <div
                    class="grid grid-cols-1 gap-4 p-4 text-black dark:text-white md:grid-cols-2 xl:grid-cols-3"
                >
                    <div class="md:col-span-2 xl:col-span-3">
                        <h3 class="text-lg font-semibold">Task summaries of the team</h3>
                    </div>
                    <div class="md:col-span-2 xl:col-span-1">
                        <div class="rounded bg-gray-200 p-3 dark:bg-gray-800">
                            <div class="flex justify-between py-1 text-black dark:text-white">
                                <h3 class="text-sm font-semibold">Tasks in TO DO</h3>
                                <svg
                                    class="h-4 cursor-pointer fill-current text-gray-600 dark:text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M5 10a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4z"
                                    />
                                </svg>
                            </div>
                            <div class="mt-2 text-sm text-black dark:text-gray-50">
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Delete all references from the wiki
                                </div>
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Remove analytics code
                                </div>
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Do a mobile first layout
                                    <div
                                        class="mt-2 ml-2 flex items-start justify-between text-gray-500 dark:text-gray-200"
                                    >
                                        <span class="flex items-center text-xs">
                                            <svg
                                                class="mr-1 h-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 50 50"
                                            >
                                                <path
                                                    d="M11 4c-3.855 0-7 3.145-7 7v28c0 3.855 3.145 7 7 7h28c3.855 0 7-3.145 7-7V11c0-3.855-3.145-7-7-7zm0 2h28c2.773 0 5 2.227 5 5v28c0 2.773-2.227 5-5 5H11c-2.773 0-5-2.227-5-5V11c0-2.773 2.227-5 5-5zm25.234 9.832l-13.32 15.723-8.133-7.586-1.363 1.465 9.664 9.015 14.684-17.324z"
                                                />
                                            </svg>
                                            3/5
                                        </span>
                                        <img src="https://i.imgur.com/OZaT7jl.png" class="rounded-full" />
                                    </div>
                                </div>
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Check the meta tags
                                </div>
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Think more tasks for this example
                                    <div
                                        class="mt-2 ml-2 flex items-start justify-between text-gray-500 dark:text-gray-200"
                                    >
                                        <span class="flex items-center text-xs">
                                            <svg
                                                class="mr-1 h-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 50 50"
                                            >
                                                <path
                                                    d="M11 4c-3.855 0-7 3.145-7 7v28c0 3.855 3.145 7 7 7h28c3.855 0 7-3.145 7-7V11c0-3.855-3.145-7-7-7zm0 2h28c2.773 0 5 2.227 5 5v28c0 2.773-2.227 5-5 5H11c-2.773 0-5-2.227-5-5V11c0-2.773 2.227-5 5-5zm25.234 9.832l-13.32 15.723-8.133-7.586-1.363 1.465 9.664 9.015 14.684-17.324z"
                                                />
                                            </svg>
                                            0/3
                                        </span>
                                    </div>
                                </div>
                                <p class="mt-3 text-gray-600 dark:text-gray-400">Add a card...</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="rounded bg-gray-200 p-3 dark:bg-gray-800">
                            <div class="flex justify-between py-1 text-black dark:text-white">
                                <h3 class="text-sm font-semibold">Tasks in DEVELOPMENT</h3>
                                <svg
                                    class="h-4 cursor-pointer fill-current text-gray-600 dark:text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M5 10a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4z"
                                    />
                                </svg>
                            </div>
                            <div class="mt-2 text-sm text-black dark:text-gray-50">
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Delete all references from the wiki
                                </div>
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Remove analytics code
                                </div>
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Do a mobile first layout
                                    <div
                                        class="mt-2 ml-2 flex items-start justify-between text-xs text-white"
                                    >
                                        <span class="flex items-center rounded bg-pink-600 p-1 text-xs">
                                            <svg
                                                class="h-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M12 2c-.8 0-1.5.7-1.5 1.5v.688C7.344 4.87 5 7.62 5 11v4.5l-2 2.313V19h18v-1.188L19 15.5V11c0-3.379-2.344-6.129-5.5-6.813V3.5c0-.8-.7-1.5-1.5-1.5zm-2 18c0 1.102.898 2 2 2 1.102 0 2-.898 2-2z"
                                                />
                                            </svg>
                                            2
                                        </span>
                                    </div>
                                </div>
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Check the meta tags
                                </div>
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Think more tasks for this example
                                    <div class="mt-2 ml-2 flex items-start justify-between text-gray-500">
                                        <span class="flex items-center text-xs">
                                            <svg
                                                class="mr-1 h-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 50 50"
                                            >
                                                <path
                                                    d="M11 4c-3.855 0-7 3.145-7 7v28c0 3.855 3.145 7 7 7h28c3.855 0 7-3.145 7-7V11c0-3.855-3.145-7-7-7zm0 2h28c2.773 0 5 2.227 5 5v28c0 2.773-2.227 5-5 5H11c-2.773 0-5-2.227-5-5V11c0-2.773 2.227-5 5-5zm25.234 9.832l-13.32 15.723-8.133-7.586-1.363 1.465 9.664 9.015 14.684-17.324z"
                                                />
                                            </svg>
                                            0/3
                                        </span>
                                    </div>
                                </div>
                                <p class="mt-3 text-gray-600 dark:text-gray-400">Add a card...</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="rounded bg-gray-200 p-3 dark:bg-gray-800">
                            <div class="flex justify-between py-1 text-black dark:text-white">
                                <h3 class="text-sm font-semibold">Tasks in QA</h3>
                                <svg
                                    class="h-4 cursor-pointer fill-current text-gray-600 dark:text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M5 10a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4z"
                                    />
                                </svg>
                            </div>
                            <div class="mt-2 text-sm text-black dark:text-gray-50">
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Delete all references from the wiki
                                </div>
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Remove analytics code
                                </div>
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Do a mobile first layout
                                </div>
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Check the meta tags
                                </div>
                                <div
                                    class="mt-1 cursor-pointer rounded border-b border-gray-100 bg-white p-2 hover:bg-gray-50 dark:border-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    Think more tasks for this example
                                    <div
                                        class="mt-2 ml-2 flex items-start justify-between text-gray-500 dark:text-gray-200"
                                    >
                                        <span class="flex items-center text-xs">
                                            <svg
                                                class="mr-1 h-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 50 50"
                                            >
                                                <path
                                                    d="M11 4c-3.855 0-7 3.145-7 7v28c0 3.855 3.145 7 7 7h28c3.855 0 7-3.145 7-7V11c0-3.855-3.145-7-7-7zm0 2h28c2.773 0 5 2.227 5 5v28c0 2.773-2.227 5-5 5H11c-2.773 0-5-2.227-5-5V11c0-2.773 2.227-5 5-5zm25.234 9.832l-13.32 15.723-8.133-7.586-1.363 1.465 9.664 9.015 14.684-17.324z"
                                                />
                                            </svg>
                                            0/3
                                        </span>
                                    </div>
                                </div>
                                <p class="mt-3 text-gray-600 dark:text-gray-400">Add a card...</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!--Task summaries end-->
            </div>
            <!-- Client Table -->
            <div class="mx-4 mt-4">
                <div class="shadow-xs w-full overflow-hidden rounded-lg">
                    <div class="w-full overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr
                                    class="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                >
                                    <th class="py-3 px-4">
                                        <span class="flex items-center text-xs">
                                            <svg
                                                class="mr-1 h-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 50 50"
                                            >
                                                <path
                                                    d="M11 4c-3.855 0-7 3.145-7 7v28c0 3.855 3.145 7 7 7h28c3.855 0 7-3.145 7-7V11c0-3.855-3.145-7-7-7zm0 2h28c2.773 0 5 2.227 5 5v28c0 2.773-2.227 5-5 5H11c-2.773 0-5-2.227-5-5V11c0-2.773 2.227-5 5-5zm25.234 9.832l-13.32 15.723-8.133-7.586-1.363 1.465 9.664 9.015 14.684-17.324z"
                                                />
                                            </svg>
                                            Name
                                        </span>
                                    </th>
                                    <th class="py-3 px-4">Content type</th>
                                    <th class="py-3 px-4">Updated</th>
                                    <th class="py-3 px-4">Author</th>
                                    <th class="py-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y bg-white dark:divide-gray-700 dark:bg-gray-800">
                                <tr
                                    class="bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-900"
                                >
                                    <td class="py-3 px-4 text-sm">Untitled</td>
                                    <td class="py-3 px-4 text-sm">Layout > Copy</td>
                                    <td class="py-3 px-4 text-sm">Aug 21, 2018</td>
                                    <td class="py-3 px-4">
                                        <div class="flex items-center text-sm">
                                            <div class="relative mr-3 hidden h-8 w-8 rounded-full md:block">
                                                <img
                                                    class="h-full w-full rounded-full object-cover"
                                                    src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=200&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                                                    alt=""
                                                    loading="lazy"
                                                />
                                                <div
                                                    class="absolute inset-0 rounded-full shadow-inner"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div>
                                                <p class="font-semibold">Ivan STEPANIAN</p>
                                                <p class="text-xs text-gray-600 dark:text-gray-400">
                                                    M2 - (majeur)
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-4 py-3 px-4 text-sm font-bold text-yellow-500">DRAFT</td>
                                </tr>
                                <tr
                                    class="bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-900"
                                >
                                    <td class="py-3 px-4 text-sm">
                                        <span class="flex items-center">
                                            <svg
                                                class="mr-1 h-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 50 50"
                                            >
                                                <path
                                                    d="M11 4c-3.855 0-7 3.145-7 7v28c0 3.855 3.145 7 7 7h28c3.855 0 7-3.145 7-7V11c0-3.855-3.145-7-7-7zm0 2h28c2.773 0 5 2.227 5 5v28c0 2.773-2.227 5-5 5H11c-2.773 0-5-2.227-5-5V11c0-2.773 2.227-5 5-5zm25.234 9.832l-13.32 15.723-8.133-7.586-1.363 1.465 9.664 9.015 14.684-17.324z"
                                                />
                                            </svg>
                                            Application development
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-sm">Category</td>
                                    <td class="py-3 px-4 text-sm">Aug 21, 2018</td>
                                    <td class="py-3 px-4">
                                        <div class="flex items-center text-sm">
                                            <div class="relative mr-3 hidden h-8 w-8 rounded-full md:block">
                                                <img
                                                    class="h-full w-full rounded-full object-cover"
                                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=200&amp;facepad=3&amp;fit=facearea&amp;s=707b9c33066bf8808c934c8ab394dff6"
                                                    alt=""
                                                    loading="lazy"
                                                />
                                                <div
                                                    class="absolute inset-0 rounded-full shadow-inner"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div>
                                                <p class="font-semibold">Lionel TOGLAN</p>
                                                <p class="text-xs text-gray-600 dark:text-gray-400">
                                                    L1 - Classique B
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-1 py-3 px-4 text-sm font-bold text-green-600">
                                        PUBLISHED
                                    </td>
                                </tr>
                                <tr
                                    class="bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-900"
                                >
                                    <td class="py-3 px-4 text-sm">
                                        <span class="flex items-center">
                                            <svg
                                                class="mr-1 h-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 50 50"
                                            >
                                                <path
                                                    d="M11 4c-3.855 0-7 3.145-7 7v28c0 3.855 3.145 7 7 7h28c3.855 0 7-3.145 7-7V11c0-3.855-3.145-7-7-7zm0 2h28c2.773 0 5 2.227 5 5v28c0 2.773-2.227 5-5 5H11c-2.773 0-5-2.227-5-5V11c0-2.773 2.227-5 5-5zm25.234 9.832l-13.32 15.723-8.133-7.586-1.363 1.465 9.664 9.015 14.684-17.324z"
                                                />
                                            </svg>
                                            Hello World
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-sm">Course</td>
                                    <td class="py-3 px-4 text-sm">Aug 21, 2018</td>
                                    <td class="py-3 px-4">
                                        <div class="flex items-center text-sm">
                                            <div class="relative mr-3 hidden h-8 w-8 rounded-full md:block">
                                                <img
                                                    class="h-full w-full rounded-full object-cover"
                                                    src="https://images.unsplash.com/photo-1502720705749-871143f0e671?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=200&amp;fit=max&amp;s=b8377ca9f985d80264279f277f3a67f5"
                                                    alt=""
                                                    loading="lazy"
                                                />
                                                <div
                                                    class="absolute inset-0 rounded-full shadow-inner"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div>
                                                <p class="font-semibold">Clemence MARCOU</p>
                                                <p class="text-xs text-gray-600 dark:text-gray-400">
                                                    L1 - Int.1
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-1 py-3 px-4 text-sm font-bold text-green-600">
                                        PUBLISHED
                                    </td>
                                </tr>
                                <tr
                                    class="bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-900"
                                >
                                    <td class="py-3 px-4 text-sm">
                                        <span class="flex items-center">
                                            <svg
                                                class="mr-1 h-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 50 50"
                                            >
                                                <path
                                                    d="M11 4c-3.855 0-7 3.145-7 7v28c0 3.855 3.145 7 7 7h28c3.855 0 7-3.145 7-7V11c0-3.855-3.145-7-7-7zm0 2h28c2.773 0 5 2.227 5 5v28c0 2.773-2.227 5-5 5H11c-2.773 0-5-2.227-5-5V11c0-2.773 2.227-5 5-5zm25.234 9.832l-13.32 15.723-8.133-7.586-1.363 1.465 9.664 9.015 14.684-17.324z"
                                                />
                                            </svg>
                                            Python Basics
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-sm">Lesson</td>
                                    <td class="py-3 px-4 text-sm">Aug 21, 2018</td>
                                    <td class="py-3 px-4">
                                        <div class="flex items-center text-sm">
                                            <div class="relative mr-3 hidden h-8 w-8 rounded-full md:block">
                                                <img
                                                    class="h-full w-full rounded-full object-cover"
                                                    src="https://images.unsplash.com/photo-1551006917-3b4c078c47c9?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=200&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                                                    alt=""
                                                    loading="lazy"
                                                />
                                                <div
                                                    class="absolute inset-0 rounded-full shadow-inner"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div>
                                                <p class="font-semibold">Yoke NGASSA</p>
                                                <p class="text-xs text-gray-600 dark:text-gray-400">
                                                    L1 - Int.1
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-1 py-3 px-4 text-sm font-bold text-green-600">
                                        PUBLISHED
                                    </td>
                                </tr>
                                <tr
                                    class="bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-900"
                                >
                                    <td class="py-3 px-4 text-sm">
                                        <span class="flex items-center">
                                            <svg
                                                class="mr-1 h-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 50 50"
                                            >
                                                <path
                                                    d="M11 4c-3.855 0-7 3.145-7 7v28c0 3.855 3.145 7 7 7h28c3.855 0 7-3.145 7-7V11c0-3.855-3.145-7-7-7zm0 2h28c2.773 0 5 2.227 5 5v28c0 2.773-2.227 5-5 5H11c-2.773 0-5-2.227-5-5V11c0-2.773 2.227-5 5-5zm25.234 9.832l-13.32 15.723-8.133-7.586-1.363 1.465 9.664 9.015 14.684-17.324z"
                                                />
                                            </svg>
                                            APIs
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-sm">Lesson</td>
                                    <td class="py-3 px-4 text-sm">Aug 21, 2018</td>
                                    <td class="py-3 px-4">
                                        <div class="flex items-center text-sm">
                                            <div class="relative mr-3 hidden h-8 w-8 rounded-full md:block">
                                                <img
                                                    class="h-full w-full rounded-full object-cover"
                                                    src="https://images.unsplash.com/photo-1566411520896-01e7ca4726af?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=200&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                                                    alt=""
                                                    loading="lazy"
                                                />
                                                <div
                                                    class="absolute inset-0 rounded-full shadow-inner"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div>
                                                <p class="font-semibold">Elliot MAISL</p>
                                                <p class="text-xs text-gray-600 dark:text-gray-400">Grade</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-4 py-3 px-4 text-sm font-bold text-red-500">
                                        WRONG FORMAT
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div
                        class="grid border-t bg-gray-50 py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:grid-cols-9"
                    >
                        <span class="col-span-3 flex items-center"> Showing 21-30 of 100 </span>
                        <span class="col-span-2" />
                        <!-- Pagination -->
                        <span class="col-span-4 mt-2 flex sm:mt-auto sm:justify-end">
                            <nav aria-label="Table navigation">
                                <ul class="inline-flex items-center">
                                    <li>
                                        <button
                                            class="focus:shadow-outline-purple rounded-md rounded-l-lg py-1 px-3 focus:outline-none"
                                            aria-label="Previous"
                                        >
                                            <svg
                                                aria-hidden="true"
                                                class="h-4 w-4 fill-current"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                    clip-rule="evenodd"
                                                    fill-rule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            class="focus:shadow-outline-purple rounded-md py-1 px-3 focus:outline-none"
                                        >
                                            1
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            class="focus:shadow-outline-purple rounded-md py-1 px-3 focus:outline-none"
                                        >
                                            2
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            class="focus:shadow-outline-purple rounded-md border border-r-0 border-blue-600 bg-blue-600 py-1 px-3 text-white transition-colors duration-150 focus:outline-none dark:border-gray-100 dark:bg-gray-100 dark:text-gray-800"
                                        >
                                            3
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            class="focus:shadow-outline-purple rounded-md py-1 px-3 focus:outline-none"
                                        >
                                            4
                                        </button>
                                    </li>
                                    <li>
                                        <span class="py-1 px-3">...</span>
                                    </li>
                                    <li>
                                        <button
                                            class="focus:shadow-outline-purple rounded-md py-1 px-3 focus:outline-none"
                                        >
                                            8
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            class="focus:shadow-outline-purple rounded-md py-1 px-3 focus:outline-none"
                                        >
                                            9
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            class="focus:shadow-outline-purple rounded-md rounded-r-lg py-1 px-3 focus:outline-none"
                                            aria-label="Next"
                                        >
                                            <svg
                                                class="h-4 w-4 fill-current"
                                                aria-hidden="true"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clip-rule="evenodd"
                                                    fill-rule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                cards: [
                    {
                        title: 'Pages',
                        quantity: 1345,
                        link: '#',
                        class: 'bg-green-500 bg-1',
                    },
                    {
                        title: 'Posts',
                        quantity: 12456,
                        link: '#',
                        class: 'bg-purple-400 bg-1',
                    },
                    {
                        title: 'Utilisateurs',
                        quantity: 21,
                        link: '#',
                        class: 'bg-orange-400 bg-1',
                    },
                    {
                        title: 'Fichiers',
                        quantity: 1220,
                        link: '#',
                        class: 'bg-blue-400 bg-1',
                    },
                    {
                        title: 'Catégories',
                        quantity: 65,
                        link: '#',
                        class: 'bg-gray-800 bg-1',
                    },
                    {
                        title: 'Commentaires',
                        quantity: 9876,
                        link: '#',
                        class: 'bg-gray-400 bg-1',
                    },
                ],
                statistics: [
                    {
                        title: 'Utilisateurs actifs',
                        quantity: 1257,
                    },
                    {
                        title: 'Nouveaux articles',
                        quantity: 557,
                    },
                    {
                        title: 'Partages',
                        quantity: 11257,
                    },
                    {
                        title: 'Vues',
                        quantity: 7525,
                    },
                ],
            }
        },
    }
</script>
