import React, { memo } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { TYPOGRAPHY } from '@/shared/constants/typography';

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
}

export const AuthInput = memo(({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  onFocus,
  onBlur,
  isFocused,
}: AuthInputProps) => (
  <View style={styles.container}>
    <View style={styles.labelRow}>
      <Ionicons name={icon} size={18} color={COLORS.gray[500]} />
      <Text style={styles.label}>{label}</Text>
    </View>
    
    <TextInput
      style={[
        styles.input,
        isFocused && styles.inputFocused,
        error && styles.inputError,
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.gray[400]}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      onFocus={onFocus}
      onBlur={onBlur}
      selectionColor={COLORS.primary.main}
    />
    
    {error && (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={14} color={COLORS.error.main} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )}
  </View>
));

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 4,
  },
  label: {
    fontSize: 15,
    color: COLORS.gray[900],
    fontFamily: TYPOGRAPHY.fonts.medium,
    marginLeft: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    fontSize: 17,
    color: COLORS.gray[900],
    fontFamily: TYPOGRAPHY.fonts.regular,
  },
  inputFocused: {
    borderColor: COLORS.primary.main,
    shadowColor: COLORS.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputError: {
    borderColor: COLORS.error.main,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.error.main,
    fontFamily: TYPOGRAPHY.fonts.regular,
    marginLeft: 4,
  },
});