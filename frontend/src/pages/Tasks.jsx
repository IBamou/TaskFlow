import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { tasksAPI, categoriesAPI } from '../services/api';
import Header from '../compoments/Header';
import Sidebar from '../compoments/Sidebar';
import TaskCard from '../compoments/TaskCard';
import { Plus, Search, Filter, ArrowLeft } from 'lucide-react';

const Tasks = () => {
    const location = useLocation();
    const { id: categoryId } = useParams(); // Get category ID from route params
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, completed, pending

    // Get category filter from route params
    const currentCategory = categories.find(cat => cat.id === parseInt(categoryId));

    useEffect(() => {
        loadData();
        // Set the category filter if provided in route
        if (categoryId) {
            setSelectedCategory(categoryId);
        }
    }, [location.pathname, categoryId]); // Re-run when location or category ID changes

    const loadData = async () => {
        try {
            // Build query parameters
            const params = {};
            if (categoryId) {
                params.category_id = categoryId;
            }

            const [tasksResponse, categoriesResponse] = await Promise.all([
                tasksAPI.getAll(params),
                categoriesAPI.getAll()
            ]);

            setTasks(tasksResponse.data);
            setCategories(categoriesResponse.data);
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks(tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
        ));
    };

    const handleTaskDelete = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

        // If we have a category filter from URL, tasks are already filtered by backend
        // Otherwise, use the selected category filter
        const matchesCategory = !selectedCategory || task.category_id === parseInt(selectedCategory);

        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'completed' && task.completed) ||
            (statusFilter === 'pending' && !task.completed);

        return matchesSearch && matchesCategory && matchesStatus;
    });

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
                                {currentCategory ? (
                                    <div className="flex items-center">
                                        <Link
                                            to="/categories"
                                            className="inline-flex items-center text-gray-500 hover:text-gray-700 mr-4"
                                        >
                                            <ArrowLeft className="h-5 w-5 mr-1" />
                                            Back to Categories
                                        </Link>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">{currentCategory.name} Tasks</h1>
                                            <p className="text-gray-600">Tasks in the {currentCategory.name} category</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
                                        <p className="text-gray-600">Manage and track all your tasks</p>
                                    </div>
                                )}
                            </div>
                            <Link
                                to="/tasks/new"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                New Task
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                disabled={!!categoryId} // Disable if filtering by category from route
                                className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${categoryId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            >
                                <option value="">
                                    {categoryId ? `${currentCategory?.name} (filtered)` : 'All Categories'}
                                </option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* Tasks List */}
                    <div className="space-y-4">
                        {filteredTasks.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                                <div className="text-center">
                                    <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {tasks.length === 0
                                            ? "You haven't created any tasks yet."
                                            : "Try adjusting your filters or search terms."
                                        }
                                    </p>
                                    {tasks.length === 0 && (
                                        <Link
                                            to="/tasks/new"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create your first task
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ) : (
                            filteredTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onUpdate={handleTaskUpdate}
                                    onDelete={handleTaskDelete}
                                />
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Tasks;