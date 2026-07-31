import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Image, Trash2, Check } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from '../../data/mockData';

export default function DonateLend() {
  const { addItem, updateItem, items } = useApp();
  const { currentUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const editId = searchParams.get('edit');
  const isEdit = !!editId;

  const [loading, setLoading] = useState(false);
  const [itemImage, setItemImage] = useState(null);
  const [imageError, setImageError] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      type: 'DONATE',
      condition: 'Good',
      quantity: 1,
    }
  });

  // Pre-populate if editing
  useEffect(() => {
    if (isEdit && items.length > 0) {
      const existingItem = items.find(i => i._id === editId);
      if (existingItem) {
        // Security check: Only owner or admin can edit
        if (existingItem.owner_id !== currentUser._id && currentUser.role !== 'admin') {
          toast.error('Unauthorized', 'You do not own this item.');
          navigate('/dashboard');
          return;
        }
        // Status check
        if (existingItem.status !== 'AVAILABLE' && currentUser.role !== 'admin') {
          toast.error('Locked', 'Only available items can be edited.');
          navigate('/dashboard');
          return;
        }

        reset({
          name: existingItem.name,
          category: existingItem.category,
          description: existingItem.description,
          type: existingItem.type,
          condition: existingItem.condition,
          quantity: existingItem.quantity,
        });
        setItemImage(existingItem.image);
      }
    }
  }, [editId, items, isEdit, currentUser, reset, navigate]);

  const onSubmit = async (data) => {
    // Image is required for new posts
    if (!isEdit && !itemImage) {
      setImageError(true);
      return;
    }
    setImageError(false);
    setLoading(true);
    try {
      if (isEdit) {
        await updateItem(editId, {
          ...data,
          quantity: Number(data.quantity),
          image: itemImage
        });
        toast.success('Item Updated ✓', `"${data.name}" has been updated.`);
      } else {
        await addItem({
          ...data,
          quantity: Number(data.quantity),
          owner_id: currentUser._id,
          status: 'AVAILABLE',
          image: itemImage
        });
        toast.success('Item Posted ✓', `"${data.name}" is now live!`);
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to save', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error('File too large', 'Please choose an image under 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemImage(reader.result);
        setImageError(false); // clear error once image is selected
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background)' }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: '2rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="card animate-fade-up" style={{ width: '100%', maxWidth: '650px', padding: '2.5rem', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 'var(--radius-lg)' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-mint-pale)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <ArrowLeft size={18} color="var(--color-text-dark)" />
            </button>
            <div>
              <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.75rem', color: 'var(--color-text-dark)', margin: 0 }}>
                {isEdit ? 'Edit Contribution' : 'Donate or Lend Item'}
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: '0.2rem 0 0 0' }}>
                {isEdit ? 'Modify details of your posted item' : 'Share items with your university community'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            
            {/* Item Name */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" htmlFor="item-name" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Item Name *</label>
              <input 
                id="item-name" 
                className={`form-input ${errors.name ? 'error' : ''}`} 
                placeholder="e.g. CASIO Scientific Calculator FX-991EX" 
                style={{ width: '100%', marginTop: '0.4rem' }}
                {...register('name', { 
                  required: 'Name is required', 
                  minLength: { value: 3, message: 'Must be at least 3 characters' } 
                })} 
              />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

            {/* Type + Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="item-type" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Listing Type *</label>
                <select id="item-type" className="form-input" style={{ width: '100%', marginTop: '0.4rem' }} {...register('type', { required: true })}>
                  <option value="DONATE">Donate (Give Away)</option>
                  <option value="LEND">Lend (Borrow & Return)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="item-category" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Category *</label>
                <select id="item-category" className="form-input" style={{ width: '100%', marginTop: '0.4rem' }} {...register('category', { required: 'Category is required' })}>
                  {ITEM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="form-error">{errors.category.message}</p>}
              </div>
            </div>

            {/* Condition + Quantity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="item-condition" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Condition *</label>
                <select id="item-condition" className="form-input" style={{ width: '100%', marginTop: '0.4rem' }} {...register('condition', { required: true })}>
                  {ITEM_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="item-quantity" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Quantity *</label>
                <input 
                  id="item-quantity" 
                  type="number" 
                  min="1" 
                  max="99"
                  className={`form-input ${errors.quantity ? 'error' : ''}`} 
                  style={{ width: '100%', marginTop: '0.4rem' }}
                  {...register('quantity', { 
                    required: 'Quantity required', 
                    min: { value: 1, message: 'Min 1' }, 
                    max: { value: 99, message: 'Max 99' } 
                  })} 
                />
                {errors.quantity && <p className="form-error">{errors.quantity.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" htmlFor="item-desc" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Description *</label>
              <textarea 
                id="item-desc" 
                className={`form-input ${errors.description ? 'error' : ''}`} 
                rows={4} 
                placeholder="Describe your item, details about its current condition, where to pick it up, or when it needs to be returned..."
                style={{ resize: 'vertical', width: '100%', marginTop: '0.4rem' }}
                {...register('description', { 
                  required: 'Description is required', 
                  minLength: { value: 10, message: 'At least 10 characters' } 
                })} 
              />
              {errors.description && <p className="form-error">{errors.description.message}</p>}
            </div>

            {/* Product Image File Selector */}
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>Product Image {!isEdit && '*'}</label>
              
              {itemImage ? (
                <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', background: 'var(--color-mint-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                  <img src={itemImage} alt="Product preview" style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', display: 'block' }} />
                  <button 
                    type="button" 
                    onClick={() => setItemImage(null)} 
                    style={{ position: 'absolute', top: '10px', right: '10px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Trash2 size={16} color="#d32f2f" />
                  </button>
                </div>
              ) : (
                <label 
                  htmlFor="product-image-upload" 
                  style={{
                    border: `2px dashed ${imageError ? '#d32f2f' : 'var(--color-border)'}`, 
                    borderRadius: 'var(--radius-md)',
                    padding: '2.5rem 1.5rem', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    gap: '0.6rem', 
                    background: imageError ? '#fff5f5' : 'var(--color-mint-pale)',
                    color: 'var(--color-text-mid)', 
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = imageError ? '#b71c1c' : 'var(--color-green-main)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = imageError ? '#d32f2f' : 'var(--color-border)'}
                >
                  <Image size={28} opacity={0.6} color={imageError ? '#d32f2f' : 'var(--color-green-main)'} />
                  <span style={{ fontWeight: 600, color: imageError ? '#d32f2f' : 'var(--color-text-dark)' }}>Upload Product Photo</span>
                  <span style={{ fontSize: '0.75rem', color: imageError ? '#d32f2f' : 'var(--color-text-light)' }}>Click to browse from your device (Max 3MB)</span>
                </label>
              )}
              
              <input 
                id="product-image-upload" 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleImageChange}
              />
              {imageError && (
                <p className="form-error" style={{ marginTop: '0.4rem' }}>Product image is required.</p>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-md" 
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-md"
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {loading ? (
                  <>
                    <span className="spinner" /> 
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    {isEdit ? 'Save Changes' : 'Post Item'}
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
