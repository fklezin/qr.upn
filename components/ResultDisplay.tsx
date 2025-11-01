
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { UpnData } from '../types';
import { RefreshCwIcon } from './Icons';

interface ResultDisplayProps {
  upnData: UpnData;
  epcPayload: string;
  onReset: () => void;
}

const DataRow: React.FC<{ label: string; value: string | undefined | boolean }> = ({ label, value }) => {
  if (!value) return null;
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-700">
      <dt className="text-sm text-brand-gray">{label}</dt>
      <dd className="text-sm text-right text-white font-medium">{displayValue}</dd>
    </div>
  );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ upnData, epcPayload, onReset }) => {
  return (
    <div className="bg-brand-light-dark p-6 rounded-lg shadow-xl w-full max-w-md mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-2">Conversion Successful!</h2>
      <p className="text-brand-gray mb-6 text-center">Scan the EPC QR code below with your banking app.</p>
      
      <div className="bg-white p-4 rounded-lg mb-6">
        <QRCodeSVG
          value={epcPayload}
          size={256}
          level="M"
          includeMargin={true}
        />
      </div>

      <div className="w-full mb-6">
        <h3 className="text-lg font-semibold text-white mb-2 text-center border-b border-gray-700 pb-2">Original UPN Data</h3>
        <dl className="space-y-1 mt-2">
          <DataRow label="Recipient" value={upnData.recipientName} />
          <DataRow label="IBAN" value={upnData.recipientIBAN} />
          <DataRow label="Amount" value={`${parseFloat(upnData.amount).toFixed(2)} EUR`} />
          <DataRow label="Purpose" value={upnData.purpose} />
          <DataRow label="Reference" value={upnData.recipientReference} />
        </dl>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-brand-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <RefreshCwIcon className="w-5 h-5" />
        Scan Another Code
      </button>
    </div>
  );
};

export default ResultDisplay;
