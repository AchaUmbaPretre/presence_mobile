// services/qrService.ts
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/api/client';
import { QRPayload, TerminalInfo, QRScanResult } from '../types/qr.types';

const SECRET_KEY = 'VOTRE_CLE_SECRETE_ICI'; // À mettre dans .env

class QRService {
  private static instance: QRService;
  private readonly QR_EXPIRY = 30000; // 30 secondes

  static getInstance(): QRService {
    if (!QRService.instance) {
      QRService.instance = new QRService();
    }
    return QRService.instance;
  }

  /**
   * Génère un payload pour QR code
   */
  async generatePayload(terminalId: number, siteId: number): Promise<string> {
    const payload: QRPayload = {
      type: 'PRESENCE',
      terminalId,
      siteId,
      timestamp: Date.now(),
      expiresIn: this.QR_EXPIRY,
    };

    payload.signature = await this.signPayload(payload);
    
    const jsonString = JSON.stringify(payload);
    const encrypted = await this.encrypt(jsonString);
    
    await this.savePendingQR(payload);
    
    return encrypted;
  }

  /**
   * Vérifie et décode un QR code scanné
   */
  async verifyAndDecode(encryptedData: string): Promise<QRScanResult> {
    const timestamp = Date.now();
    
    try {
      // ✅ Étape 1: Vérifier si c'est un QR code externe (URL ou texte)
      if (this.isExternalQR(encryptedData)) {
        console.log('QR code externe détecté:', encryptedData);
        return await this.handleExternalQR(encryptedData);
      }

      // ✅ Étape 2: Essayer de décoder comme JSON
      let payload: QRPayload;
      let decrypted: string;

      try {
        decrypted = await this.decrypt(encryptedData);
        payload = JSON.parse(decrypted);
      } catch (parseError) {
        try {
          payload = JSON.parse(encryptedData);
        } catch {
          console.log('Format QR non standard:', encryptedData);
          return await this.handleStandardQR(encryptedData);
        }
      }

      // Vérifier le type
      if (payload.type !== 'PRESENCE') {
        return {
          success: false,
          message: 'QR code non valide pour le pointage',
          timestamp,
          error: 'INVALID_TYPE',
        };
      }

      // Vérifier l'expiration
      if (Date.now() - payload.timestamp > payload.expiresIn) {
        return {
          success: false,
          message: 'QR code expiré',
          timestamp,
          error: 'EXPIRED',
        };
      }

      // Vérifier la signature
      const isValid = await this.verifySignature(payload);
      if (!isValid) {
        return {
          success: false,
          message: 'Signature invalide',
          timestamp,
          error: 'INVALID_SIGNATURE',
        };
      }

      // Vérifier si déjà utilisé
      const isUsed = await this.isQRUsed(payload);
      if (isUsed) {
        return {
          success: false,
          message: 'QR code déjà utilisé',
          timestamp,
          error: 'ALREADY_USED',
        };
      }

      await this.markQRAsUsed(payload);
      const terminalInfo = await this.getTerminalInfo(payload.terminalId);

      return {
        success: true,
        data: payload,
        message: 'QR code valide',
        timestamp,
        terminalInfo,
      };
    } catch (error) {
      console.error('Erreur décodage QR:', error);
      return {
        success: false,
        message: 'QR code invalide',
        timestamp,
        error: error instanceof Error ? error.message : 'DECODE_ERROR',
      };
    }
  }

  /**
   * Vérifie si le QR est un code externe (URL, texte simple)
   */
  private isExternalQR(data: string): boolean {
    if (data.startsWith('http://') || data.startsWith('https://')) {
      return true;
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(data)) {
      return true;
    }
    
    if (data.length < 20 && !data.includes('{')) {
      return true;
    }
    
    return false;
  }

  /**
   * Gère les QR codes externes (URLs, textes simples)
   */
  private async handleExternalQR(data: string): Promise<QRScanResult> {
    if (data.startsWith('http://') || data.startsWith('https://')) {
      try {
        const url = new URL(data);
        const code = url.searchParams.get('code') || url.searchParams.get('token') || url.pathname.split('/').pop();
        
        if (code) {
          return await this.handleStandardQR(code);
        }
      } catch (e) {
        console.error('Erreur parsing URL:', e);
      }
    }
    
    return await this.handleStandardQR(data);
  }

