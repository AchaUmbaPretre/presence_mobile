import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { api } from '@/api/client';

// Configuration du comportement des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Types
export interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
  sound?: string;
  badge?: number;
}

export interface ReminderConfig {
  enabled: boolean;
  checkInTime: string; // "08:00"
  checkOutTime: string; // "17:00"
  reminderBeforeMinutes: number; // 15
}

class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;
  private reminderInterval: NodeJS.Timeout | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialise les notifications push
   */
  async initialize(): Promise<string | null> {
    try {
      // Vérifier si les notifications sont supportées
      if (!Device.isDevice) {
        console.log('⚠️ Les notifications push ne sont pas supportées sur simulateur');
        return null;
      }

      // Demander la permission
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('❌ Permission de notification refusée');
        return null;
      }

      // Récupérer le token Expo push
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      
      if (!projectId) {
        console.log('⚠️ Pas de projectId EAS configuré');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      this.expoPushToken = token.data;

      console.log('✅ Token Expo Push:', this.expoPushToken);

      // Envoyer le token au backend
      await this.registerToken();

      // Configurer les canaux Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('presence', {
          name: 'Pointage',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#0A4DA4',
          sound: 'default',
        });
        
        await Notifications.setNotificationChannelAsync('reminders', {
          name: 'Rappels',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF9800',
          sound: 'default',
        });
        
        await Notifications.setNotificationChannelAsync('alerts', {
          name: 'Alertes',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#F44336',
          sound: 'default',
        });
      }

      return this.expoPushToken;
    } catch (error) {
      console.error('❌ Erreur initialisation notifications:', error);
      return null;
    }
  }

  /**
   * Enregistre le token sur le backend
   */
  async registerToken(): Promise<void> {
    if (!this.expoPushToken) return;

    try {
      await api.post('/api/notifications/register', {
        token: this.expoPushToken,
        platform: Platform.OS,
        device_name: Device.deviceName,
      });
      console.log('✅ Token enregistré sur le serveur');
    } catch (error) {
      console.error('❌ Erreur enregistrement token:', error);
    }
  }

  /**
   * Envoie une notification locale immédiate
   */
  async sendLocalNotification(payload: NotificationPayload): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data,
          sound: payload.sound || 'default',
          badge: payload.badge,
        },
        trigger: null, // Immédiat
      });
      console.log('✅ Notification locale envoyée:', payload.title);
    } catch (error) {
      console.error('❌ Erreur envoi notification locale:', error);
    }
  }

  /**
   * Planifie une notification pour plus tard
   * ✅ Correction: Utiliser le bon format de trigger
   */
  async scheduleNotification(
    payload: NotificationPayload,
    seconds: number
  ): Promise<string> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data,
          sound: payload.sound || 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: seconds,
          repeats: false,
        },
      });
      console.log(`✅ Notification planifiée dans ${seconds}s: ${identifier}`);
      return identifier;
    } catch (error) {
      console.error('❌ Erreur planification notification:', error);
      return '';
    }
  }

// services/notificationService.ts

/**
 * Planifie une notification à une date spécifique
 * ✅ Correction: Utiliser les composants de date au lieu de 'date'
 */
async scheduleNotificationAtDate(
  payload: NotificationPayload,
  date: Date
): Promise<string> {
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload.data,
        sound: payload.sound || 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        year: date.getFullYear(),
        month: date.getMonth() + 1, // Note: getMonth() retourne 0-11
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        repeats: false,
      },
    });
    console.log(`✅ Notification planifiée à ${date}: ${identifier}`);
    return identifier;
  } catch (error) {
    console.error('❌ Erreur planification notification:', error);
    return '';
  }
}

/**
 * Planifie une notification quotidienne récurrente
 */
async scheduleDailyNotification(
  payload: NotificationPayload,
  hour: number,
  minute: number,
  second: number = 0
): Promise<string> {
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload.data,
        sound: payload.sound || 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        second,
        repeats: true,
      },
    });
    console.log(`✅ Notification quotidienne planifiée à ${hour}:${minute}: ${identifier}`);
    return identifier;
  } catch (error) {
    console.error('❌ Erreur planification notification quotidienne:', error);
    return '';
  }
}

/**
 * Planifie une notification hebdomadaire
 */
