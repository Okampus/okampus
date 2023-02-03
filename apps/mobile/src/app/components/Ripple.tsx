import React, { useState, useEffect } from 'react';
import {
  View,
  Animated,
  Easing,
  Platform,
  TouchableWithoutFeedback,
  I18nManager,
  StyleSheet,
  TouchableWithoutFeedbackProps,
  LayoutChangeEvent,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

let mounted = false;
let unique = 0;

function onRippleAnimation(animation: Animated.CompositeAnimation, cb: () => void) {
  animation.start(cb);
}

type RippleType = {
  unique: number;
  progress: Animated.Value;
  locationX: number;
  locationY: number;
  R: number;
};

type Props = {
  color?: string;
  opacity?: number;
  duration?: number;
  size?: number;
  centered?: boolean;
  fades?: boolean;
  isSequential?: boolean;
  disabled?: boolean;
  children: JSX.Element[] | JSX.Element;
  nativeID?: string;
  containerStyle?: StyleProp<ViewStyle>;
} & TouchableWithoutFeedbackProps;

export function Ripple(props: Props) {
  const {
    color = 'rgb(255, 255, 255)',
    opacity = 1,
    duration = 500,
    size = 0,
    centered = true,
    containerStyle = { borderRadius: 15, margin: 2 },
    isSequential = false,
    fades = true,
    disabled = false,
  } = props;

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [ripples, setRipples] = useState<RippleType[]>([]);

  useEffect(() => {
    mounted = true;
    return () => {
      mounted = false;
    };
  }, []);

  function onLayout(event: LayoutChangeEvent) {
    const { width: w, height: h } = event.nativeEvent.layout;
    setWidth(w);
    setHeight(h);
  }

  function onPress(event: GestureResponderEvent) {
    if (!isSequential || ripples.length === 0) {
      if (typeof props.onPress === 'function') {
        requestAnimationFrame(() => props.onPress && props.onPress(event));
      }
      event.persist();
    }
  }

  function onLongPress(event: GestureResponderEvent) {
    if (typeof props.onLongPress === 'function') {
      requestAnimationFrame(() => props.onLongPress && props.onLongPress(event));
    }
    event.persist();
  }

  function onPressIn(event: GestureResponderEvent) {
    if (typeof props.onPressIn === 'function') {
      event.persist();
      props.onPressIn(event);
    }
    startRipple(event);
  }

  function onPressOut(event: GestureResponderEvent) {
    if (typeof props.onPressOut === 'function') {
      event.persist();
      props.onPressOut(event);
    }
  }

  function onAnimationEnd() {
    if (mounted) {
      const tmp = ripples.slice(1);
      setRipples(tmp);
    }
  }

  function startRipple(event: GestureResponderEvent) {
    const w2 = 0.5 * width;
    const h2 = 0.5 * height;

    const { locationX, locationY } = centered ? { locationX: w2, locationY: h2 } : event.nativeEvent;

    const offsetX = Math.abs(w2 - locationX);
    const offsetY = Math.abs(h2 - locationY);

    const R = size > 0 ? 0.5 * size : Math.sqrt(Math.pow(w2 + offsetX, 2) + Math.pow(h2 + offsetY, 2));

    const ripple = {
      unique: unique++,
      progress: new Animated.Value(0),
      locationX,
      locationY,
      R,
    };

    const animation = Animated.timing(ripple.progress, {
      toValue: 1,
      easing: Easing.out(Easing.ease),
      duration,
      useNativeDriver: true,
    });

    onRippleAnimation(animation, onAnimationEnd);
    setRipples([...ripples, ripple]);
  }

  function renderRipple({ unique: key, progress, locationX, locationY, R }: RippleType) {
    const rippleStyle = {
      top: locationY - radius,
      [I18nManager.isRTL ? 'right' : 'left']: locationX - radius,
      backgroundColor: color,

      transform: [
        {
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5 / radius, R / radius],
          }),
        },
      ],

      opacity: fades
        ? progress.interpolate({
            inputRange: [0, 1],
            outputRange: [opacity, 0],
          })
        : opacity,
    };
    return <Animated.View style={[styles.ripple, rippleStyle]} key={key} />;
  }

  const {
    delayLongPress,
    delayPressIn,
    delayPressOut,
    hitSlop,
    pressRetentionOffset,
    children,
    testID,
    nativeID,
    accessible,
    accessibilityHint,
    accessibilityLabel,
    style,
  } = props;

  const touchableProps = {
    delayLongPress,
    delayPressIn,
    delayPressOut,
    disabled,
    hitSlop,
    pressRetentionOffset,
    testID,
    accessible,
    accessibilityHint,
    accessibilityLabel,
    onLayout,
    onPress,
    onPressIn,
    onPressOut,
    onLongPress: props.onLongPress ? onLongPress : undefined,
    ...(Platform.OS === 'web' ? null : { nativeID }),
  };

  return (
    <TouchableWithoutFeedback {...touchableProps}>
      <Animated.View onLayout={onLayout} style={style} pointerEvents="box-only">
        {children}
        <View style={[styles.container, containerStyle]}>{ripples.map(renderRipple)}</View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const radius = 100;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: 'transparent',
    overflow: 'hidden',
  },

  ripple: {
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    overflow: 'hidden',
    position: 'absolute',
  },
});
