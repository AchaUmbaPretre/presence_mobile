import React from 'react';
import { View, StatusBar } from 'react-native';
import { useQRSuccess } from './hooks/useQRSuccess';
import { styles } from './styles/QRSuccessStyles';
import { SuccessIcon } from './components/SuccessIcon';
import { DetailsCard } from './components/DetailsCard';
import { ActionButtons } from './components/ActionButtons';
import { ConfettiEffect } from './components/ConfettiEffect';
import { ParticleEffect } from './components/ParticleEffect';
import { SuccessHeader } from './components/SuccessHeader';
import { SuccessMessage } from './components/SuccessMessage';
import { AnimatedBackground } from './components/AnimatedBackground';

export const QRSuccessScreen = () => {
  const {
    params,
    config,
    animations,
    handlers,
    uiState,
    dateTime,
  } = useQRSuccess();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={config.gradientColors[0]} />
      
      <AnimatedBackground
        gradientColors={config.gradientColors}
        backgroundShift={animations.backgroundShift}
      />

      <ParticleEffect />
      
      {uiState.showConfetti && <ConfettiEffect />}

      <SuccessHeader
        title={config.title}
        subtitle={config.subtitle}
        fadeAnim={animations.fadeAnim}
        translateYAnim={animations.translateYAnim}
      />

      <SuccessIcon
        config={config}
        scaleAnim={animations.scaleAnim}
        pulseAnim={animations.pulseAnim}
        spinAnim={animations.spin}
        fadeAnim={animations.fadeAnim}
      />

      <SuccessMessage
        message={params.message}
        config={config}
        fadeAnim={animations.fadeAnim}
        translateYAnim={animations.translateYAnim}
      />

      <DetailsCard
        params={params}
        config={config}
        dateTime={dateTime}
        cardExpanded={uiState.cardExpanded}
        onToggleExpand={handlers.toggleCardExpand}
        fadeAnim={animations.fadeAnim}
        translateYAnim={animations.translateYAnim}
      />

      <ActionButtons
        onHomePress={handlers.goToHome}
        onHistoryPress={handlers.goToHistory}
        config={config}
        fadeAnim={animations.fadeAnim}
        translateYAnim={animations.translateYAnim}
      />
    </View>
  );
};

export default QRSuccessScreen;