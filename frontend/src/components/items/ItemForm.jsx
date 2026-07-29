import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Package, Image } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from '../../data/mockData';

export default function ItemForm({ item, onSuccess, onClose }) {
  const { addItem, updateItem } = useApp();
  const { currentUser } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: item ? {
      name: item.name,
      category: item.category,
      description: item.description,
      type: item.type,
      condition: item.condition,
      quantity: item.quantity,
    } : {
      type: 'DONATE',
      condition: 'Good',
      quantity: 1,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    if (isEdit) {
      updateItem(item._id, { ...data, quantity: Number(data.quantity) });
      toast.success('Item Updated ✓', `"${data.name}" has been updated.`);
    } else {
      addItem({ ...data, quantity: Number(data.quantity), owner_id: currentUser._id, status: 'AVAILABLE', image: null });
      toast.success('Item Posted ✓', `"${data.name}" is now live!`);
    }
    setLoading(false);
    onSuccess?.();
    onClose?.();
  };

  const inputDisabled = isEdit && item?.status !== 'AVAILABLE';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {inputDisabled && (
        <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#f57f17' }}>
          ⚠️ Core fields are locked while this item is active (status: {item.status}).
        </div>
      )}

      {/* Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="item-name">Item Name *</label>
        <input id="item-name" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="e.g. Data Structures Textbook" disabled={inputDisabled}
          {...register('name', { required: 'Name is required', minLength: { value: 3, message: 'At least 3 characters' } })} />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      {/* Type + Category row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="item-type">Type *</label>
          <select id="item-type" className="form-input" disabled={inputDisabled} {...register('type', { required: true })}>
            <option value="DONATE">Donate</option>
            <option value="LEND">Lend</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="item-category">Category *</label>
          <select id="item-category" className="form-input" disabled={inputDisabled} {...register('category', { required: 'Category required' })}>
            {ITEM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="form-error">{errors.category.message}</p>}
        </div>
      </div>

      {/* Condition + Quantity row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="item-condition">Condition *</label>
          <select id="item-condition" className="form-input" {...register('condition', { required: true })}>
            {ITEM_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="item-quantity">Quantity *</label>
          <input id="item-quantity" type="number" min="1" className={`form-input ${errors.quantity ? 'error' : ''}`}
            {...register('quantity', { required: true, min: { value: 1, message: 'Min 1' }, max: { value: 99, message: 'Max 99' } })} />
          {errors.quantity && <p className="form-error">{errors.quantity.message}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="item-desc">Description *</label>
        <textarea id="item-desc" className={`form-input ${errors.description ? 'error' : ''}`}
          rows={3} placeholder="Describe the item, its condition, and any relevant details..."
          style={{ resize: 'vertical' }}
          {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'At least 10 characters' } })}
        />
        {errors.description && <p className="form-error">{errors.description.message}</p>}
      </div>

      {/* Image placeholder */}
      <div className="form-group">
        <label className="form-label">Item Image (optional)</label>
        <div style={{
          border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
          padding: '1.5rem', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.5rem', background: 'var(--color-mint-pale)',
          color: 'var(--color-text-light)', fontSize: '0.85rem',
        }}>
          <Image size={24} opacity={0.4} />
          <span>Image upload — coming in Phase 2 (Firebase Storage)</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
        <button type="submit" disabled={loading} className="btn btn-primary" id="item-form-submit">
          {loading ? <><span className="spinner" /> Saving...</> : isEdit ? 'Update Item' : 'Post Item'}
        </button>
      </div>
    </form>
  );
}
