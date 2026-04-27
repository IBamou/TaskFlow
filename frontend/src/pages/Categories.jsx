import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categoriesAPI } from '../services/api';
import Header from '../compoments/Header';
import Sidebar from '../compoments/Sidebar';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';

const Categories = () => {
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, [location.pathname]); // Re-run when location changes

    const loadCategories = async () => {
        try {
            console.log('Loading categories...');
            const response = await categoriesAPI.getAll();
            console.log('Categories response:', response);
            console.log('Categories data:', response.data);
            setCategories(response.data);
        } catch (error) {
            console.error('Error loading categories:', error);
            console.error('Error response:', error.response);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? All associated tasks will remain but lose their category association.')) {
            try {
                await categoriesAPI.delete(categoryId);
                setCategories(categories.filter(cat => cat.id !== categoryId));
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-8">
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                                <p className="text-gray-600">Organize your tasks with categories</p>
                            </div>
                            <Link
                                to="/categories/new"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                New Category
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        {categories.length === 0 ? (
                            <div className="p-12 text-center">
                                <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                                <p className="text-gray-500 mb-4">Create your first category to start organizing your tasks.</p>
                                <Link
                                    to="/categories/new"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create category
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {categories.map(category => (
                                    <div key={category.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/tasks?category=${category.id}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <FolderOpen className="h-6 w-6 text-gray-400 mr-3" />
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {category.tasks_count || 0} tasks
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    to={`/categories/${category.id}/edit`}
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Categories;