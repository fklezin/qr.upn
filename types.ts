
export interface UpnData {
  payerIBAN: string;
  deposit: boolean;
  withdrawal: boolean;
  payerReference: string;
  payerName: string;
  payerStreet: string;
  payerCity: string;
  amount: string;
  paymentDate?: string;
  urgent: boolean;
  purposeCode: string;
  purpose: string;
  paymentDueDate: string;
  recipientIBAN: string;
  recipientReference: string;
  recipientName: string;
  recipientStreet: string;
  recipientCity: string;
}
