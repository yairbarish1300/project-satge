import { useEffect, useMemo, useState } from 'react';
import { useCategoryTree } from '../context/CategoryTreeContext';
import { useProductCatalog, type CatalogProduct } from '../context/ProductCatalogContext';
import ProductDetailsFields from './addProduct/ProductDetailsFields';
import TagInput from './addProduct/TagInput';
import ImageUploadField from './addProduct/ImageUploadField';
import './AddProductPanel.css';

type AddProductPanelProps = {
  open: boolean;
  onClose: () => void;
  // When set, the panel edits this product instead of creating a new one.
  editingProduct?: CatalogProduct | null;
};

export default function AddProductPanel({ open, onClose, editingProduct = null }: AddProductPanelProps) {
  const { addProduct, updateProduct } = useProductCatalog();
  const { branches } = useCategoryTree();
  const isEditing = Boolean(editingProduct);

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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (editingProduct) {
      setName(editingProduct.name);
      setSku(editingProduct.sku);
      setDescription(editingProduct.description);
      setPrice(String(editingProduct.price));
      setStockTotal(String(editingProduct.stockTotal));
      setCategory(editingProduct.category);
      setTags(editingProduct.tags);
      setImageData(editingProduct.image);
    } else {
      setName('');
      setSku('');
      setDescription('');
      setPrice('');
      setStockTotal('');
      setCategory(branchCategories[0] || '');
      setTags([]);
      setImageData('');
    }
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingProduct]);

  useEffect(() => {
    if (isEditing) return;
    if (branchCategories.length === 0) {
      setCategory('');
      return;
    }
    if (!branchCategories.includes(category)) {
      setCategory(branchCategories[0]);
    }
  }, [branchCategories, category, isEditing]);

  const closePanel = () => {
    setError('');
    onClose();
  };

  const onSubmit = async () => {
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

    setSubmitting(true);
    setError('');
    try {
      if (isEditing && editingProduct) {
        await updateProduct(editingProduct.id, {
          name,
          sku,
          description,
          category,
          image: imageData,
          price: parsedPrice,
          stockTotal: parsedStock,
          tags,
        });
      } else {
        await addProduct({
          name,
          sku,
          description,
          category,
          image: imageData,
          price: parsedPrice,
          stockTotal: parsedStock,
          tags,
        });
      }
      closePanel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'השמירה נכשלה, נסה שוב');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="add-product-overlay" onClick={closePanel}>
      <section className="add-product-panel" onClick={(e) => e.stopPropagation()}>
        <div className="add-product-head">
          <div>
            <h3>{isEditing ? 'עריכת מוצר' : 'הוסף מוצר חדש'}</h3>
            <p>{isEditing ? 'השינויים יתעדכנו מיידית ב-Store וב-Inventory' : 'המוצר יתווסף אוטומטית ל־Store ול־Inventory'}</p>
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
          <button className="add-product-submit" onClick={onSubmit} disabled={submitting}>
            {submitting ? 'שומר...' : isEditing ? 'שמור שינויים' : 'הוסף מוצר'}
          </button>
        </div>
      </section>
    </div>
  );
}
