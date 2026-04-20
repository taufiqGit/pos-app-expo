import { useState, useCallback } from 'react';

export type PaymentMethod = 'cash' | 'card' | 'qr' | 'wallet';

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  tendered?: number;
  change?: number;
  reference?: string;
}

export interface PaymentState {
  isProcessing: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | null;
  paymentDetails: PaymentDetails | null;
}

const initialState: PaymentState = {
  isProcessing: false,
  isSuccess: false,
  isError: false,
  errorMessage: null,
  paymentDetails: null,
};

export function usePayment() {
  const [state, setState] = useState<PaymentState>(initialState);

  const processPayment = useCallback(async (details: PaymentDetails) => {
    setState((prev) => ({
      ...prev,
      isProcessing: true,
      isSuccess: false,
      isError: false,
      errorMessage: null,
      paymentDetails: details,
    }));

    try {
      // TODO: integrate with actual payment gateway / device
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const change =
        details.method === 'cash' && details.tendered !== undefined
          ? details.tendered - details.amount
          : 0;

      setState((prev) => ({
        ...prev,
        isProcessing: false,
        isSuccess: true,
        paymentDetails: { ...details, change },
      }));

      return { success: true, change };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Payment failed. Please try again.';

      setState((prev) => ({
        ...prev,
        isProcessing: false,
        isError: true,
        errorMessage: message,
      }));

      return { success: false, change: 0 };
    }
  }, []);

  const resetPayment = useCallback(() => {
    setState(initialState);
  }, []);

  const calculateChange = useCallback(
    (tendered: number): number => {
      if (!state.paymentDetails) return 0;
      return Math.max(0, tendered - state.paymentDetails.amount);
    },
    [state.paymentDetails]
  );

  return {
    ...state,
    processPayment,
    resetPayment,
    calculateChange,
  };
}
