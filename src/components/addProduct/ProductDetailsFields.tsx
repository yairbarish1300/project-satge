interface ProductDetailsFieldsProps {
  name: string;
  onNameChange: (value: string) => void;
  sku: string;
  onSkuChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  price: string;
  onPriceChange: (value: string) => void;
}

export default function ProductDetailsFields({
  name, onNameChange,
  sku, onSkuChange,
  description, onDescriptionChange,
  category, onCategoryChange, categories,
  price, onPriceChange,
}: ProductDetailsFieldsProps) {
  return (
    <>
      <label className="add-product-field">
        <span>שם מוצר</span>
        <input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="לדוגמה: LED Wash Bar" />
      </label>

      <label className="add-product-field">
        <span>SKU</span>
        <input value={sku} onChange={(e) => onSkuChange(e.target.value)} placeholder="לדוגמה: LIGHT-88" />
      </label>

      <label className="add-product-field add-product-field-full">
        <span>תיאור</span>
        <textarea rows={3} value={description} onChange={(e) => onDescriptionChange(e.target.value)} placeholder="פרטים קצרים על המוצר" />
      </label>

      <label className="add-product-field">
        <span>קטגוריה</span>
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          {categories.map((branchName) => (
            <option key={branchName} value={branchName}>{branchName}</option>
          ))}
        </select>
      </label>

      <label className="add-product-field">
        <span>מחיר ליום (₪)</span>
        <input type="number" min="0" step="1" value={price} onChange={(e) => onPriceChange(e.target.value)} placeholder="0" />
      </label>
    </>
  );
}