  /**
   * Gère les QR codes standard avec appel API
   */
// services/qrService.ts - Modifier handleStandardQR
private async handleStandardQR(code: string): Promise<QRScanResult> {
  try {
    console.log('Validation QR code:', code);
    
    const response = await api.post('/api/presence/qr/validate', { code });
    
    console.log('Réponse API:', response.data);
    
    if (response.data.success) {
      // ✅ Construire le payload avec TOUTES les données de l'API
      const apiData = response.data.data;
      
      const payload: QRPayload = {
        type: 'PRESENCE',
        terminalId: apiData?.terminal_id || 0,
        siteId: apiData?.site_id || 0,
        timestamp: Date.now(),
        expiresIn: 3600,
        type_scan: apiData?.type_scan,
        site_name: apiData?.site_name,
        zone_name: apiData?.zone_name,
        distance: apiData?.distance,
        is_within_zone: apiData?.is_within_zone,
        retard_minutes: apiData?.retard_minutes,
        heures_supplementaires: apiData?.heures_supplementaires,
        scan_time: apiData?.scan_time,
        jour_non_travaille: apiData?.jour_non_travaille,
        is_new_record: apiData?.is_new_record,
      };
      
      return {
        success: true,
        data: payload,
        message: response.data.message || 'QR code valide',
        timestamp: Date.now(),
        terminalInfo: {
          id: apiData?.terminal_id || 0,
          name: apiData?.terminal_name || 'Terminal',
          siteId: apiData?.site_id || 0,
          siteName: apiData?.site_name || 'Site',
          isEnabled: true,
        },
        validationDetails: {
          isValid: true,
          distance: apiData?.distance,
          isWithinZone: apiData?.is_within_zone,
        },
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'QR code invalide',
        timestamp: Date.now(),
        error: 'INVALID_QR',
      };
    }
  } catch (error: any) {
    console.error('Erreur validation QR:', error);
    
    const status = error.response?.status;
    const errorData = error.response?.data;
    
    if (status === 409) {
      return {
        success: false,
        message: errorData?.message || 'Pointage déjà effectué pour aujourd\'hui',
        timestamp: Date.now(),
        error: 'ALREADY_COMPLETE',
      };
    }
    
    return {
      success: false,
      message: errorData?.message || 'Erreur de validation du QR code',
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'API_ERROR',
    };
  }
}
  /**
   * Chiffre une chaîne
   */
  private async encrypt(text: string): Promise<string> {
    return text;
  }

  /**
   * Déchiffre une chaîne
   */
  private async decrypt(encrypted: string): Promise<string> {
    return encrypted;
  }

  /**
   * Signe un payload
   */
  private async signPayload(payload: QRPayload): Promise<string> {
    const data = `${payload.terminalId}-${payload.siteId}-${payload.timestamp}`;
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      data + SECRET_KEY
    );
  }

  /**
   * Vérifie la signature
   */
  private async verifySignature(payload: QRPayload): Promise<boolean> {
    if (!payload.signature) return false;
    
    const expected = await this.signPayload(payload);
    return payload.signature === expected;
  }

  /**
   * Sauvegarde un QR en attente
   */
  private async savePendingQR(payload: QRPayload): Promise<void> {
    const key = `qr_pending_${payload.terminalId}_${payload.timestamp}`;
    await AsyncStorage.setItem(key, JSON.stringify(payload));
    
    setTimeout(async () => {
      await AsyncStorage.removeItem(key);
    }, payload.expiresIn + 5000);
  }

  /**
   * Vérifie si un QR a déjà été utilisé
   */
  private async isQRUsed(payload: QRPayload): Promise<boolean> {
    const key = `qr_used_${payload.terminalId}_${payload.timestamp}`;
    const used = await AsyncStorage.getItem(key);
    return used !== null;
  }

  /**
   * Marque un QR comme utilisé
   */
  private async markQRAsUsed(payload: QRPayload): Promise<void> {
    const key = `qr_used_${payload.terminalId}_${payload.timestamp}`;
    await AsyncStorage.setItem(key, 'used');
  }

  /**
   * Récupère les infos d'un terminal
   */
  private async getTerminalInfo(terminalId: number): Promise<TerminalInfo> {
    try {
      const response = await api.get(`/api/terminals/${terminalId}`);
      return response.data;
    } catch (error) {
      return {
        id: terminalId,
        name: `Terminal ${terminalId}`,
        siteId: 1,
        siteName: 'Site Principal',
        isEnabled: true,
      };
    }
  }

  /**
   * Nettoie les QR expirés
   */
  async cleanExpiredQRs(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const qrKeys = keys.filter(key => key.startsWith('qr_pending_'));
    
    for (const key of qrKeys) {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const payload: QRPayload = JSON.parse(data);
        if (Date.now() - payload.timestamp > payload.expiresIn) {
          await AsyncStorage.removeItem(key);
        }
      }
    }
  }
}

export const qrService = QRService.getInstance();