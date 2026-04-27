import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { tasksAPI, categoriesAPI } from '../services/api';
import Header from '../compoments/Header';
import Sidebar from '../compoments/Sidebar';
import TaskCard from '../compoments/TaskCard';
import {
    CheckSquare,
    Clock,
    AlertTriangle,
    FolderOpen,
    Plus,
    TrendingUp
} from 'lucide-react';

const Dashboard = () => {
    const location = useLocation();
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, [location.pathname]); // Re-run when location changes

    const loadDashboardData = async () => {
        try {
            const [tasksResponse, categoriesResponse] = await Promise.all([
                tasksAPI.getAll(),
                categoriesAPI.getAll()
            ]);

            const tasksData = tasksResponse.data;
            setTasks(tasksData);
            setCategories(categoriesResponse.data);

            // Calculate stats
            const now = new Date();
            const stats = {
                total: tasksData.length,
                completed: tasksData.filter(task => task.completed).length,
                pending: tasksData.filter(task => !task.completed).length,
                overdue: tasksData.filter(task =>
                    !task.completed &&
                    task.due_date &&
                    new Date(task.due_date) < now
                ).length
            };
            setStats(stats);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks(tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
        ));
        // Recalculate stats
        const newStats = {
            total: tasks.length,
            completed: tasks.filter(task => task.id === updatedTask.id ? updatedTask.completed : task.completed).length,
            pending: tasks.filter(task => task.id === updatedTask.id ? !updatedTask.completed : !task.completed).length,
            overdue: tasks.filter(task => {
                if (task.id === updatedTask.id) {
                    return !updatedTask.completed && updatedTask.due_date && new Date(updatedTask.due_date) < new Date();
                }
                return !task.completed && task.due_date && new Date(task.due_date) < new Date();
            }).length
        };
        setStats(newStats);
    };

    const handleTaskDelete = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
        setStats(prev => ({
            ...prev,
            total: prev.total - 1,
            completed: prev.completed - (tasks.find(t => t.id === taskId)?.completed ? 1 : 0),
            pending: prev.pending - (tasks.find(t => t.id === taskId)?.completed ? 0 : 1),
        }));
    };

    const recentTasks = tasks.slice(0, 5);

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
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Welcome back! Here's an overview of your tasks.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="card-elevated p-6 animate-fade-in">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                    <CheckSquare className="h-7 w-7 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Tasks</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="card-elevated p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                                    <TrendingUp className="h-7 w-7 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completed</p>
                                    <p className="text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
                                </div>
                            </div>
                        </div>

                        <div className="card-elevated p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                                    <Clock className="h-7 w-7 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pending</p>
                                    <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                                </div>
                            </div>
                        </div>

                        <div className="card-elevated p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                                    <AlertTriangle className="h-7 w-7 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Overdue</p>
                                    <p className="text-3xl font-bold text-red-600 mt-1">{stats.overdue}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Tasks */}
                        <div className="card-elevated overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Recent Tasks</h2>
                                    <Link
                                        to="/tasks/new"
                                        className="inline-flex items-center px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium text-white transition-all duration-200"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        New Task
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                {recentTasks.length === 0 ? (
                                    <div className="text-center py-8">
                                        <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 mb-4">No tasks yet. Create your first task!</p>
                                        <Link
                                            to="/tasks/new"
                                            className="btn-gradient inline-flex items-center"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create your first task
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {recentTasks.map(task => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onUpdate={handleTaskUpdate}
                                                onDelete={handleTaskDelete}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Categories */}
                        <div className="card-elevated overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Categories</h2>
                                    <Link
                                        to="/categories/new"
                                        className="inline-flex items-center px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium text-white transition-all duration-200"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        New Category
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                {categories.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 mb-4">No categories yet. Create your first category!</p>
                                        <Link
                                            to="/categories/new"
                                            className="btn-gradient inline-flex items-center"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create category
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {categories.map(category => (
                                            <div key={category.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-3">
                                                        <FolderOpen className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-semibold text-gray-900">{category.name}</span>
                                                        <p className="text-xs text-gray-500">{category.tasks_count || 0} tasks</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {category.tasks_count || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;