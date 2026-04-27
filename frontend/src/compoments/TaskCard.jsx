import { useState } from 'react';
import { CheckSquare, Square, Edit, Trash2, Calendar, Tag } from 'lucide-react';
import { tasksAPI } from '../services/api';

const TaskCard = ({ task, onUpdate, onDelete }) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleToggleComplete = async () => {
        setIsUpdating(true);
        try {
            const updatedTask = { ...task, completed: !task.completed };
            await tasksAPI.update(task.id, updatedTask);
            onUpdate(updatedTask);
        } catch (error) {
            console.error('Error updating task:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await tasksAPI.delete(task.id);
                onDelete(task.id);
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className={`card-subtle p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${task.completed ? 'opacity-75 bg-gradient-to-r from-green-50 to-green-100' : 'bg-white'
            }`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                    <button
                        onClick={handleToggleComplete}
                        disabled={isUpdating}
                        className={`mt-1 p-1 rounded-full transition-all duration-200 ${task.completed
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                            }`}
                    >
                        {task.completed ? (
                            <CheckSquare className="h-5 w-5" />
                        ) : (
                            <Square className="h-5 w-5" />
                        )}
                    </button>

                    <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-2 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}>
                            {task.title}
                        </h3>

                        {task.description && (
                            <p className={`text-sm mb-3 leading-relaxed ${task.completed ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                {task.description}
                            </p>
                        )}

                        <div className="flex items-center flex-wrap gap-3">
                            {task.due_date && (
                                <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {formatDate(task.due_date)}
                                </div>
                            )}

                            {task.priority && (
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${task.priority.toLowerCase() === 'high' ? 'priority-high' :
                                        task.priority.toLowerCase() === 'medium' ? 'priority-medium' : 'priority-low'
                                    }`}>
                                    {task.priority}
                                </span>
                            )}

                            {task.category && (
                                <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                                    <Tag className="h-4 w-4 mr-2 text-blue-500" />
                                    {task.category.name}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                    <button
                        onClick={() => {/* TODO: Implement edit */ }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit task"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete task"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;