import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    FolderOpen,
    Plus,
    Settings
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'All Tasks', href: '/tasks', icon: CheckSquare },
        { name: 'Categories', href: '/categories', icon: FolderOpen },
    ];

    const isActive = (href) => {
        return location.pathname === href;
    };

    return (
        <div className="bg-white shadow-sm border-r border-gray-200 w-64">
            <div className="p-6">
                <nav className="space-y-2">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(item.href)
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Quick Actions
                    </h3>
                    <div className="mt-2 space-y-1">
                        <Link
                            to="/tasks/new"
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                        >
                            <Plus className="h-4 w-4 mr-3" />
                            New Task
                        </Link>
                        <Link
                            to="/categories/new"
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                        >
                            <Plus className="h-4 w-4 mr-3" />
                            New Category
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;