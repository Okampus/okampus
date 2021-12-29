<template>
    <!--  TODO: Fix load time + add popover -->
    <div
        ref="tagList"
        class="relative h-7 w-full overflow-hidden"
    >
        <template
            v-for="(tag, i) in tags"
            :key="i"
        >
            <Tag
                :ref="setTagRef"
                :tag-name="tag.name ?? tag"
                :class="{invisible: i >= last}"
            />
        </template>
        <div
            v-if="labelLeft !== null"
            class="absolute flex items-center top-1/2 text-white -translate-y-1/2 whitespace-nowrap rounded-full bg-blue-500 px-2"
            :style="{left: labelLeft + 'px'}"
        >
            <p>{{ extraTagsText }}</p>
            <i class="ri-arrow-drop-down-line ri-xl -mr-1" />
        </div>
    </div>
</template>

<script lang="js">
import debounce from 'lodash/debounce'
import { onBeforeUpdate, reactive, ref } from 'vue'
import Tag from '@/components/ColoredTag.vue'
import { getTextWidthInElement } from '@/utils/getTextWidth'
export default {
    components: {
        Tag
    },
    props: {
        tags: {
            type: Array,
            default: () => []
        },
        padding: {
            type: Number,
            default: 6
        },
        extraTagsTextFormat: {
            type: String,
            default: '+ {}'
        }
    },
    setup () {
        const tagList = ref(null)
        const loaded = ref(false)
        let tagRefs = reactive([])
        const setTagRef = el => {
            if (el) {
                tagRefs.push(el)
            }
        }
        onBeforeUpdate(() => {
            tagRefs = []
        })
        return { tagRefs, tagList, setTagRef, loaded }
    },
    data () {
        return {
            overflowing: [],
            overflowLabelWidth: null,
            last: this.tags.length,
            labelLeft: null,
            tagsListObserver: null
        }
    },
    computed: {
        extraTagsText() {
            return this.extraTagsTextFormat.replace(new RegExp('{}', 'g'), (this.tags.length - this.last ?? 0).toString())
        }
    },
    mounted() {
        const getLabelLeft = (i) => i == 0 ? 0 : this.tagRefs[i-1].$el.getBoundingClientRect().right - this.tagList.getBoundingClientRect().left + this.padding
        this.overflowLabelWidth = getTextWidthInElement(this.extraTagsTextFormat.replace(new RegExp('{}', 'g'), 'WWWWW'), this.tagList) + this.padding
        const overflow = debounce(() => {
            const top = this.tagList.getBoundingClientRect().top + 4
            if (this.labelLeft === null) {
                for (var i = 0; i < this.tagRefs.length; i++) {
                    if (this.tagRefs[i].$el.getBoundingClientRect().top > top) {
                        for (var j = 0; j < i; j++) {
                            if (this.tagRefs[j].$el.getBoundingClientRect().right >= this.tagList.getBoundingClientRect().right - this.overflowLabelWidth) {
                                this.last = j
                                this.labelLeft = getLabelLeft(j)
                                return
                            }
                        }
                        this.last = i
                        this.labelLeft = getLabelLeft(i)
                        return
                    }
                }
            } else {
                const actualRight = this.tagList.getBoundingClientRect().right - this.overflowLabelWidth
                for (var k = 0; k < this.tagRefs.length; k++) {
                    const rect = this.tagRefs[k].$el.getBoundingClientRect()
                    if (rect.top > top || rect.right > actualRight) {
                        this.last = k
                        this.labelLeft = getLabelLeft(k)
                        return
                    }
                }
            }
            this.last = this.tagRefs.length
            this.labelLeft = null
        }, 10)
        this.tagsListObserver = new ResizeObserver(overflow)
        this.tagsListObserver.observe(this.tagList)
    },
    beforeUnmount() {
        this.tagsListObserver.unobserve(this.tagList)
    }
}
</script>
