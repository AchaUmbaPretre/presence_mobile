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

    // Ajouter une signature pour la sécurité
    payload.signature = await this.signPayload(payload);

    // Chiffrer le payload
    const encrypted = await this.encrypt(JSON.stringify(payload));
    
    // Sauvegarder pour vérification
    await this.savePendingQR(payload);
    
    return encrypted;
  }

  /**
   * Vérifie et décode un QR code scanné
   */
  async verifyAndDecode(encryptedData: string): Promise<QRScanResult> {
    try {
      // Déchiffrer
      const decrypted = await this.decrypt(encryptedData);
      const payload: QRPayload = JSON.parse(decrypted);

      // Vérifier le type
      if (payload.type !== 'PRESENCE') {
        return {
          success: false,
          message: 'QR code invalide',
        };
      }

      // Vérifier l'expiration
      if (Date.now() - payload.timestamp > payload.expiresIn) {
        return {
          success: false,
          message: 'QR code expiré (30 secondes)',
        };
      }

      // Vérifier la signature
      const isValid = await this.verifySignature(payload);
      if (!isValid) {
        return {
          success: false,
          message: 'Signature invalide',
        };
      }

      // Vérifier si déjà utilisé
      const isUsed = await this.isQRUsed(payload);
      if (isUsed) {
        return {
          success: false,
          message: 'QR code déjà utilisé',
        };
      }

      // Marquer comme utilisé
      await this.markQRAsUsed(payload);

      // Récupérer les infos du terminal
      const terminalInfo = await this.getTerminalInfo(payload.terminalId);

      return {
        success: true,
        data: payload,
        message: 'QR code valide',
        terminalInfo,
      };
    } catch (error) {
      console.error('Erreur décodage QR:', error);
      return {
        success: false,
        message: 'QR code invalide',
      };
    }
  }

  /**
   * Chiffre une chaîne
   */
  private async encrypt(text: string): Promise<string> {
    // Implémentez votre chiffrement ici
    // Exemple simple (à renforcer en production)
    const buffer = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      text + SECRET_KEY
    );
    return Buffer.from(text).toString('base64') + '.' + buffer;
  }

  /**
   * Déchiffre une chaîne
   */
  private async decrypt(encrypted: string): Promise<string> {
    // Implémentez votre déchiffrement ici
    const [data] = encrypted.split('.');
    return Buffer.from(data, 'base64').toString('utf-8');
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
    
    // Nettoyer après expiration
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
      // Fallback pour développement
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