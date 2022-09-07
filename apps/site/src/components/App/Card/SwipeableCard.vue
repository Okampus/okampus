<template>
    <div
        ref="interactElement"
        class="dragging-card"
        :style="{
            transform: transformString,
            transition: transitionString,
        }"
    >
        <slot />
    </div>
</template>

<script setup>
    import interact from 'interactjs'
    import { computed, onMounted, ref, watch } from 'vue'

    const props = defineProps({
        transition: {
            type: String,
            default: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.4, 1.2)',
            required: false,
        },
        maxRotation: {
            type: Number,
            default: 15,
            required: false,
        },
        outOfSightXOffset: {
            type: Number,
            default: 400,
            required: false,
        },
        outOfSightYOffset: {
            type: Number,
            default: 400,
            required: false,
        },
        thresholdX: {
            type: Number,
            default: 170,
            required: false,
        },
        thresholdY: {
            type: Number,
            default: 170,
            required: false,
        },
        canSwipe: {
            type: Boolean,
            default: true,
        },
    })

    const interactElement = ref(null)
    const isDragging = ref(false)
    const interactPosition = ref({
        x: 0,
        y: 0,
        rotation: 0,
    })

    const transformString = computed(
        () =>
            `translate3D(${interactPosition.value.x}px, ${interactPosition.value.y}px, 0) rotate(${interactPosition.value.rotation}deg)`,
    )

    const transitionString = computed(() => !isDragging.value && props.transition)
    const emit = defineEmits([
        'start',
        'move',
        'end',
        'swipe-left',
        'swipe-right',
        'swipe-top',
        'swipe-bottom',
        'swipe',
    ])

    const onThresholdReached = (interaction) => {
        if (props.canSwipe) {
            unsetInteractElement()
            switch (interaction) {
                case 'swipe-right':
                    setPosition({
                        x: props.outOfSightXOffset,
                        rotation: props.maxRotation,
                    })
                    emit('swipe-right')
                    break
                case 'swipe-left':
                    setPosition({
                        x: -props.outOfSightXOffset,
                        rotation: -props.maxRotation,
                    })
                    emit('swipe-left')
                    break
                case 'swipe-top':
                    setPosition({
                        y: -props.outOfSightYOffset,
                    })
                    emit('swipe-top')
                    break
                case 'swipe-bottom':
                    setPosition({
                        y: props.outOfSightYOffset,
                    })
                    emit('swipe-bottom')
                    break
            }
            emit('swipe', interaction)
        }
    }

    const setPosition = (position) => {
        const { x = 0, y = 0, rotation = 0 } = position
        interactPosition.value = { x, y, rotation }
    }

    const unsetInteractElement = () => {
        interact(interactElement.value).unset()
    }

    const moveTriggered = ref(null)

    const setInteractElement = () => {
        interact(interactElement.value).draggable({
            onstart: () => {
                emit('start')
                isDragging.value = true
                setInterval(() => {
                    if (moveTriggered.value) {
                        emit('move')
                        const x = interactPosition.value.x + moveTriggered.value.dx
                        const y = interactPosition.value.y + moveTriggered.value.dy
                        let rotation = props.maxRotation * (x / props.thresholdX)
                        if (rotation > props.maxRotation) rotation = props.maxRotation
                        else if (rotation < -props.maxRotation) rotation = -props.maxRotation
                        setPosition({ x, y, rotation })
                        moveTriggered.value = null
                    }
                }, 20) // Throttle move triggering by 20ms
            },
            onmove: (event) => {
                moveTriggered.value = event
            },
            onend: () => {
                moveTriggered.value = null
                emit('end')
                isDragging.value = false
                if (interactPosition.value.x > props.thresholdX) onThresholdReached('swipe-right')
                else if (interactPosition.value.x < -props.thresholdX) onThresholdReached('swipe-left')
                else if (interactPosition.value.y < -props.thresholdY) onThresholdReached('swipe-top')
                else if (interactPosition.value.y > props.thresholdY) onThresholdReached('swipe-bottom')
                else setPosition({ x: 0, y: 0, rotation: 0 })
            },
        })
    }

    onMounted(() => {
        if (props.canSwipe) setInteractElement()
    })

    defineExpose({
        reset: () => {
            setPosition({ x: 0, y: 0, rotation: 0 })
            setInteractElement()
        },
        onThresholdReached,
    })

    watch(
        () => props.canSwipe,
        () => {
            if (props.canSwipe) {
                setInteractElement()
            } else {
                unsetInteractElement()
            }
        },
    )
</script>

<style lang="scss">
    .dragging-card {
        @apply touch-none;

        backface-visibility: hidden;

        & * {
            backface-visibility: hidden;
        }

        & > * {
            @apply touch-none;
        }
    }
</style>
