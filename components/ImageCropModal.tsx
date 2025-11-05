import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import { translations } from '../translations';
import { CheckIcon, XIcon } from './Icons';

interface ImageCropModalProps {
  imageSrc: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
  t: (key: keyof typeof translations, ...args: any[]) => string;
}

// Helper function to get the cropped image as a blob
function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = Math.floor(crop.width * scaleX);
    canvas.height = Math.floor(crop.height * scaleY);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return Promise.resolve(null);
    }
    
    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) {
                console.error('Canvas is empty');
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(blob);
        }, 'image/png');
    });
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({ imageSrc, onConfirm, onCancel, t }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const stylesheetUrl = 'https://cdn.jsdelivr.net/npm/react-image-crop@11.0.5/dist/ReactCrop.min.css';
    const linkId = 'react-image-crop-styles';

    if (document.getElementById(linkId)) {
      return; // Already added
    }

    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = stylesheetUrl;
    document.head.appendChild(link);

    return () => {
      const linkToRemove = document.getElementById(linkId);
      if (linkToRemove) {
        document.head.removeChild(linkToRemove);
      }
    };
  }, []);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 50,
        },
        1, // aspect ratio 1:1
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  }

  const handleConfirmCrop = async () => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current) {
      try {
        const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
        if (croppedImageBlob) {
            onConfirm(croppedImageBlob);
        } else {
            // Handle error, maybe show an alert
            alert("Could not crop image.");
        }
      } catch (e) {
        console.error(e);
        alert("An error occurred while cropping the image.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4">
      <div className="bg-white border border-brand-gray-light rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative flex flex-col">
        <h2 className="text-2xl font-bold text-brand-primary mb-4 text-center border-b border-brand-primary/20 pb-3">{t('cropTitle')}</h2>
        <p className="text-brand-gray mb-6 text-center">{t('cropDescription')}</p>
        
        <div className="flex-grow flex items-center justify-center mb-6">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              minWidth={50}
              minHeight={50}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageSrc}
                onLoad={onImageLoad}
                className="max-w-full max-h-[50vh] object-contain"
              />
            </ReactCrop>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
                onClick={onCancel}
                className="w-full sm:w-auto bg-white text-brand-gray font-semibold py-3 px-8 rounded-lg hover:bg-brand-light-dark transition-colors border-2 border-brand-gray-light flex items-center justify-center gap-2"
            >
                <XIcon className="w-6 h-6" />
                {t('cropCancel')}
            </button>
            <button
                onClick={handleConfirmCrop}
                disabled={!completedCrop?.width || !completedCrop?.height}
                className="w-full sm:w-auto bg-brand-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-brand-primary-hover transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <CheckIcon className="w-6 h-6" />
                {t('cropConfirm')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;