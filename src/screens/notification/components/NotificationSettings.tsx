import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/screens/dashboard/constants/color';
import { getFontFamily } from '@/constants/typography';
import { useNotifications } from '../hooks/useNotifications';

const STORAGE_KEY = '@notification_settings';

export const NotificationSettings = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [checkInTime, setCheckInTime] = useState('08:00');
  const [checkOutTime, setCheckOutTime] = useState('17:00');
  const [reminderMinutes, setReminderMinutes] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  
  const { setupReminders, permissionStatus, requestPermission } = useNotifications();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const settings = JSON.parse(saved);
        setIsEnabled(settings.isEnabled);
        setCheckInTime(settings.checkInTime || '08:00');
        setCheckOutTime(settings.checkOutTime || '17:00');
        setReminderMinutes(settings.reminderMinutes || 15);
      }
    } catch (error) {
      console.error('Erreur chargement settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ isEnabled, checkInTime, checkOutTime, reminderMinutes })
      );
    } catch (error) {
      console.error('Erreur sauvegarde settings:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    if (permissionStatus !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Permission requise',
          'Activez les notifications pour recevoir vos rappels',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }
    }

    await setupReminders({
      enabled: isEnabled,
      checkInTime,
      checkOutTime,
      reminderBeforeMinutes: reminderMinutes,
    });
    
    await saveSettings();
    
    Alert.alert(
      '✅ Paramètres sauvegardés',
      isEnabled 
        ? 'Vous recevrez des rappels aux horaires configurés'
        : 'Les rappels sont désactivés'
    );
    
    setIsLoading(false);
  };

  const adjustTime = (type: 'in' | 'out', increment: boolean) => {
    const currentTime = type === 'in' ? checkInTime : checkOutTime;
    let [hours, minutes] = currentTime.split(':').map(Number);
    
    if (increment) {
      minutes += 15;
      if (minutes >= 60) {
        minutes = 0;
        hours = (hours + 1) % 24;
      }
    } else {
      minutes -= 15;
      if (minutes < 0) {
        minutes = 45;
        hours = (hours - 1 + 24) % 24;
      }
    }
    
    const newTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    if (type === 'in') {
      setCheckInTime(newTime);
    } else {
      setCheckOutTime(newTime);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.white, COLORS.gray[50]]}
        style={styles.card}
      >
        <View style={styles.header}>
          <Ionicons name="notifications" size={24} color={COLORS.primary.main} />
          <Text style={styles.title}>Notifications push</Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Activer les rappels</Text>
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            trackColor={{ false: COLORS.gray[300], true: COLORS.primary.main }}
            thumbColor={COLORS.white}
          />
        </View>

        {isEnabled && (
          <>
            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Horaires de pointage</Text>

            {/* Heure d'arrivée */}
            <View style={styles.timeRow}>
              <View style={styles.timeLabel}>
                <Ionicons name="log-in-outline" size={20} color={COLORS.success.main} />
                <Text style={styles.timeLabelText}>Arrivée</Text>
              </View>
              <View style={styles.timeControls}>
                <TouchableOpacity
                  onPress={() => adjustTime('in', false)}
                  style={styles.timeButton}
                >
                  <Ionicons name="remove" size={20} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.timeValue}>{checkInTime}</Text>
                <TouchableOpacity
                  onPress={() => adjustTime('in', true)}
                  style={styles.timeButton}
                >
                  <Ionicons name="add" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Heure de départ */}
            <View style={styles.timeRow}>
              <View style={styles.timeLabel}>
                <Ionicons name="log-out-outline" size={20} color={COLORS.warning.main} />
                <Text style={styles.timeLabelText}>Départ</Text>
              </View>
              <View style={styles.timeControls}>
                <TouchableOpacity
                  onPress={() => adjustTime('out', false)}
                  style={styles.timeButton}
                >
                  <Ionicons name="remove" size={20} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.timeValue}>{checkOutTime}</Text>
                <TouchableOpacity
                  onPress={() => adjustTime('out', true)}
                  style={styles.timeButton}
                >
                  <Ionicons name="add" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Rappel avant</Text>
              <View style={styles.reminderControls}>
                <TouchableOpacity
                  onPress={() => reminderMinutes > 5 && setReminderMinutes(reminderMinutes - 5)}
                  style={styles.reminderButton}
                >
                  <Ionicons name="remove" size={16} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.reminderValue}>{reminderMinutes} min</Text>
                <TouchableOpacity
                  onPress={() => reminderMinutes < 60 && setReminderMinutes(reminderMinutes + 5)}
                  style={styles.reminderButton}
                >
                  <Ionicons name="add" size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.infoText}>
          📱 Recevez des rappels pour ne pas oublier de pointer
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: getFontFamily('bold'),
    color: COLORS.gray[900],
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: getFontFamily('medium'),
    color: COLORS.gray[700],
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: getFontFamily('semibold'),
    color: COLORS.gray[600],
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeLabelText: {
    fontSize: 14,
    fontFamily: getFontFamily('medium'),
    color: COLORS.gray[700],
  },
  timeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 18,
    fontFamily: getFontFamily('semibold'),
    color: COLORS.gray[900],
    minWidth: 50,
    textAlign: 'center',
  },
  reminderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reminderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderValue: {
    fontSize: 15,
    fontFamily: getFontFamily('semibold'),
    color: COLORS.gray[800],
    minWidth: 50,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.primary.main,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: getFontFamily('semibold'),
  },
  infoText: {
    fontSize: 12,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: 16,
  },
});