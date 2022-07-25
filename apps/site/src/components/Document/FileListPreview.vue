<template>
    <div>
        <transition name="fade" mode="out-in">
            <table v-if="previewByTable" class="w-full table-auto text-center">
                <thead>
                    <tr>
                        <th />
                        <th>Nom</th>
                        <th>Date</th>
                        <th>Taille</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(folder, i) in folderList.children"
                        :key="i"
                        class="cursor-pointer hover:bg-2-light hover:dark:bg-2-dark"
                        @click="
                            $emit('update:folderList', {
                                children: folder.children,
                                filters: { ...folderList.filters, [folder.context]: folder.title },
                            })
                        "
                    >
                        <td class="rounded-l-xl p-2 pl-4">
                            <i class="fas fa-folder text-2xl" />
                        </td>
                        <td class="p-2">
                            {{ contextList[folder.context](folder.title) }}
                        </td>
                        <td></td>
                        <td></td>
                        <td class="rounded-r-xl pr-4"></td>
                    </tr>

                    <tr
                        v-for="(file, i) in fileList"
                        :key="i"
                        class="group cursor-pointer hover:bg-2-light hover:dark:bg-2-dark"
                        :class="[file == filePreview ? 'bg-2' : '']"
                        @click="$emit('update:filePreview', file)"
                    >
                        <td class="rounded-l-xl p-2 pl-4">
                            <div class="flex items-center justify-center gap-2">
                                <div class="flex items-center justify-center">
                                    <input
                                        :class="[
                                            downloadFileGroup.length == 0
                                                ? 'invisible group-hover:visible'
                                                : '',
                                        ]"
                                        class="hidden md:block"
                                        type="checkbox"
                                        :checked="downloadFileGroup.includes(file)"
                                        @click="updateFileGroup(file)"
                                    />
                                </div>

                                <div class="relative flex items-center justify-center">
                                    <DocumentIcon
                                        class="h-8 w-8"
                                        :mime="file.file.mimeType"
                                        :file-name="file.file.name"
                                    />
                                    <div
                                        v-if="file.file.user.roles.includes('moderator')"
                                        class="absolute -top-3 right-0"
                                    >
                                        <Popper :hover="true" :arrow="true">
                                            <i class="fas fa-certificate cursor-auto text-xs text-blue-500" />
                                            <template #content>
                                                <div
                                                    class="bg-1 whitespace-nowrap rounded p-2 px-3 shadow-md"
                                                >
                                                    Partagé par un prof
                                                </div>
                                            </template>
                                        </Popper>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="p-2">
                            <div class="flex items-center justify-center truncate">
                                {{ file.file.name }}
                            </div>
                        </td>
                        <td class="p-2">
                            <div class="flex items-center justify-center">
                                {{ new Date(file.createdAt).toLocaleDateString() }}
                            </div>
                        </td>
                        <td class="p-2">
                            <div class="flex items-center justify-center">
                                {{ formatBytes(file.file.fileSize) }}
                            </div>
                        </td>
                        <td class="rounded-r-xl pr-4">
                            <div
                                class="invisible flex items-center justify-center hover:cursor-pointer group-hover:visible"
                            >
                                <ModalDropdown :buttons="dropDownButtons(file)">
                                    <i class="fas fa-ellipsis-h" />
                                </ModalDropdown>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="flex gap-2">
                <div
                    v-for="(folder, i) in folderList.children"
                    :key="i"
                    class="group relative flex w-1/5 cursor-pointer flex-col items-center justify-center gap-1 rounded"
                    @click="
                        $emit('update:folderList', {
                            children: folder.children,
                            filters: { ...folderList.filters, [folder.context]: folder.title },
                        })
                    "
                >
                    <div class="flex flex-col items-center justify-center gap-1">
                        <i class="fas fa-certificate text-3xl" />
                        <div class="w-full truncate text-center text-sm">
                            {{ contextList[folder.context](folder.title) }}
                        </div>
                    </div>
                </div>
                <div
                    v-for="(file, i) in fileList"
                    :key="i"
                    class="group relative flex w-1/5 flex-col items-center justify-center gap-1 rounded hover:bg-2-light hover:dark:bg-2-dark"
                >
                    <input
                        type="checkbox"
                        class="absolute top-0 left-0 hidden md:block"
                        :class="[downloadFileGroup.length == 0 ? 'invisible group-hover:visible' : '']"
                        :checked="downloadFileGroup.includes(file)"
                        @click="updateFileGroup(file)"
                    />
                    <Popper offset-distance="0" :interactive="false" class="w-full">
                        <div
                            class="flex w-full flex-col items-center justify-center gap-1"
                            @click="$emit('update:filePreview', file)"
                        >
                            <DocumentIcon
                                class="h-12 w-12"
                                :mime="file.file.mimeType"
                                :file-name="file.file.name"
                            />
                            <div class="w-full truncate text-center text-sm">
                                {{ file.file.name }}
                            </div>
                        </div>

                        <template #content>
                            <div class="card flex flex-col p-2">
                                <div
                                    v-for="(button, _, j) in dropDownButtons(file)"
                                    :key="j"
                                    class="flex items-center justify-center gap-2 rounded-xl py-2 px-4 hover:text-white"
                                    :class="button.class"
                                    @click="button.action()"
                                >
                                    <i class="fas" :class="`fa-${button.icon}`" />
                                    <p>{{ button.name }}</p>
                                </div>
                            </div>
                        </template>
                    </Popper>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import DocumentIcon from '@/components/Document/DocumentIcon.vue'
    import ModalDropdown from '@/components/UI/Modal/ModalDropdown.vue'
    import Popper from 'vue3-popper'

    import formatBytes from '@/utils/formatByteSize'

    export default {
        components: {
            DocumentIcon,
            Popper,
            ModalDropdown,
        },
        props: {
            fileList: {
                type: Array,
                default: () => [],
            },
            folderList: {
                type: Object,
                required: true,
            },
            previewByTable: {
                type: Boolean,
                default: true,
            },
            filePreview: {
                type: null,
                required: true,
            },
            downloadFileGroup: {
                type: null,
                required: true,
            },
        },
        emits: {
            'update:folderList': null,
            'update:filePreview': null,
            'update:downloadFileGroup': null,
        },
        data() {
            return {
                formatBytes,
                contextList: {
                    schoolYear: (val) => ['L1', 'L2', 'L3', 'M1', 'M2'][val],
                    subject: (val) => val,
                    type: (val) => val,
                    year: (val) => val,
                    query: (val) => val,
                },
            }
        },
        methods: {
            dropDownButtons(doc) {
                return {
                    open: {
                        name: 'Voir',
                        icon: 'eye',
                        class: 'hover:bg-green-500 hover:text-white',
                        action: () => {
                            window.open(doc.file.url, '_blank').focus()
                        },
                    },
                    download: {
                        name: 'Télécharger',
                        icon: 'arrow-down',
                        class: 'hover:bg-green-500 hover:text-white',
                        action: () => {
                            console.log(doc)
                            this.$store.dispatch('files/downloadFile', {
                                url: doc.file.url,
                                label: doc.file.name,
                            })
                        },
                    },
                    copy: {
                        name: 'Copier le lien',
                        icon: 'link',
                        class: 'hover:bg-blue-500 hover:text-white',
                        action: () => {
                            navigator.clipboard.writeText(doc.file.url)
                        },
                    },
                    delete: {
                        name: 'Supprimer',
                        icon: 'times',
                        class: 'hover:bg-red-500 hover:text-white',
                        // TODO: delete ("archive") file
                        action: () => {
                            console.log('Delete (placeholder)', doc)
                        },
                    },
                }
            },
            updateFileGroup(file) {
                if (this.downloadFileGroup.includes(file)) {
                    this.$emit(
                        'update:downloadFileGroup',
                        this.downloadFileGroup.filter((f) => f != file),
                    )
                } else {
                    this.$emit('update:downloadFileGroup', [...this.downloadFileGroup, file])
                }
            },
        },
    }
</script>
