<!-- eslint-disable  -->
<template>
    <div
        v-if="modelValue"
        class="vue-image-crop-upload"
    >
        <div class="vicp-wrap bg-2 rounded-lg">
            <div
                class="vicp-close"
                @click="off"
            >
                <i class="vicp-icon4" />
            </div>

            <div
                v-show="step == 1"
                class="vicp-step1"
            >
                <div
                    class="vicp-drop-area input"
                    @dragleave="preventDefault"
                    @dragover="preventDefault"
                    @dragenter="preventDefault"
                    @click="handleClick"
                    @drop="handleChange"
                >
                    <i
                        v-show="loading != 1"
                        class="ri-upload-2-fill text-6xl"
                    />
                    <span
                        v-show="loading !== 1"
                        class="vicp-hint "
                    >{{ lang.hint }}</span>
                    <span
                        v-show="!isSupported"
                        class="vicp-no-supported-hint"
                    >{{ lang.noSupported }}</span>
                    <input
                        v-show="false"
                        v-if="step == 1"
                        ref="fileinput"
                        type="file"
                        accept="image/*"
                        @change="handleChange"
                    >
                </div>
                <div
                    v-show="hasError"
                    class="vicp-error"
                >
                    <i class="vicp-icon2" /> {{ errorMsg }}
                </div>
                <div class="vicp-operate text-blue-500">
                    <a
                        @click="off"
                        @mousedown="ripple"
                    >{{ lang.btn.off }}</a>
                </div>
            </div>

            <div
                v-if="step == 2"
                class="vicp-step2"
            >
                <div class="vicp-crop">
                    <div
                        v-show="true"
                        class="vicp-crop-left"
                    >
                        <div
                            class="vicp-img-container"
                            @wheel.prevent="handleMouseWheel"
                        >
                            <img
                                ref="img"
                                :src="sourceImgUrl"
                                :style="sourceImgStyle"
                                class="vicp-img"
                                draggable="false"
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
                            >
                            <div
                                class="vicp-img-shade vicp-img-shade-1"
                                :style="sourceImgShadeStyle"
                            />
                            <div
                                class="vicp-img-shade vicp-img-shade-2"
                                :style="sourceImgShadeStyle"
                            />
                        </div>

                        <div class="vicp-range">
                            <input
                                v-model="scale.range"
                                type="range"
                                step="1"
                                min="0"
                                max="100"
                                @mousemove="zoomChange"
                            >
                            <i
                                class="vicp-icon5"
                                @mousedown="startZoomSub"
                                @mouseout="endZoomSub"
                                @mouseup="endZoomSub"
                            />
                            <i
                                class="vicp-icon6"
                                @mousedown="startZoomAdd"
                                @mouseout="endZoomAdd"
                                @mouseup="endZoomAdd"
                            />
                        </div>

                        <div
                            v-if="!noRotate"
                            class="vicp-rotate"
                        >
                            <i @click="rotateImg">↻</i>
                        </div>
                    </div>
                    <div
                        v-show="true"
                        class="vicp-crop-right"
                    >
                        <div class="vicp-preview">
                            <div
                                v-if="!noSquare"
                                class="vicp-preview-item"
                            >
                                <img
                                    :src="createImgUrl"
                                    :style="previewStyle"
                                >
                                <span>{{ lang.preview }}</span>
                            </div>
                            <div
                                v-if="!noCircle"
                                class="vicp-preview-item vicp-preview-item-circle"
                            >
                                <img
                                    :src="createImgUrl"
                                    :style="previewStyle"
                                >
                                <span>{{ lang.preview }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="vicp-operate text-blue-500">
                    <a
                        @click="setStep(1)"
                        @mousedown="ripple"
                    >{{ lang.btn.back }}</a>
                    <a
                        class="vicp-operate-btn"
                        @click="prepareUpload"
                        @mousedown="ripple"
                    >{{ lang.btn.save }}</a>
                </div>
            </div>

            <div
                v-if="step == 3"
                class="vicp-step3"
            >
                <div class="vicp-upload">
                    <span
                        v-show="loading === 1"
                        class="vicp-loading"
                    >{{ lang.loading }}</span>
                    <div class="vicp-progress-wrap">
                        <span
                            v-show="loading === 1"
                            class="vicp-progress"
                            :style="progressStyle"
                        />
                    </div>
                    <div
                        v-show="hasError"
                        class="vicp-error text-red-500"
                    >
                        <i class="vicp-icon2" /> {{ errorMsg }}
                    </div>
                    <div
                        v-show="loading === 2"
                        class="vicp-success text-blue-500 flex"
                    >
                        <i class="ri-check-fill my-auto" /> {{ lang.success }}
                    </div>
                </div>
                <div class="vicp-operate text-blue-500">
                    <a
                        @click="setStep(2)"
                        @mousedown="ripple"
                    >{{ lang.btn.back }}</a>
                    <a
                        @click="off"
                        @mousedown="ripple"
                    >{{ lang.btn.close }}</a>
                </div>
            </div>
            <canvas
                v-show="false"
                ref="canvas"
                :width="width"
                :height="height"
            />
        </div>
    </div>
</template>

<script>
'use strict';
import language from './utils/language.js';
import mimes from './utils/mimes.js';
import data2blob from './utils/data2blob.js';
import effectRipple from './utils/effectRipple.js';

export default {
    props: {
        field: {
            type: String,
            'default': 'avatar'
        },
        ki: {
            type: String,
            'default': '0'
        },
        modelValue: {
            type: Boolean,
            'default': true
        },
        url: {
            type: String,
            'default': ''
        },
        params: {
            type: Object,
            'default': ()=>null
        },
        headers: {
            type: Object,
            'default': ()=>null
        },
        width: {
            type: Number,
            default: 200
        },
        height: {
            type: Number,
            default: 200
        },
        noRotate: {
            type: Boolean,
            default: true
        },
        noCircle: {
            type: Boolean,
            default: false
        },
        noSquare: {
            type: Boolean,
            default: false
        },
        maxSize: {
            type: Number,
            'default': 10240
        },
        langType: {
            type: String,
            'default': 'zh'
        },
        langExt: {
            type: Object,
            'default': ()=>null
        },
        imgFormat: {
            type: String,
            'default': 'png'
        },
        imgBgc: {
            type: String,
            'default': '#fff'
        },
        withCredentials: {
            type: Boolean,
            'default': false
        },
        method: {
            type: String,
            'default': 'POST'
        },
        initialImgUrl: {
            type: String,
            'default': ''
        },
        allowImgFormat: {
            type: Array,
            'default': ()=>[
                'gif',
                'jpg',
                'png'
            ]
        }
    },

    emits: ['src-file-set', 'crop-success', 'update:modelValue'],

    data() {
        let that = this,
            {
                imgFormat,
                allowImgFormat,
                langType,
                langExt,
                width,
                height
            } = that,
            isSupported = true,
            tempImgFormat = allowImgFormat.indexOf(imgFormat) === -1 ? 'jpg' : imgFormat,
            lang = language[langType] ? language[langType] : language['en'],
            mime = mimes[tempImgFormat];

        if (langExt) {
            Object.assign(lang, langExt);
        }
        if (typeof FormData != 'function') {
            isSupported = false;
        }
        return {
            mime,

            lang,
            isSupported,
            // isSupportTouch: document.hasOwnProperty("ontouchstart"),

            step: 1,

            loading: 0,
            progress: 0,

            hasError: false,
            errorMsg: '',

            ratio: width / height,

            sourceImg: null,
            sourceImgUrl: this.initialImgUrl,
            createImgUrl: this.initialImgUrl,

            sourceImgMouseDown: {
                on: false,
                mX: 0,
                mY: 0,
                x: 0,
                y: 0
            },

            previewContainer: {
                width: 100,
                height: 100
            },

            sourceImgContainer: {
                width: 240,
                height: 184
            },

            scale: {
                zoomAddOn: false,
                zoomSubOn: false,
                range: 1,

                x: 0,
                y: 0,
                width: 0,
                height: 0,
                maxWidth: 0,
                maxHeight: 0,
                minWidth: 0,
                minHeight: 0,
                naturalWidth: 0,
                naturalHeight: 0
            }
        }
    },

    computed: {
        progressStyle() {
            let {
                progress
            } = this;
            return {
                width: progress + '%'
            }
        },
        sourceImgStyle() {
            let {
                    scale,
                    sourceImgMasking
                } = this,
                top = scale.y + sourceImgMasking.y + 'px',
                left = scale.x + sourceImgMasking.x + 'px';
            return {
                top,
                left,
                width: scale.width + 'px',
                height: scale.height + 'px',
            }
        },
        sourceImgMasking() {
            let {
                    width,
                    height,
                    ratio,
                    sourceImgContainer
                } = this,
                sic = sourceImgContainer,
                sicRatio = sic.width / sic.height,
                x = 0,
                y = 0,
                w = sic.width,
                h = sic.height,
                scale = 1;
            if (ratio < sicRatio) {
                scale = sic.height / height;
                w = sic.height * ratio;
                x = (sic.width - w) / 2;
            }
            if (ratio > sicRatio) {
                scale = sic.width / width;
                h = sic.width / ratio;
                y = (sic.height - h) / 2;
            }
            return {
                scale,
                x,
                y,
                width: w,
                height: h
            };
        },
        sourceImgShadeStyle() {
            let {
                    sourceImgMasking,
                    sourceImgContainer
                } = this,
                sic = sourceImgContainer,
                sim = sourceImgMasking,
                w = sim.width == sic.width ? sim.width : (sic.width - sim.width) / 2,
                h = sim.height == sic.height ? sim.height : (sic.height - sim.height) / 2;
            return {
                width: w + 'px',
                height: h + 'px'
            };
        },
        previewStyle() {
            let {
                    ratio,
                    previewContainer
                } = this,
                pc = previewContainer,
                w = pc.width,
                h = pc.height,
                pcRatio = w / h;
            if (ratio < pcRatio) {
                w = pc.height * ratio;
            }
            if (ratio > pcRatio) {
                h = pc.width / ratio;
            }
            return {
                width: w + 'px',
                height: h + 'px'
            };
        }
    },

    watch: {
        modelValue(newValue) {
            if (newValue && this.loading != 1) {
                this.reset();
            }
        }
    },

    created(){
        document.addEventListener('keyup', this.handleEscClose )
    },

    beforeUnmount(){
        document.removeEventListener('keyup', this.handleEscClose )
    },

    mounted() {
        if (this.sourceImgUrl) {
            this.startCrop();
        }
    },

    methods: {
        handleEscClose(e){
            if(this.modelValue && (e.key == 'Escape' || e.keyCode == 27)){
                this.off();
            }
        },
        ripple(e) {
            effectRipple(e);
        },
        off() {
            setTimeout(()=> {
                this.$emit('update:modelValue', false);
                if(this.step == 3 && this.loading == 2){
                    this.setStep(1);
                }
            }, 200);
        },
        setStep(no) {
            setTimeout(()=> {
                this.step = no;
            }, 200);
        },

        preventDefault(e) {
            e.preventDefault();
            return false;
        },
        handleClick(e) {
            if (this.loading !== 1) {
                if (e.target !== this.$refs.fileinput) {
                    e.preventDefault();
                    if (document.activeElement !== this.$refs) {
                        this.$refs.fileinput.click();
                    }
                }
            }
        },
        handleChange(e) {
            e.preventDefault();
            if (this.loading !== 1) {
                let files = e.target.files || e.dataTransfer.files;
                this.reset();
                if (this.checkFile(files[0])) {
                    this.setSourceImg(files[0]);
                }
            }
        },

        checkFile(file) {
            let that = this,
                {
                    lang,
                    maxSize
                } = that;
            if (file.type.indexOf('image') === -1) {
                that.hasError = true;
                that.errorMsg = lang.error.onlyImg;
                return false;
            }

            if (file.size / 1024 > maxSize) {
                that.hasError = true;
                that.errorMsg = lang.error.outOfSize + maxSize + 'kb';
                return false;
            }
            return true;
        },
        reset() {
            let that = this;
            that.loading = 0;
            that.hasError = false;
            that.errorMsg = '';
            that.progress = 0;
        },
        setSourceImg(file) {
            this.$emit('src-file-set', file.name, file.type, file.size);
            let that = this,
                fr = new FileReader();
            fr.onload = function() {
                that.sourceImgUrl = fr.result;
                that.startCrop();
            }
            fr.readAsDataURL(file);
        },
        startCrop() {
            let that = this,
                {
                    width,
                    height,
                    ratio,
                    scale,
                    sourceImgUrl,
                    sourceImgMasking,
                    lang
                } = that,
                sim = sourceImgMasking,
                img = new Image();
            img.src = sourceImgUrl;
            img.onload = function() {
                let nWidth = img.naturalWidth,
                    nHeight = img.naturalHeight,
                    nRatio = nWidth / nHeight,
                    w = sim.width,
                    h = sim.height,
                    x = 0,
                    y = 0;
                if (nWidth < width || nHeight < height) {
                    that.hasError = true;
                    that.errorMsg = lang.error.lowestPx + width + '*' + height;
                    return false;
                }
                if (ratio > nRatio) {
                    h = w / nRatio;
                    y = (sim.height - h) / 2;
                }
                if (ratio < nRatio) {
                    w = h * nRatio;
                    x = (sim.width - w) / 2;
                }
                scale.range = 0;
                scale.x = x;
                scale.y = y;
                scale.width = w;
                scale.height = h;
                scale.minWidth = w;
                scale.minHeight = h;
                scale.maxWidth = nWidth * sim.scale;
                scale.maxHeight = nHeight * sim.scale;
                scale.naturalWidth = nWidth;
                scale.naturalHeight = nHeight;
                that.sourceImg = img;
                that.createImg();
                that.setStep(2);
            };
        },
        imgStartMove(e) {
            e.preventDefault();
            if(!e.targetTouches){
                return false;
            }
            let et = e.targetTouches ? e.targetTouches[0] : e,
                {
                    sourceImgMouseDown,
                    scale
                } = this,
                simd = sourceImgMouseDown;
            simd.mX = et.screenX;
            simd.mY = et.screenY;
            simd.x = scale.x;
            simd.y = scale.y;
            simd.on = true;
        },
        imgMove(e) {
            e.preventDefault();
            if(!e.targetTouches){
                return false;
            }
            let et = e.targetTouches ? e.targetTouches[0] : e,
                {
                    sourceImgMouseDown: {
                        on,
                        mX,
                        mY,
                        x,
                        y
                    },
                    scale,
                    sourceImgMasking
                } = this,
                sim = sourceImgMasking,
                nX = et.screenX,
                nY = et.screenY,
                dX = nX - mX,
                dY = nY - mY,
                rX = x + dX,
                rY = y + dY;
            if (!on) return;
            if (rX > 0) {
                rX = 0;
            }
            if (rY > 0) {
                rY = 0;
            }
            if (rX < sim.width - scale.width) {
                rX = sim.width - scale.width;
            }
            if (rY < sim.height - scale.height) {
                rY = sim.height - scale.height;
            }
            scale.x = rX;
            scale.y = rY;
        },
        rotateImg() {
            let {
                    sourceImg,
                    scale: {
                        naturalWidth,
                        naturalHeight,
                    }
                } = this,
                width = naturalHeight,
                height = naturalWidth,
                canvas = this.$refs.canvas,
                ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillRect(0, 0, width, height);

            ctx.translate(width, 0);
            ctx.rotate(Math.PI * 90 / 180);

            ctx.drawImage(sourceImg, 0, 0, naturalWidth, naturalHeight);
            let imgUrl = canvas.toDataURL(mimes['png']);

            this.sourceImgUrl = imgUrl;
            this.startCrop();
        },
        handleMouseWheel(e){
            e = e || window.event;
            let 	{ scale } = this;
            if (e.wheelDelta) {
                if (e.wheelDelta > 0) {
                    this.zoomImg(scale.range >= 100 ? 100 : ++scale.range);
                }
                if (e.wheelDelta < 0) {
                    this.zoomImg(scale.range <= 0 ? 0 : --scale.range);
                }
            } else if (e.detail) {
                if (e.detail > 0) {
                    this.zoomImg(scale.range >= 100 ? 100 : ++scale.range);
                }
                if (e.detail < 0) {
                    this.zoomImg(scale.range <= 0 ? 0 : --scale.range);
                }
            }
        },
        startZoomAdd() {
            let that = this,
                {
                    scale
                } = that;
            scale.zoomAddOn = true;

            function zoom() {
                if (scale.zoomAddOn) {
                    let range = scale.range >= 100 ? 100 : ++scale.range;
                    that.zoomImg(range);
                    setTimeout(function() {
                        zoom();
                    }, 60);
                }
            }
            zoom();
        },
        endZoomAdd() {
            this.scale.zoomAddOn = false;
        },
        startZoomSub() {
            let that = this,
                {
                    scale
                } = that;
            scale.zoomSubOn = true;

            function zoom() {
                if (scale.zoomSubOn) {
                    let range = scale.range <= 0 ? 0 : --scale.range;
                    that.zoomImg(range);
                    setTimeout(function() {
                        zoom();
                    }, 60);
                }
            }
            zoom();
        },
        endZoomSub() {
            let {
                scale
            } = this;
            scale.zoomSubOn = false;
        },
        zoomChange(e) {
            this.zoomImg(e.target.value);
        },
        zoomImg(newRange) {
            let that = this,
                {
                    sourceImgMasking,
                    scale
                } = this,
                {
                    maxWidth,
                    maxHeight,
                    minWidth,
                    minHeight,
                    width,
                    height,
                    x,
                    y
                } = scale,
                sim = sourceImgMasking,
                sWidth = sim.width,
                sHeight = sim.height,
                nWidth = minWidth + (maxWidth - minWidth) * newRange / 100,
                nHeight = minHeight + (maxHeight - minHeight) * newRange / 100,
                nX = sWidth / 2 - (nWidth / width) * (sWidth / 2 - x),
                nY = sHeight / 2 - (nHeight / height) * (sHeight / 2 - y);

            if (nX > 0) {
                nX = 0;
            }
            if (nY > 0) {
                nY = 0;
            }
            if (nX < sWidth - nWidth) {
                nX = sWidth - nWidth;
            }
            if (nY < sHeight - nHeight) {
                nY = sHeight - nHeight;
            }

            scale.x = nX;
            scale.y = nY;
            scale.width = nWidth;
            scale.height = nHeight;
            scale.range = newRange;
            setTimeout(function() {
                if (scale.range == newRange) {
                    that.createImg();
                }
            }, 300);
        },
        createImg(e) {
            let that = this,
                {
                    imgFormat,
                    imgBgc,
                    mime,
                    sourceImg,
                    scale: {
                        x,
                        y,
                        width,
                        height,
                    },
                    sourceImgMasking: {
                        scale
                    }
                } = that,
                canvas = that.$refs.canvas,
                ctx = canvas.getContext('2d');
            if (e) {
                that.sourceImgMouseDown.on = false;
            }
            canvas.width = that.width;
            canvas.height = that.height;
            ctx.clearRect(0, 0, that.width, that.height);

            if(imgFormat == 'png'){
                ctx.fillStyle = 'rgba(0,0,0,0)';
            } else{
                ctx.fillStyle = imgBgc;
            }
            ctx.fillRect(0, 0, that.width, that.height);

            ctx.drawImage(sourceImg, x / scale, y / scale, width / scale, height / scale);
            that.createImgUrl = canvas.toDataURL(mime);
        },
        prepareUpload(){
            let {
                url,
                createImgUrl,
                field,
                ki
            } = this;
            this.$emit('crop-success', createImgUrl, field, ki);
            if(typeof url == 'string' && url){
                this.upload();
            }else{
                this.off();
            }
        },
        upload() {
            let that = this,
                {
                    lang,
                    imgFormat,
                    mime,
                    url,
                    params,
                    headers,
                    field,
                    ki,
                    createImgUrl,
                    withCredentials,
                    method
                } = this,
                fmData = new FormData();

            if (typeof params == 'object' && params) {
                Object.keys(params).forEach((k) => {
                    fmData.append(k, params[k]);
                })
            }

            fmData.append(field, data2blob(createImgUrl, mime), field + '.' + imgFormat);


            const uploadProgress = function(event) {
                if (event.lengthComputable) {
                    that.progress = 100 * Math.round(event.loaded) / event.total;
                }
            };

            that.reset();
            that.loading = 1;
            that.setStep(3);
            new Promise(function(resolve, reject) {
                let client = new XMLHttpRequest();
                client.open(method, url, true);
                client.withCredentials = withCredentials;
                client.onreadystatechange = function() {
                    if (this.readyState !== 4) {
                        return;
                    }
                    if (this.status === 200 || this.status === 201 || this.staus ===202 ) {
                        resolve(JSON.parse(this.responseText));
                    } else {
                        reject(this.status);
                    }
                };
                client.upload.addEventListener("progress", uploadProgress, false);
                if (typeof headers == 'object' && headers) {
                    Object.keys(headers).forEach((k) => {
                        client.setRequestHeader(k, headers[k]);
                    })
                }
                client.send(fmData);
            }).then(
                function(resData) {
                    if (that.modelValue) {
                        that.loading = 2;
                        that.$emit('crop-upload-success', resData, field, ki);
                    }
                },
                function(sts) {
                    if (that.modelValue) {
                        that.loading = 3;
                        that.hasError = true;
                        that.errorMsg = lang.fail;
                        that.$emit('crop-upload-fail', sts, field, ki);
                    }
                }
            );
        }
    },
}

</script>

<style>
@import url('upload.css');
</style>
