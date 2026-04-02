import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { usePresence } from '@/screens/dashboard/hooks/usePresence';
import { notificationService } from '../services/notificationService';
import { ReminderConfig } from '../types/notification.types';

export const useNotifications = (userId?: number) => {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);
  const { presence, metrics } = usePresence();

  useEffect(() => {
    initNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(handleNotification);

    responseListener.current = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const initNotifications = async () => {
    const token = await notificationService.initialize();
    setPushToken(token);

    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
  };

  const handleNotification = (notification: Notifications.Notification) => {
    console.log('📱 Notification reçue:', notification);
    // Traiter la notification en arrière-plan
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    console.log('🔘 Utilisateur a cliqué sur la notification:', response);
    const data = response.notification.request.content.data;
    
    // ✅ Correction : Vérifier si data existe avant d'accéder à ses propriétés
    if (!data) {
      console.log('Aucune data trouvée dans la notification');
      return;
    }
    
    // Naviguer selon le type de notification
    switch (data.type) {
      case 'CHECK_IN_REMINDER':
        // Naviguer vers l'écran de pointage
        console.log('Navigation vers écran de pointage');
        break;
      case 'POINTAGE_SUCCESS':
        // Afficher le détail
        console.log('Affichage détail pointage');
        break;
      case 'ABSENCE_REMINDER':
        // Naviguer vers justificatif
        console.log('Navigation vers justificatif');
        break;
      default:
        console.log('Type de notification non reconnu:', data.type);
        break;
    }
  };

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);
    return status === 'granted';
  };

  const setupReminders = async (config: ReminderConfig) => {
    await notificationService.setupDailyReminders(config);
  };

  const sendPointageSuccess = async (type: 'ENTREE' | 'SORTIE', siteName: string, isLate?: boolean, lateMinutes?: number) => {
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    await notificationService.sendPointageSuccessNotification(type, siteName, time, isLate, lateMinutes);
  };

  const sendAbsenceAlert = async () => {
    if (!presence?.heure_entree && new Date().getHours() >= 12) {
      await notificationService.sendAbsenceReminder();
    }
  };

  const checkAndSendWeeklyCongrats = async () => {
    const { objectifAtteint, objectif } = metrics;
    
    // Convertir les données au format attendu
    const total = objectif;
    const present = objectifAtteint;
    const partial = total - present;
    
    // Éviter la division par zéro
    if (total === 0) {
      console.log('Objectif total est 0, impossible de calculer le pourcentage');
      return;
    }
    
    const percentageComplete = (present / total) * 100;
    
    if (present >= total) {
      await notificationService.sendCongratulationNotification(
        'Objectif hebdomadaire atteint ! 🎉 Félicitations !',
        { present, partial, total }
      );
    } else if (percentageComplete >= 80) {
      await notificationService.sendCongratulationNotification(
        `Excellent ! ${present}h/${total}h cette semaine, continuez comme ça !`,
        { present, partial, total }
      );
    } else if (percentageComplete >= 50) {
      await notificationService.sendCongratulationNotification(
        `Bon début de semaine : ${present}h/${total}h, restez motivé !`,
        { present, partial, total }
      );
    }
  };

  return {
    pushToken,
    permissionStatus,
    requestPermission,
    setupReminders,
    sendPointageSuccess,
    sendAbsenceAlert,
    checkAndSendWeeklyCongrats,
  };
}; 