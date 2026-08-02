import type { ChangeEvent } from 'react';

interface ImageUploadFieldProps {
  value: string;
  onChange: (dataUrl: string) => void;
}

export default function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onChange('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') onChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <label className="add-product-field add-product-field-full">
      <span>תמונת מוצר</span>
      <input type="file" accept="image/*" onChange={onFileChange} />
      {value ? <img className="add-product-preview" src={value} alt="Product preview" /> : null}
    </label>
  );
}
