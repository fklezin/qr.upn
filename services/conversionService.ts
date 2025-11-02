import { UpnData } from '../types';

export const parseUpnString = (upnString: string): UpnData => {
  const lines = upnString.trim().split('\n').map(line => line.trimEnd());

  if (lines.length < 20 || lines[0] !== 'UPNQR') {
    const error = new Error('ERROR_INVALID_FORMAT');
    // Attach details to the error object for dynamic message generation
    (error as any).details = [lines.length]; 
    throw error;
  }

  return {
    payerIBAN: lines[1],
    deposit: lines[2] === 'X',
    withdrawal: lines[3] === 'X',
    payerReference: lines[4],
    payerName: lines[5],
    payerStreet: lines[6],
    payerCity: lines[7],
    amount: lines[8],
    paymentDate: lines[9] || undefined,
    urgent: lines[10] === 'X',
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
    throw new Error('ERROR_MISSING_DATA');
  }

  const amountStr = upnData.amount.trim();
  // Normalize by replacing comma with period for universal parsing
  const normalizedAmountStr = amountStr.replace(',', '.');
  let amountValue: number;

  // If there's no decimal point after normalization, it's cents.
  if (!normalizedAmountStr.includes('.')) {
    const amountInCents = parseInt(normalizedAmountStr, 10);
    amountValue = amountInCents / 100;
  } else {
    amountValue = parseFloat(normalizedAmountStr);
  }

  if (isNaN(amountValue)) {
    throw new Error('ERROR_INVALID_AMOUNT');
  }
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
