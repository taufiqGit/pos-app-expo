import { useState, useCallback } from 'react';

export interface PrinterStatus {
  isConnected: boolean;
  isReady: boolean;
  deviceName: string | null;
  error: string | null;
}

export interface PrintJob {
  receiptId: string;
  content: string;
  copies?: number;
}

const initialStatus: PrinterStatus = {
  isConnected: false,
  isReady: false,
  deviceName: null,
  error: null,
};

export function usePrinter() {
  const [status, setStatus] = useState<PrinterStatus>(initialStatus);
  const [isPrinting, setIsPrinting] = useState(false);

  const connect = useCallback(async (deviceName?: string) => {
    try {
      setStatus((prev) => ({ ...prev, error: null }));
      // TODO: implement actual printer connection (e.g. Bluetooth / USB / Network)
      setStatus({
        isConnected: true,
        isReady: true,
        deviceName: deviceName ?? 'Default Printer',
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect to printer';
      setStatus((prev) => ({ ...prev, isConnected: false, isReady: false, error: message }));
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      // TODO: implement actual printer disconnection
      setStatus(initialStatus);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disconnect printer';
      setStatus((prev) => ({ ...prev, error: message }));
    }
  }, []);

  const print = useCallback(async (job: PrintJob): Promise<boolean> => {
    if (!status.isConnected || !status.isReady) {
      setStatus((prev) => ({ ...prev, error: 'Printer is not connected or not ready' }));
      return false;
    }

    try {
      setIsPrinting(true);
      setStatus((prev) => ({ ...prev, error: null }));
      // TODO: implement actual print logic using printer SDK
      console.log(`Printing receipt [${job.receiptId}] × ${job.copies ?? 1} cop(ies)`);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Print job failed';
      setStatus((prev) => ({ ...prev, error: message }));
      return false;
    } finally {
      setIsPrinting(false);
    }
  }, [status.isConnected, status.isReady]);

  const clearError = useCallback(() => {
    setStatus((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    status,
    isPrinting,
    connect,
    disconnect,
    print,
    clearError,
  };
}
