<template>
    <div class="card-0 flex h-[14rem] flex-col items-center justify-between">
        <DocumentIcon :file="file" class="flex h-full w-20 items-center justify-center" />
        <div class="flex w-full flex-col items-start gap-1 self-start">
            <h4 class="font-semibold line-clamp-1">{{ file.name }}</h4>
            <div class="flex w-full justify-between">
                <div class="flex items-center gap-2">
                    <i
                        v-tooltip="fileType.text"
                        class="flex h-6 w-6 items-center justify-center rounded-md text-sm text-white"
                        :class="[fileType.icon, fileType.color]"
                    />
                    <div v-if="$slots.inner" class="file-card-inner">
                        <slot name="inner" />
                    </div>
                    <TipRelativeDate
                        v-else-if="file.lastModifiedAt"
                        :date="file.lastModifiedAt"
                        date-style="short"
                        text-class="file-card-inner"
                    />
                    <div v-else-if="file.inner" class="file-card-inner">
                        {{ file.inner }}
                    </div>
                </div>
                <ModalDropdown :buttons="buttons" />
                <!-- <i
                    v-tooltip="'test'"
                    class="fa fa-ellipsis-vertical z-20 mx-2 flex h-6 w-6 items-center justify-end text-xl"
                /> -->
            </div>
        </div>
        <!-- <div class="flex items-center justify-center gap-2">
            <button
                v-if="canDelete"
                title="Enlever le fichier"
                @click.prevent="$emit('delete', file.fileUploadId)"
            >
                <i class="fas fa-times text-red-500" />
            </button>
            <button v-if="canDownload" title="Télécharger le fichier" @click.prevent="downloadFile(file)">
                <i class="fa-solid fa-cloud-arrow-down text-blue-500"></i>
            </button>
        </div> -->
    </div>
</template>

<script setup>
    import FormKitBuilder from '@/components/FormKit/FormKitBuilder.vue'
    import ModalDropdown from '@/components/UI/Modal/ModalDropdown.vue'
    import DocumentIcon from '@/components/Document/DocumentIcon.vue'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'

    import { FOLDER, FORM, getType } from '@/shared/assets/file-types.js'
    import { download, downloadFile } from '@/utils/downloadFile'

    import { markRaw, ref } from 'vue'
    import { emitter } from '@/shared/modules/emitter'

    const props = defineProps({
        file: {
            type: Object,
            required: true,
        },
        canDelete: {
            type: Boolean,
            default: true,
        },
        canDownload: {
            type: Boolean,
            default: true,
        },
    })

    defineEmits(['delete'])

    const rename = ref(false)

    const fileType = getType(props.file)
    const buttons = [
        {
            name: 'Renommer',
            icon: 'fa fa-pencil',
            class: 'hover:bg-green-300 dark:hover:bg-green-500',
            action: () => {
                rename.value = true
            },
        },
        {
            name: 'Télécharger',
            icon: 'fa fa-download',
            class: 'hover:bg-blue-300 dark:hover:bg-blue-500',
            action: () => {
                if (fileType.parentType === FORM) {
                    const dataSrc =
                        'data:text/json;charset=utf-8,' +
                        encodeURIComponent(JSON.stringify(props.file.meta?.schema))
                    download(dataSrc, props.file.name + '.json')
                } else if (fileType.type === FOLDER) {
                    // Compress folder and download
                } else {
                    downloadFile(props.file, !props.file.url)
                }
            },
        },
        ...(fileType.parentType === FORM && props.file.id
            ? [
                  {
                      name: 'Modifier',
                      icon: 'fa fa-edit',
                      class: 'hover:bg-gray-300 dark:hover:bg-gray-500',
                      action: () =>
                          emitter.emit('show-bottom-sheet', {
                              title: 'Modification de formulaire ✏️',
                              component: markRaw(FormKitBuilder),
                              props: { form: { ...props.file }, teamId: props.file.teamId },
                          }),
                  },
              ]
            : []),
    ]
</script>

<style lang="scss">
    .file-card-inner {
        @apply text-3-light dark:text-3-dark text-sm italic;
    }
</style>
