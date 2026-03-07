import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import categoryService from '../../services/categoryService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';

/**
 * CategoryList component displays all event categories in a table/grid format.
 * Features:
 * - Page title with "Add Category" navigation button
 * - Table columns: Name (with colour badge), Description, Actions
 * - Colour badge next to each category name showing its assigned colour code
 * - Edit button navigates to the category edit form
 * - Delete button opens a confirmation dialog before removal
 * - Toast notifications for successful deletion or API errors
 * - Loading spinner and error message handling
 */
function CategoryList() {
  // State for the list of categories fetched from the API
  const [categories, setCategories] = useState([]);

  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true);

  // Error state for displaying API error messages
  const [error, setError] = useState('');

  // State controlling the delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, categoryId: null });

  /**
   * Fetch all categories from the API on component mount.
   */
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Retrieve the full list of categories from the backend.
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (err) {
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Open the delete confirmation dialog for a specific category.
   * @param {number} id - The ID of the category to delete
   */
  const handleDeleteClick = (id) => {
    setDeleteDialog({ isOpen: true, categoryId: id });
  };

  /**
   * Confirm deletion: call the API, remove from state, show toast.
   */
  const handleDeleteConfirm = async () => {
    try {
      await categoryService.delete(deleteDialog.categoryId);
      setCategories((prev) => prev.filter((c) => c.id !== deleteDialog.categoryId));
      toast.success('Category deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete category. It may be in use by events.');
    } finally {
      setDeleteDialog({ isOpen: false, categoryId: null });
    }
  };

  /**
   * Cancel the delete operation and close the dialog.
   */
  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, categoryId: null });
  };

  // Display loading spinner while data is being fetched
  if (loading) return <LoadingSpinner />;

  // Display error message if the API call failed
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {/* Page header with title and Add Category button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
        <Link
          to="/categories/new"
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium text-sm"
        >
          <FiPlus className="mr-2" />
          Add Category
        </Link>
      </div>

      {/* Categories data table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition">
                    {/* Category name with colour badge */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {/* Colour swatch showing the category's colour code */}
                        <span
                          className="inline-block w-4 h-4 rounded-full mr-3 border border-gray-200"
                          style={{ backgroundColor: category.colorCode || '#6B7280' }}
                        />
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      </div>
                    </td>
                    {/* Category description with fallback */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {category.description || '-'}
                    </td>
                    {/* Action buttons: Edit and Delete */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/categories/edit/${category.id}`}
                          className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition"
                          title="Edit category"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(category.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition"
                          title="Delete category"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Empty state when no categories exist
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-400">
                    No categories found. Add your first category to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category? Events using this category may be affected."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default CategoryList;
