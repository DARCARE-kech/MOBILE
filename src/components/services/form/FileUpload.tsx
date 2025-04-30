
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileChange(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImagePreview(null);
    onFileChange(null);
  };
  
  return (
    <div className="space-y-2 mb-4">
      <Label className="text-darcare-gold font-serif">
        {t('services.uploadImage')}
      </Label>
      
      {imagePreview ? (
        <div className="relative mt-2 rounded-md overflow-hidden">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-md" 
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 bg-darcare-navy/70 border-darcare-gold/20 hover:bg-darcare-navy"
            onClick={removeImage}
          >
            <X className="h-4 w-4 text-darcare-gold" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center border border-dashed border-darcare-gold/30 rounded-md p-6 bg-darcare-navy/30">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="h-10 w-10 text-darcare-gold/60 mb-2" />
            <span className="text-darcare-beige text-sm">{t('services.clickToUpload')}</span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
