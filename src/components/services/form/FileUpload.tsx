
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  existingUrl?: string;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileChange, 
  existingUrl,
  accept = "image/*" 
}) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearFile = () => {
    setFileName(null);
    setPreview(null);
    onFileChange(null);
  };
  
  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt={t('services.preview')} 
            className="w-full h-48 object-cover rounded-md" 
          />
          <button 
            className="absolute top-2 right-2 bg-darcare-navy/80 text-white p-2 rounded-full"
            onClick={clearFile}
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-darcare-gold/20 rounded-lg p-8 text-center">
          <input 
            type="file" 
            id="file-upload" 
            accept={accept} 
            onChange={handleFileChange}
            className="sr-only"
          />
          <label 
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <UploadCloud className="h-8 w-8 text-darcare-gold mb-2" />
            <span className="text-darcare-beige mb-1">{t('services.uploadImage')}</span>
            <span className="text-darcare-beige/50 text-sm">{t('services.dragDropHere')}</span>
          </label>
        </div>
      )}
      
      {fileName && (
        <div className="flex items-center justify-between bg-darcare-navy/70 p-2 rounded-md">
          <span className="text-darcare-beige text-sm truncate">{fileName}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-darcare-beige/70 hover:text-darcare-beige"
            onClick={clearFile}
            type="button"
          >
            <X size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
