import {
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";

export const useProfileAnimation = () => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [0, 1]);
    const height = interpolate(scrollY.value, [0, 100], [0, 60], "clamp");

    return {
      opacity,
      height,
    };
  });

  const avatarAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, 100], [1, 0.8]);
    const translateY = interpolate(scrollY.value, [0, 100], [0, -20]);

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  return {
    scrollY,
    scrollHandler,
    headerAnimatedStyle,
    avatarAnimatedStyle,
  };
};
