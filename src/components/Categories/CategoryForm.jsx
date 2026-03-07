import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { categorySchema } from '../../utils/validators';
import categoryService from '../../services/categoryService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

/**
 * CategoryForm component for creating and editing event categories.
 * Features:
 * - Detects edit mode based on the presence of an :id route parameter
 * - Form validation using react-hook-form with yup categorySchema
 * - Fields: name, description, colorCode (with live colour preview swatch)
 * - On edit: pre-populates form with existing category data from categoryService.getById()
 * - On submit: calls categoryService.create (new) or categoryService.update (edit)
 * - Success toast notification and redirect back to /categories
 * - Inline validation errors displayed below each field
 * - Colour preview updates in real time as the user types a hex colour code
 */
function CategoryForm() {
  // Navigation hook for redirecting after form submission
  const navigate = useNavigate();

  // Route parameter: present when editing, absent when creating
  const { id } = useParams();

  // Determine if the form is in edit mode
  const isEditMode = Boolean(id);

  // Loading state for initial data fetch in edit mode
  const [loading, setLoading] = useState(isEditMode);

  // Error state for displaying fetch errors
  const [error, setError] = useState('');

  // Track form submission state to prevent double-clicks
  const [submitting, setSubmitting] = useState(false);

  // Initialize react-hook-form with yup category validation schema
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      colorCode: '#4F46E5',
    },
  });

  // Watch the colorCode field to update the live preview swatch
  const watchedColor = watch('colorCode');

  /**
   * On component mount in edit mode, fetch existing category data
   * and populate the form fields.
   */
  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          const response = await categoryService.getById(id);
          const category = response.data;
          // Reset form with fetched category data
          reset({
            name: category.name,
            description: category.description || '',
            colorCode: category.colorCode || '#4F46E5',
          });
        } catch (err) {
          setError('Failed to load category data. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchCategory();
    }
  }, [id, isEditMode, reset]);

  /**
   * Handle form submission: create a new category or update an existing one.
   */
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (isEditMode) {
        await categoryService.update(id, data);
        toast.success('Category updated successfully.');
      } else {
        await categoryService.create(data);
        toast.success('Category created successfully.');
      }
      // Redirect back to the categories list
      navigate('/categories');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save category. Please try again.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Display loading spinner while fetching existing data in edit mode
  if (loading) return <LoadingSpinner />;

  // Display error message if data fetch failed
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page heading changes based on create vs edit mode */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Category' : 'Add New Category'}
      </h2>

      {/* Category form card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Category name field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter category name"
            />
            {errors.name && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows="3"
              {...register('description')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the category"
            />
            {errors.description && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Colour code field with live preview */}
          <div>
            <label htmlFor="colorCode" className="block text-sm font-medium text-gray-700 mb-1">
              Colour Code
            </label>
            <div className="flex items-center space-x-3">
              {/* Colour preview swatch that updates in real time */}
              <span
                className="inline-block w-10 h-10 rounded-lg border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: watchedColor || '#6B7280' }}
              />
              <input
                id="colorCode"
                type="text"
                {...register('colorCode')}
                className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                  errors.colorCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="#FF5733"
              />
            </div>
            {errors.colorCode && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.colorCode.message}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">Enter a valid hex colour code (e.g., #FF5733)</p>
          </div>

          {/* Form action buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/categories')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? 'Saving...'
                : isEditMode
                ? 'Update Category'
                : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryForm;