async scheduleWeeklyNotification(
  payload: NotificationPayload,
  weekday: number, // 1 = lundi, 7 = dimanche
  hour: number,
  minute: number
): Promise<string> {
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload.data,
        sound: payload.sound || 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        weekday,
        hour,
        minute,
        repeats: true,
      },
    });
    console.log(`✅ Notification hebdomadaire planifiée (jour ${weekday} à ${hour}:${minute}): ${identifier}`);
    return identifier;
  } catch (error) {
    console.error('❌ Erreur planification notification hebdomadaire:', error);
    return '';
  }
}

  /**
   * Annule une notification planifiée
   */
  async cancelScheduledNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      console.log(`✅ Notification annulée: ${identifier}`);
    } catch (error) {
      console.error('❌ Erreur annulation notification:', error);
    }
  }

  /**
   * Annule toutes les notifications planifiées
   */
  async cancelAllScheduledNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ Toutes les notifications ont été annulées');
    } catch (error) {
      console.error('❌ Erreur annulation notifications:', error);
    }
  }

  /**
   * Configure les rappels quotidiens
   */
  async setupDailyReminders(config: ReminderConfig): Promise<void> {
    // Annuler les anciens rappels
    await this.cancelAllScheduledNotifications();

    if (!config.enabled) return;

    // Calculer les heures des rappels
    const [checkInHour, checkInMinute] = config.checkInTime.split(':').map(Number);
    const [checkOutHour, checkOutMinute] = config.checkOutTime.split(':').map(Number);
    
    // Heure du rappel matin (heure_pointage - reminderBeforeMinutes)
    let reminderInHour = checkInHour;
    let reminderInMinute = checkInMinute - config.reminderBeforeMinutes;
    if (reminderInMinute < 0) {
      reminderInHour--;
      reminderInMinute += 60;
    }

    // Heure du rappel soir
    let reminderOutHour = checkOutHour;
    let reminderOutMinute = checkOutMinute - config.reminderBeforeMinutes;
    if (reminderOutMinute < 0) {
      reminderOutHour--;
      reminderOutMinute += 60;
    }

    // Créer les dates de rappel
    const now = new Date();
    const reminderInDate = new Date();
    reminderInDate.setHours(reminderInHour, reminderInMinute, 0, 0);
    
    const reminderOutDate = new Date();
    reminderOutDate.setHours(reminderOutHour, reminderOutMinute, 0, 0);

    // Si l'heure est déjà passée, programmer pour demain
    if (reminderInDate <= now) {
      reminderInDate.setDate(reminderInDate.getDate() + 1);
    }
    if (reminderOutDate <= now) {
      reminderOutDate.setDate(reminderOutDate.getDate() + 1);
    }

    // Programmer les rappels
    await this.scheduleNotificationAtDate(
      {
        title: '⏰ Rappel pointage',
        body: `N'oubliez pas de pointer votre arrivée dans ${config.reminderBeforeMinutes} minutes`,
        data: { type: 'CHECK_IN_REMINDER' },
        sound: 'default',
      },
      reminderInDate
    );

    await this.scheduleNotificationAtDate(
      {
        title: '⏰ Rappel pointage',
        body: `N'oubliez pas de pointer votre départ dans ${config.reminderBeforeMinutes} minutes`,
        data: { type: 'CHECK_OUT_REMINDER' },
        sound: 'default',
      },
      reminderOutDate
    );

    // Programmer des rappels quotidiens récurrents
    await this.scheduleRecurringReminder(config);
  }

  /**
   * Programme des rappels récurrents
   */
  private async scheduleRecurringReminder(config: ReminderConfig): Promise<void> {
    const [checkInHour, checkInMinute] = config.checkInTime.split(':').map(Number);
    const [checkOutHour, checkOutMinute] = config.checkOutTime.split(':').map(Number);

    // Rappel d'arrivée quotidien
    const arrivalTrigger = {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: checkInHour,
      minute: checkInMinute,
      repeats: true,
    };

    // Rappel de départ quotidien
    const departureTrigger = {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: checkOutHour,
      minute: checkOutMinute,
      repeats: true,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Heure de pointage',
        body: `C'est l'heure de pointer votre ${config.checkInTime === `${checkInHour}:${checkInMinute}` ? 'arrivée' : 'départ'} !`,
        data: { type: 'POINTAGE_REMINDER' },
        sound: 'default',
      },
      trigger: arrivalTrigger as any,
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Heure de pointage',
        body: `C'est l'heure de pointer votre départ !`,
        data: { type: 'POINTAGE_REMINDER' },
        sound: 'default',
      },
      trigger: departureTrigger as any,
    });

    console.log('✅ Rappels récurrents configurés');
  }

  /**
   * Envoie une notification de pointage réussi
   */
  async sendPointageSuccessNotification(
    type: 'ENTREE' | 'SORTIE',
    siteName: string,
    time: string,
    isLate?: boolean,
    lateMinutes?: number
  ): Promise<void> {
    const title = type === 'ENTREE' ? '✅ Arrivée pointée' : '✅ Départ pointé';
    let body = `Votre ${type === 'ENTREE' ? 'arrivée' : 'départ'} à ${siteName} a été enregistré à ${time}`;
    
    if (isLate && lateMinutes) {
      body += ` (${lateMinutes} min de retard)`;
    }

    await this.sendLocalNotification({
      title,
      body,
      data: { type: 'POINTAGE_SUCCESS', pointageType: type },
    });
  }

  /**
   * Envoie une notification d'erreur
   */
  async sendErrorNotification(message: string): Promise<void> {
    await this.sendLocalNotification({
      title: '❌ Erreur pointage',
      body: message,
      data: { type: 'POINTAGE_ERROR' },
    });
  }

  /**
   * Envoie une notification de rappel d'absence
   */
  async sendAbsenceReminder(): Promise<void> {
    await this.sendLocalNotification({
      title: '⚠️ Absence détectée',
      body: 'Vous n\'avez pas pointé aujourd\'hui. Pensez à justifier votre absence.',
      data: { type: 'ABSENCE_REMINDER' },
    });
  }

  /**
   * Envoie une notification de félicitations
   */
  async sendCongratulationNotification(
    message: string,
    stats: { present: number; partial: number; total: number }
  ): Promise<void> {
    await this.sendLocalNotification({
      title: '🏆 Félicitations !',
      body: `${message} (${stats.present}/${stats.total} jours présents cette semaine)`,
      data: { type: 'CONGRATULATIONS', stats },
    });
  }

  /**
   * Récupère le token Expo Push
   */
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }
}

export const notificationService = NotificationService.getInstance();