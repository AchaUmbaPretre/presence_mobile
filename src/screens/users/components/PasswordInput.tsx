import React, { forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './../../dashboard/constants/color';
import { TYPOGRAPHY, getFontFamily } from '../../../constants/typography';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  placeholder?: string;
}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(({
  value,
  onChangeText,
  error,
  isFocused,
  onFocus,
  onBlur,
  returnKeyType = 'done',
  onSubmitEditing,
  placeholder = "Votre mot de passe",
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Ionicons name="lock-closed-outline" size={18} color={COLORS.gray[500]} />
        <Text style={styles.label}>Mot de passe</Text>
      </View>
      
      <View style={styles.inputWrapper}>
        <TextInput
          ref={ref}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            error && styles.inputError,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray[400]}
          secureTextEntry={!showPassword}
          onFocus={onFocus}
          onBlur={onBlur}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          selectionColor={COLORS.primary.main}
        />
        
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={COLORS.gray[500]}
          />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={COLORS.error.main} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
});

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
    fontFamily: getFontFamily('medium'),
    marginLeft: 8,
  },
  inputWrapper: {
    position: 'relative',
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
    fontFamily: getFontFamily('regular'),
    paddingRight: 50,
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
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: getFontFamily('regular'),
    marginLeft: 4,
  },
});