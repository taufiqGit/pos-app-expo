import { useState, useCallback } from 'react';

interface BarcodeScanResult {
  type: string;
  data: string;
}

interface UseBarcodeReturn {
  scannedCode: BarcodeScanResult | null;
  isScanning: boolean;
  error: string | null;
  startScanning: () => void;
  stopScanning: () => void;
  handleBarcodeScan: (result: BarcodeScanResult) => void;
  resetScan: () => void;
}

const useBarcode = (): UseBarcodeReturn => {
  const [scannedCode, setScannedCode] = useState<BarcodeScanResult | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startScanning = useCallback(() => {
    setIsScanning(true);
    setError(null);
    setScannedCode(null);
  }, []);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
  }, []);

  const handleBarcodeScan = useCallback((result: BarcodeScanResult) => {
    if (!result?.data) {
      setError('Invalid barcode scanned.');
      return;
    }

    setScannedCode(result);
    setIsScanning(false);
  }, []);

  const resetScan = useCallback(() => {
    setScannedCode(null);
    setError(null);
    setIsScanning(false);
  }, []);

  return {
    scannedCode,
    isScanning,
    error,
    startScanning,
    stopScanning,
    handleBarcodeScan,
    resetScan,
  };
};

export default useBarcode;
