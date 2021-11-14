<template lang="">
  <label
    class="switch"
    :style="{
      '--switch-width': width,
      '--switch-height': height,
      '--switch-color': switchValidateColor,
      '--switch-bg': switchBackgroundColor,
      '--switch-inner-padding': switchInnerPadding,
      '--button-color': buttonColor,
      '--button-radius': buttonRadius,
      '--transition-duration': transitionDuration
    }"
  >
    <input
      v-model="value"
      type="checkbox"
      @update:modelValue="$emit($event)"
    >
    <span class="slider round" />
  </label>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '40px'
    },
    height: {
      type: String,
      default: '20px'
    },
    switchValidateColor: {
      type: String,
      default: 'orange'
    },
    switchBackgroundColor: {
      type: String,
      default: '#ccc'
    },
    switchInnerPadding: {
      type: String,
      default: '2px'
    },
    buttonColor: {
      type: String,
      default: 'white'
    },
    buttonRadius: {
      type: String,
      default: '9999px'
    },
    transitionDuration: {
      type: String,
      default: '0.4s'
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      value: this.modelValue
    }
  }
}
</script>

<style lang="scss">

.switch {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  width: var(--switch-width);
  height: var(--switch-height);

  & input {
    cursor: pointer;
    opacity: 0;
    width: var(--switch-width);
    height: var(--switch-height);
  }
}

.slider {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: var(--switch-width);
  height: var(--switch-height);
  background-color: var(--switch-bg);
  border-radius: var(--button-radius);
  -webkit-transition: var(--transition-duration);
  transition: var(--transition-duration);

  &:before {
    position: absolute;
    content: "";
    top: var(--switch-inner-padding);
    left: var(--switch-inner-padding);
    height: calc(var(--switch-height) - 2 * var(--switch-inner-padding));
    width: calc(var(--switch-height) - 2 * var(--switch-inner-padding));
    background-color: var(--button-color);
    border-radius: var(--button-radius);
    -webkit-transition: var(--transition-duration);
    transition: var(--transition-duration);
  }
}

input:checked + .slider {
  background-color: var(--switch-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--switch-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--switch-color);
}

input:checked + .slider:before {
  -webkit-transform: translateX(
    calc(var(--switch-width) - 2 * var(--switch-inner-padding) - var(--switch-height) + 2 * var(--switch-inner-padding))
  );
  -ms-transform: translateX(
    calc(var(--switch-width) - 2 * var(--switch-inner-padding) - var(--switch-height) + 2 * var(--switch-inner-padding))
  );
  transform: translateX(
    calc(var(--switch-width) - 2 * var(--switch-inner-padding) - var(--switch-height) + 2 * var(--switch-inner-padding))
  );
}

</style>
