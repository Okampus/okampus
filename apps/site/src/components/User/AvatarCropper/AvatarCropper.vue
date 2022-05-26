<template>
    <div v-if="modelValue" class="vue-image-crop-upload">
        <div class="rounded-lg vicp-wrap bg-2">
            <div class="vicp-close" @click="close">
                <i class="vicp-icon4" />
            </div>

            <div v-show="step === STEP_UPLOAD" class="vicp-step1">
                <div
                    class="vicp-drop-area input"
                    @dragleave="preventDefault"
                    @dragover="preventDefault"
                    @dragenter="preventDefault"
                    @click="clickOnDropArea"
                    @drop="fileInputChange"
                >
                    <i v-show="loading !== LOADING_UPLOADING" class="text-2xl fa fa-file-arrow-up" />

                    <span v-show="loading !== LOADING_UPLOADING" class="vicp-hint">{{ lang.hint }}</span>

                    <span v-show="!isSupported" class="vicp-no-supported-hint">{{ lang.noSupported }}</span>

                    <input
                        v-show="false"
                        v-if="step === STEP_UPLOAD"
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        @change="fileInputChange"
                    />
                </div>
                <div v-show="hasError" class="vicp-error"><i class="vicp-icon2" /> {{ errorMsg }}</div>
                <div class="text-blue-500 vicp-operate">
                    <a @click="close">{{ lang.btn.off }}</a>
                </div>
            </div>

            <div v-if="step === STEP_CROP" class="vicp-step2">
                <div class="vicp-crop">
                    <div v-show="true" class="vicp-crop-left">
                        <div class="vicp-img-container" @wheel.prevent="handleZoom">
                            <img
                                ref="img"
                                :src="sourceImgUrl"
                                :style="{
                                    top: `${scale.y + sourceImgMasking.y}px`,
                                    left: `${scale.x + sourceImgMasking.x}px`,
                                    width: `${scale.width}px`,
                                    height: `${scale.height}px`,
                                }"
                                class="vicp-img"
                                draggable="false"
                                @load="onLoadImg"
                                @drag="preventDefault"
                                @dragstart="preventDefault"
                                @dragend="preventDefault"
                                @dragleave="preventDefault"
                                @dragover="preventDefault"
                                @dragenter="preventDefault"
                                @drop="preventDefault"
                                @touchstart="imgStartMove"
                                @touchmove="imgMove"
                                @touchend="createImg"
                                @touchcancel="createImg"
                                @mousedown="imgStartMove"
                                @mousemove="imgMove"
                                @mouseup="createImg"
                                @mouseout="createImg"
                            />
                            <div class="vicp-img-shade vicp-img-shade-1" :style="sourceImgShadeStyle" />
                            <div class="vicp-img-shade vicp-img-shade-2" :style="sourceImgShadeStyle" />
                        </div>

                        <div class="vicp-range">
                            <input
                                v-model="scale.range"
                                type="range"
                                step="1"
                                min="0"
                                max="100"
                                @mousemove="(e) => zoomImg(e.target.value)"
                            />
                            <i
                                class="vicp-icon5"
                                @mousedown="startZoom(-1)"
                                @mouseout="scale.zooming = false"
                                @mouseup="scale.zooming = false"
                            />
                            <i
                                class="vicp-icon6"
                                @mousedown="startZoom(1)"
                                @mouseout="scale.zooming = false"
                                @mouseup="scale.zooming = false"
                            />
                        </div>

                        <div class="vicp-rotate">
                            <i @click="rotateImg">↻</i>
                        </div>
                    </div>
                    <div class="vicp-crop-right">
                        <div class="vicp-preview">
                            <div class="vicp-preview-item">
                                <img :src="createImgUrl" :style="previewStyle" />
                                <span>{{ lang.preview }}</span>
                            </div>
                            <div class="vicp-preview-item vicp-preview-item-circle">
                                <img :src="createImgUrl" :style="previewStyle" />
                                <span>{{ lang.preview }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-blue-500 vicp-operate">
                    <a @click="step = STEP_UPLOAD">{{ lang.btn.back }}</a>
                    <a class="vicp-operate-btn" @click="upload">{{ lang.btn.save }}</a>
                </div>
            </div>

            <div v-if="step === STEP_SUCCESS" class="vicp-step3">
                <div class="vicp-upload">
                    <span v-show="loading === LOADING_UPLOADING" class="vicp-loading">{{
                        lang.loading
                    }}</span>
                    <div class="vicp-progress-wrap">
                        <span
                            v-show="loading === LOADING_UPLOADING"
                            class="vicp-progress"
                            :style="{ width: `${progress}%` }"
                        />
                    </div>
                    <div v-show="hasError" class="text-red-500 vicp-error">
                        <i class="vicp-icon2" /> {{ errorMsg }}
                    </div>
                    <div v-show="loading === LOADING_SUCCESS" class="flex text-blue-500 vicp-success">
                        <i class="mr-2 fa fa-check" />
                        {{ lang.success }}
                    </div>
                </div>
                <div class="text-blue-500 vicp-operate">
                    <a @click="step = STEP_CROP">{{ lang.btn.back }}</a>
                    <a @click="close">{{ lang.btn.close }}</a>
                </div>
            </div>
            <canvas v-show="false" ref="canvas" :width="width" :height="height" />
        </div>
    </div>
</template>

<script setup>
    import language from './utils/language.js'
    import data2blob from './utils/data2blob.js'

    import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
    import { height } from 'tailwindcss/defaultTheme'

    import { clamp } from 'lodash'

    const props = defineProps({
        modelValue: {
            type: Boolean,
            required: true,
        },
        uploadType: {
            type: String,
            default: 'avatar',
        },
        uploadField: {
            type: String,
            default: 'file',
        },
        callback: {
            type: Function,
            required: true,
        },
        width: {
            type: Number,
            default: 150,
        },
        height: {
            type: Number,
            default: 150,
        },
        maxSize: {
            // Max size in KB
            type: Number,
            default: 1024 * 2, // 2 MB
        },
        minSize: {
            type: Number,
            default: 0,
        },
        allowImgFormat: {
            type: Array,
            default: () => ['gif', 'jpg', 'png'],
        },
        initialImgUrl: {
            type: String,
            default: '',
        },
    })

    const emit = defineEmits([
        'src-file-set',
        'crop-success',
        'crop-upload-success',
        'crop-upload-fail',
        'update:modelValue',
    ])

    // Constants

    const STEP_UPLOAD = 1
    const STEP_CROP = 2
    const STEP_SUCCESS = 3

    const LOADING_NONE = 0
    const LOADING_UPLOADING = 1
    const LOADING_SUCCESS = 2
    const LOADING_FAIL = 3

    const IMG_FORMAT = 'png'
    const IMG_MIME = 'image/png'

    const lang = language['fr']

    const ratio = props.width / props.height

    // Datas
    const step = ref(STEP_UPLOAD)
    const loading = ref(LOADING_NONE)
    const progress = ref(0)

    const hasError = ref(false)
    const errorMsg = ref('')

    const sourceImgUrl = ref('')
    const createImgUrl = ref('')

    const isSupported = typeof FormData === 'function' && typeof FileReader === 'function'

    const sourceImgMouseDown = ref({
        on: false,
        mX: 0,
        mY: 0,
        x: 0,
        y: 0,
    })

    const previewContainer = ref({
        width: 100,
        height: 100,
    })

    const sourceImgContainer = ref({
        width: 240,
        height: 184,
    })

    const scale = ref({
        zooming: false,
        range: 1,

        x: 0,
        y: 0,
        width: 0,
        height: 0,
        maxWidth: 0,
        maxHeight: 0,
        minWidth: 0,
        minHeight: 0,
        originalWidth: 0,
        originalHeight: 0,
    })

    // Close & mount
    const close = () => {
        emit('update:modelValue', false)
        if (step.value === STEP_SUCCESS && loading.value == LOADING_SUCCESS) {
            step.value = STEP_UPLOAD
        }
    }

    const closeOnEsc = (e) => {
        if (e.key == 'Escape' || e.keyCode == 27) {
            close()
        }
    }

    onMounted(() => {
        document.addEventListener('keydown', closeOnEsc)
        if (props.sourceImgUrl) {
            step.value = STEP_CROP
            sourceImgUrl.value = props.sourceImgUrl
        }
    })

    onUnmounted(() => {
        document.removeEventListener('keydown', closeOnEsc)
    })

    // Refs
    const fileInput = ref(null)
    const canvas = ref(null)
    const img = ref(null)

    const sourceImgMasking = computed(() => {
        const container = sourceImgContainer.value
        const containerRatio = container.width / container.height
        if (ratio < containerRatio) {
            return {
                scale: container.height / props.height,
                x: (container.width - container.height * ratio) / 2,
                y: 0,
                width: container.height * ratio,
                height: container.height,
            }
        }

        if (ratio > containerRatio) {
            return {
                scale: container.width / props.width,
                x: 0,
                y: (container.height - container.width / ratio) / 2,
                width: container.width,
                height: container.width / ratio,
            }
        }

        return { scale: 1, x: 0, y: 0, width: container.width, height: container.height }
    })

    const sourceImgShadeStyle = computed(() => {
        const container = sourceImgContainer.value
        const mask = sourceImgMasking.value
        return {
            width: `${container.width === mask.width ? mask.width : (container.width - mask.width) / 2}px`,
            height: `${
                container.height === mask.height ? mask.height : (container.height - mask.height) / 2
            }px`,
        }
    })

    const previewStyle = computed(() => {
        const preview = previewContainer.value
        const previewRatio = preview.width / preview.height
        return {
            width: `${ratio < previewRatio ? preview.width : preview.height * ratio}px`,
            height: `${ratio < previewRatio ? preview.width / ratio : preview.height}px`,
        }
    })

    const reset = () => {
        loading.value = LOADING_NONE
        hasError.value = false
        errorMsg.value = ''
        progress.value = 0
    }

    watch(
        () => props.modelValue,
        (val) => {
            if (val && loading.value !== LOADING_UPLOADING) {
                reset()
            }
        },
    )

    const preventDefault = (e) => {
        e.preventDefault()
        return false
    }

    const clickOnDropArea = () => {
        if (loading.value !== LOADING_UPLOADING) {
            fileInput.value.click()
        }
    }

    const fileInputChange = (e) => {
        // e.preventDefault()
        if (loading.value !== LOADING_UPLOADING) {
            let files = e.target.files || e.dataTransfer.files

            reset()
            if (files && checkFile(files[0])) {
                setSourceImg(files[0])
            }
        }
    }

    const checkFile = (file) => {
        if (file.type.indexOf('image') === -1) {
            hasError.value = true
            errorMsg.value = lang.error.onlyImg
            return false
        }

        if (file.size / 1024 > props.maxSize) {
            hasError.value = true
            errorMsg.value = lang.error.outOfSize + props.maxSize + 'kb'
            return false
        }
        return true
    }

    const setSourceImg = (file) => {
        emit('src-file-set', file.name, file.type, file.size)

        const fr = new FileReader()
        fr.addEventListener('load', () => {
            step.value = STEP_CROP
            sourceImgUrl.value = fr.result
            // startCrop()
        })

        fr.readAsDataURL(file)
    }

    const onLoadImg = () => {
        const mask = sourceImgMasking.value

        const imgWidth = img.value.naturalWidth
        const imgHeight = img.value.naturalHeight
        const imgRatio = imgWidth / imgHeight

        if (imgWidth < props.width || imgHeight < props.height) {
            step.value = STEP_UPLOAD
            hasError.value = true
            errorMsg.value = lang.error.lowestPx + props.width + '*' + props.height
            return false
        }
        const width = ratio > imgRatio ? mask.width : mask.height * imgRatio
        const height = ratio > imgRatio ? mask.width / imgRatio : mask.height

        const x = ratio > imgRatio ? 0 : (mask.width - props.width) / 2
        const y = ratio > imgRatio ? (mask.height - props.height) / 2 : 0

        scale.value = {
            ...scale.value,
            range: 0,
            x,
            y,
            width,
            height,
            minWidth: width,
            minHeight: height,
            maxWidth: imgWidth * mask.scale,
            maxHeight: imgHeight * mask.scale,
            originalWidth: imgWidth,
            originalHeight: imgHeight,
        }

        createImg()

        step.value = STEP_CROP
    }

    // img.value.src = sourceImgUrl
    // }

    // const startCrop = () => {
    //     const mask = sourceImgMasking.value

    //     img.value.onload = () => {
    //         const imgWidth = img.value.naturalWidth
    //         const imgHeight = img.value.naturalHeight
    //         const imgRatio = imgWidth / imgHeight

    //         if (imgWidth < props.width || imgHeight < props.height) {
    //             hasError.value = true
    //             errorMsg.value = lang.error.lowestPx + width + '*' + height
    //             return false
    //         }
    //         const width = ratio > imgRatio ? mask.width : mask.height * imgRatio
    //         const height = ratio > imgRatio ? mask.width / imgRatio : mask.height

    //         const x = ratio > imgRatio ? 0 : (mask.width - width) / 2
    //         const y = ratio > imgRatio ? (mask.height - height) / 2 : 0

    //         scale.value = {
    //             ...scale.value,
    //             range: 0,
    //             x,
    //             y,
    //             width,
    //             height,
    //             minWidth: width,
    //             minHeight: height,
    //             maxWidth: imgWidth * mask.scale,
    //             maxHeight: imgHeight * mask.scale,
    //             originalWidth: imgWidth,
    //             originalHeight: imgHeight,
    //         }

    //         sourceImg.value = img.value
    //         createImg()

    //         step.value = STEP_CROP
    //     }

    //     // img.value.src = sourceImgUrl
    // }

    const imgStartMove = (e) => {
        e.preventDefault()
        if (!e.targetTouches) {
            return false
        }

        const et = e.targetTouches[0]
        sourceImgMouseDown.value = {
            ...sourceImgMouseDown.value,
            mx: et.screenX,
            my: et.screenY,
            x: et.clientX,
            y: et.clientY,
            on: true,
        }
    }

    const imgMove = (e) => {
        e.preventDefault()
        if (!e.targetTouches) {
            return false
        }

        const et = e.targetTouches[0]
        const { mx, my, x, y, on } = sourceImgMouseDown.value
        if (!on) return

        const mask = sourceImgMasking.value

        const { currX, currY } = { currX: et.screenX, currY: et.screenY }
        const { dX, dY } = { dX: currX - mx, dY: currY - my }
        const { rX, rY } = {
            rX: clamp(x + dX, 0, mask.width - scale.value.width),
            rY: clamp(y + dY, 0, mask.height - scale.value.height),
        }

        scale.value.x = rX
        scale.value.y = rY
    }

    const rotateImg = () => {
        const { imgWidth, imgHeight } = {
            imgWidth: scale.value.originalWidth,
            imgHeight: scale.value.originalHeight,
        }

        canvas.value.width = imgWidth
        canvas.value.height = imgHeight

        const ctx = canvas.value.getContext('2d')
        ctx.clearRect(0, 0, imgWidth, imgHeight)

        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, imgWidth, imgHeight)

        ctx.translate(imgWidth, 0)
        ctx.rotate((Math.PI / 180) * 90)

        ctx.drawImage(img.value, 0, 0, imgWidth, imgHeight)
        sourceImgUrl.value = canvas.value.toDataURL(IMG_MIME)
        // startCrop()
    }

    const handleZoom = (e) => {
        e = e || window.event
        scale.value.range = clamp(scale.value.range + (e.wheelDelta / 120 || e.detail / 3), 100, 0)
        zoomImg(scale.value.range)
    }

    const startZoom = (delta) => {
        scale.value.zooming = true

        const zoom = () => {
            if (scale.value.zooming) {
                scale.value.range = clamp(scale.value.range + delta, 100, 0)
                zoomImg(scale.value.range)
                setTimeout(zoom, 50)
            }
        }
        zoom()
    }

    const zoomImg = (newRange) => {
        const mask = sourceImgMasking.value
        const centerX = mask.width / 2
        const centerY = mask.height / 2

        const { maxWidth, maxHeight, minWidth, minHeight, width, height, x, y } = scale.value

        const nWidth = minWidth + ((maxWidth - minWidth) * newRange) / 100
        const nHeight = minHeight + ((maxHeight - minHeight) * newRange) / 100

        const nX = clamp(centerX - (nWidth / width) * (centerX - x), 0, mask.width - width)
        const nY = clamp(centerY - (nHeight / height) * (centerY - y), 0, mask.height - height)

        scale.value = { ...scale.value, x: nX, y: nY, width: nWidth, height: nHeight, range: newRange }

        // Delay in case the user is still zooming
        setTimeout(() => scale.value.range == newRange && createImg(), 100)
    }

    const createImg = (e) => {
        const ctx = canvas.value.getContext('2d')

        if (e) {
            sourceImgMouseDown.value.on = false
        }

        const { x, y, width, height } = scale.value
        const mask = sourceImgMasking.value

        canvas.value.width = width
        canvas.value.height = height

        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = 'rgba(0'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img.value, x / mask.scale, y / mask.scale, width / mask.scale, height / mask.scale)
        createImgUrl.value = canvas.value.toDataURL(IMG_MIME)
    }

    const upload = () => {
        emit('crop-success', createImgUrl.value)

        const fmData = new FormData()
        fmData.append(
            props.uploadField,
            data2blob(createImgUrl.value, IMG_MIME),
            `${props.uploadField}.${IMG_FORMAT}`,
        )

        const onUploadProgress = (event) => {
            if (event.lengthComputable) {
                progress.value = (100 * Math.round(event.loaded)) / event.total
            }
        }

        reset()
        loading.value = LOADING_UPLOADING
        step.value = STEP_SUCCESS

        try {
            const resData = props.callback(fmData, props.uploadType, { onUploadProgress })
            emit('crop-upload-success', resData[props.uploadType])
            loading.value = LOADING_SUCCESS
        } catch (err) {
            console.log('AVATAR-CROP ERROR', err)
            loading.value = LOADING_FAIL
            hasError.value = true
            errorMsg.value = lang.fail
            emit('crop-upload-fail')
        }
    }

    // export default {
    //     methods: {
    //         prepareUpload() {
    //             let { url, createImgUrl, field } = this
    //             this.$emit('crop-success', createImgUrl, field)
    //             if (typeof url == 'string' && url) {
    //                 this.upload()
    //             } else {
    //                 this.off()
    //             }
    //         },
    //         upload() {
    //             let that = this,
    //                 { lang, imgFormat, mime, url, field, createImgUrl } = this,
    //                 fmData = new FormData()

    //             fmData.append(field, data2blob(createImgUrl, mime), field + '.' + imgFormat)

    //             const uploadProgress = function (event) {
    //                 if (event.lengthComputable) {
    //                     progress = (100 * Math.round(event.loaded)) / event.total
    //                 }
    //             }

    //             reset()
    //             loading = 1
    //             step.value = STEP_SUCCESS
    //             new Promise(function (resolve, reject) {
    //                 let client = new XMLHttpRequest()
    //                 client.open('POST', url, true)
    //                 client.withCredentials = true
    //                 client.onreadystatechange = function () {
    //                     if (this.readyState !== 4) {
    //                         return
    //                     }
    //                     if (this.status === 200 || this.status === 201 || this.staus === 202) {
    //                         resolve(JSON.parse(this.responseText))
    //                     } else {
    //                         reject(this.status)
    //                     }
    //                 }
    //                 client.upload.addEventListener('progress', uploadProgress, false)

    //                 client.send(fmData)
    //             }).then(
    //                 function (resData) {
    //                     if (modelValue) {
    //                         loading = 2
    //                         $emit('crop-upload-success', resData, field)
    //                     }
    //                 },
    //                 function (sts) {
    //                     if (modelValue) {
    //                         loading = 3
    //                         hasError = true
    //                         errorMsg = lang.fail
    //                         $emit('crop-upload-fail', sts, field)
    //                     }
    //                 },
    //             )
    //         },
    //     },
    // }
</script>

<style>
    @import url('upload.css');
</style>
