import { useState, useCallback, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { qrService } from '../services/qrService';
import { TerminalInfo } from '../types/qr.types';

interface UseQRGeneratorProps {
  terminalId: number;
  siteId: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useQRGenerator = ({
  terminalId,
  siteId,
  autoRefresh = true,
  refreshInterval = 30000,
}: UseQRGeneratorProps) => {
  const [qrData, setQrData] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(refreshInterval / 1000);
  const [terminalInfo, setTerminalInfo] = useState<TerminalInfo | null>(null);

  const generateQR = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const data = await qrService.generatePayload(terminalId, siteId);
      setQrData(data);
      setTimeRemaining(refreshInterval / 1000);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (err) {
      setError('Erreur lors de la génération du QR code');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [terminalId, siteId, refreshInterval]);

  useEffect(() => {
    generateQR();
    
    const loadTerminalInfo = async () => {
      try {
        const response = await fetch(`/api/terminals/${terminalId}`);
        const data = await response.json();
        setTerminalInfo(data);
      } catch (err) {
        console.error('Erreur chargement terminal:', err);
      }
    };
    loadTerminalInfo();
  }, [terminalId]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      generateQR();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, generateQR]);

  // Timer pour afficher le temps restant
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [qrData]);

  return {
    qrData,
    isGenerating,
    error,
    timeRemaining,
    terminalInfo,
    refresh: generateQR,
  };
};