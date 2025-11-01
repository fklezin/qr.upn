
import { UpnData } from '../types';

export const parseUpnString = (upnString: string): UpnData => {
  const lines = upnString.split('\n').map(line => line.trim());

  if (lines.length < 19 || lines[0] !== 'UPNQR') {
    throw new Error('Invalid UPN QR format. Expected at least 19 lines starting with UPNQR.');
  }

  return {
    payerIBAN: lines[1],
    deposit: !!lines[2],
    withdrawal: !!lines[3],
    payerReference: lines[4],
    payerName: lines[5],
    payerStreet: lines[6],
    payerCity: lines[7],
    amount: lines[8],
    paymentDate: lines[9] || undefined,
    urgent: !!lines[10],
    purposeCode: lines[11],
    purpose: lines[12],
    paymentDueDate: lines[13],
    recipientIBAN: lines[14],
    recipientReference: lines[15],
    recipientName: lines[16],
    recipientStreet: lines[17],
    recipientCity: lines[18],
  };
};

export const convertUpnToEpc = (upnData: UpnData): string => {
  if (!upnData.recipientName || !upnData.recipientIBAN || !upnData.amount) {
    throw new Error('Missing essential data for EPC conversion (Recipient Name, IBAN, or Amount).');
  }

  // UPN amount is a string of 11 digits representing cents, e.g., "0000026874" for 268.74
  const amountInCents = parseInt(upnData.amount, 10);
  if (isNaN(amountInCents)) {
    throw new Error('Invalid amount format in UPN data.');
  }
  const amountValue = amountInCents / 100;
  const formattedAmount = `EUR${amountValue.toFixed(2)}`;
  
  const recipientIBAN = upnData.recipientIBAN.replace(/\s/g, '');

  const payload = [
    'BCD',                      // Service Tag
    '002',                      // Version
    '1',                        // Character Set (1 = UTF-8)
    'SCT',                      // Identification Code
    '',                         // BIC (Optional)
    upnData.recipientName,      // Beneficiary
    recipientIBAN,              // IBAN
    formattedAmount,            // Amount
    upnData.purposeCode,        // Purpose of transaction (optional)
    upnData.recipientReference, // Remittance information (structured)
    upnData.purpose,            // Remittance information (unstructured)
    ''                          // Beneficiary to originator information (optional)
  ];

  return payload.join('\n');
};
