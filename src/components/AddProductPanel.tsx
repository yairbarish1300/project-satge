import { useEffect, useMemo, useState } from 'react';
import { useCategoryTree } from '../context/CategoryTreeContext';
import { useProductCatalog } from '../context/ProductCatalogContext';
import ProductDetailsFields from './addProduct/ProductDetailsFields';
import TagInput from './addProduct/TagInput';
import ImageUploadField from './addProduct/ImageUploadField';
import './AddProductPanel.css';

type AddProductPanelProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddProductPanel({ open, onClose }: AddProductPanelProps) {
  const { addProduct } = useProductCatalog();
  const { branches } = useCategoryTree();

  const branchCategories = useMemo(() => branches.map((branch) => branch.name), [branches]);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockTotal, setStockTotal] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageData, setImageData] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (branchCategories.length === 0) {
      setCategory('');
      return;
    }

    if (!branchCategories.includes(category)) {
      setCategory(branchCategories[0]);
    }
  }, [branchCategories, category]);

  const resetForm = () => {
    setName('');
    setSku('');
    setDescription('');
    setPrice('');
    setStockTotal('');
    setCategory(branchCategories[0] || '');
    setTags([]);
    setImageData('');
    setError('');
  };

  const closePanel = () => {
    resetForm();
    onClose();
  };

  const onSubmit = () => {
    const parsedPrice = Number(price);
    const parsedStock = Number(stockTotal);

    if (!name.trim() || !sku.trim() || !description.trim()) {
      setError('יש למלא שם מוצר, SKU ותיאור.');
      return;
    }
    if (!category) {
      setError('יש לבחור קטגוריה קיימת.');
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError('יש להזין מחיר יומי תקין.');
      return;
    }
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      setError('יש להזין כמות מלאי תקינה.');
      return;
    }

    addProduct({
      name,
      sku,
      description,
      category,
      image: imageData,
      price: parsedPrice,
      stockTotal: parsedStock,
      tags,
    });

    closePanel();
  };

  if (!open) return null;

  return (
    <div className="add-product-overlay" onClick={closePanel}>
      <section className="add-product-panel" onClick={(e) => e.stopPropagation()}>
        <div className="add-product-head">
          <div>
            <h3>הוסף מוצר חדש</h3>
            <p>המוצר יתווסף אוטומטית ל־Store ול־Inventory</p>
          </div>
          <button className="add-product-close" onClick={closePanel} aria-label="Close panel">
            <span className="msym">close</span>
          </button>
        </div>

        <div className="add-product-body">
          <ProductDetailsFields
            name={name} onNameChange={setName}
            sku={sku} onSkuChange={setSku}
            description={description} onDescriptionChange={setDescription}
            category={category} onCategoryChange={setCategory} categories={branchCategories}
            price={price} onPriceChange={setPrice}
            stockTotal={stockTotal} onStockTotalChange={setStockTotal}
          />

          <TagInput tags={tags} onChange={setTags} />

          <ImageUploadField value={imageData} onChange={setImageData} />
        </div>

        {error ? <p className="add-product-error">{error}</p> : null}

        <div className="add-product-actions">
          <button className="add-product-cancel" onClick={closePanel}>ביטול</button>
          <button className="add-product-submit" onClick={onSubmit}>הוסף מוצר</button>
        </div>
      </section>
    </div>
  );
}
