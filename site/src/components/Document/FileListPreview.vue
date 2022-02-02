<template>
    <div>
        <transition name="fade" mode="out-in">
            <table v-if="previewByTable" class="w-full text-center table-auto">
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
                        class="hover:bg-2-light hover:dark:bg-2-dark cursor-pointer"
                        @click="
                            $emit('update:folderList', {
                                children: folder.children,
                                filters: { ...folderList.filters, [folder.context]: folder.title },
                            })
                        "
                    >
                        <td class="p-2 pl-4 rounded-l-xl">
                            <font-awesome-icon size="2x" icon="folder"></font-awesome-icon>
                        </td>
                        <td class="p-2">
                            {{ contextList[folder.context](folder.title) }}
                        </td>
                        <td></td>
                        <td></td>
                        <td class="pr-4 rounded-r-xl"></td>
                    </tr>

                    <tr
                        v-for="(file, i) in fileList"
                        :key="i"
                        class="group hover:bg-2-light hover:dark:bg-2-dark cursor-pointer"
                        :class="[file == filePreview ? 'bg-2' : '']"
                        @click="$emit('update:filePreview', file)"
                    >
                        <td class="p-2 pl-4 rounded-l-xl">
                            <div class="flex gap-2 justify-center items-center">
                                <div class="flex justify-center items-center">
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

                                <div class="flex relative justify-center items-center">
                                    <DocumentIcon
                                        class="w-8 h-8"
                                        :mime="file.file.mimeType"
                                        :file-name="file.file.name"
                                    />
                                    <div
                                        v-if="file.file.user.roles.includes('moderator')"
                                        class="absolute -top-3 right-0"
                                    >
                                        <Popper :hover="true" :arrow="true">
                                            <font-awesome-icon
                                                class="text-blue-500 cursor-auto"
                                                icon="certificate"
                                                size="xs"
                                            ></font-awesome-icon>
                                            <template #content>
                                                <div
                                                    class="p-2 px-3 whitespace-nowrap rounded shadow-lg bg-1"
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
                            <div class="flex justify-center items-center truncate">
                                {{ file.file.name }}
                            </div>
                        </td>
                        <td class="p-2">
                            <div class="flex justify-center items-center">
                                {{ new Date(file.createdAt).toLocaleDateString() }}
                            </div>
                        </td>
                        <td class="p-2">
                            <div class="flex justify-center items-center">
                                {{ formatBytes(file.file.fileSize) }}
                            </div>
                        </td>
                        <td class="pr-4 rounded-r-xl">
                            <div
                                class="flex invisible group-hover:visible justify-center items-center hover:cursor-pointer"
                            >
                                <DropDownInput :buttons="dropDownButtons(file)">
                                    <font-awesome-icon icon="ellipsis-h" />
                                </DropDownInput>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="flex gap-2">
                <div
                    v-for="(folder, i) in folderList.children"
                    :key="i"
                    class="group flex relative flex-col gap-1 justify-center items-center w-1/5 rounded cursor-pointer"
                    @click="
                        $emit('update:folderList', {
                            children: folder.children,
                            filters: { ...folderList.filters, [folder.context]: folder.title },
                        })
                    "
                >
                    <div class="flex flex-col gap-1 justify-center items-center">
                        <font-awesome-icon size="3x" icon="folder"></font-awesome-icon>
                        <div class="w-full text-sm text-center truncate">
                            {{ contextList[folder.context](folder.title) }}
                        </div>
                    </div>
                </div>
                <div
                    v-for="(file, i) in fileList"
                    :key="i"
                    class="group flex relative flex-col gap-1 justify-center items-center w-1/5 hover:bg-2-light hover:dark:bg-2-dark rounded"
                >
                    <input
                        type="checkbox"
                        class="hidden absolute top-0 left-0 md:block"
                        :class="[downloadFileGroup.length == 0 ? 'invisible group-hover:visible' : '']"
                        :checked="downloadFileGroup.includes(file)"
                        @click="updateFileGroup(file)"
                    />
                    <Popper :offset-distance="'0'" :interactive="false" class="w-full">
                        <div
                            class="flex flex-col gap-1 justify-center items-center w-full"
                            @click="$emit('update:filePreview', file)"
                        >
                            <DocumentIcon
                                class="w-12 h-12"
                                :mime="file.file.mimeType"
                                :file-name="file.file.name"
                            />
                            <div class="w-full text-sm text-center truncate">
                                {{ file.file.name }}
                            </div>
                        </div>

                        <template #content>
                            <div class="flex flex-col p-2 card">
                                <div
                                    v-for="(button, index) in dropDownButtons(file)"
                                    :key="index"
                                    class="flex gap-2 justify-center items-center py-2 px-4 hover:text-white rounded-xl"
                                    :class="button.class"
                                    @click="button.action()"
                                >
                                    <font-awesome-icon :icon="button.icon" />
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
    import DropDownInput from '@/components/Input/DropDownInput.vue'
    import formatBytes from '@/utils/formatByteSize'
    import Popper from 'vue3-popper'
    export default {
        components: {
            DocumentIcon,
            Popper,
            DropDownInput,
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
                return [
                    {
                        name: 'Voir',
                        icon: 'eye',
                        class: 'hover:bg-green-500 hover:text-white',
                        action: () => {
                            window.open(doc.file.url, '_blank').focus()
                        },
                    },
                    {
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
                    {
                        name: 'Copier le lien',
                        icon: 'link',
                        class: 'hover:bg-blue-500 hover:text-white',
                        action: () => {
                            navigator.clipboard.writeText(doc.file.url)
                        },
                    },
                    {
                        name: 'Supprimer',
                        icon: 'times',
                        class: 'hover:bg-red-500 hover:text-white',
                        // TODO: delete ("archive") file
                        action: () => {
                            console.log('Delete (placeholder)', doc)
                        },
                    },
                ]
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
