'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
  ArrowRight,
  MoreVertical
} from 'lucide-react';
import { TaskItem } from './mockData';

interface TaskBoardViewProps {
  initialTasks: TaskItem[];
}

export const TaskBoardView: React.FC<TaskBoardViewProps> = ({ initialTasks }) => {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('Apex Financial Platform');

  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const columns: { id: TaskItem['status']; label: string; color: string }[] = [
    { id: 'todo', label: 'To Do Queue', color: 'border-cyan-500/40 text-cyan-400' },
    { id: 'in_progress', label: 'In Progress', color: 'border-blue-500/40 text-blue-400' },
    { id: 'in_review', label: 'Under Review', color: 'border-amber-500/40 text-amber-400' },
    { id: 'done', label: 'Completed', color: 'border-emerald-500/40 text-emerald-400' },
  ];


  const moveTaskStatus = (taskId: string, nextStatus: TaskItem['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: `tsk-${Date.now()}`,
      title: newTaskTitle.trim(),
      projectId: 'prj-101',
      projectName: newTaskProject,
      priority: 'High',
      status: 'todo',
      dueDate: '04 Aug 2026',
      estimatedHours: 4,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-cyan-400" />
            <span>Task Board & Workflow Kanban</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage your daily tasks, motion edit queues, component code reviews, and deliverables
          </p>
        </div>

        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-gray-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Quick Add Task Modal Inline Banner */}
      {showAddTask && (
        <form
          onSubmit={handleCreateTask}
          className="p-4 rounded-2xl bg-gray-900/90 border border-cyan-500/40 space-y-3 animate-in fade-in duration-200"
        >
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Quick Add Work Item
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Task Title (e.g. Export 4K master audio track)"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
              className="sm:col-span-2 px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <select
              value={newTaskProject}
              onChange={(e) => setNewTaskProject(e.target.value)}
              className="px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
            >
              <option value="Apex Financial Platform">Apex Financial Platform</option>
              <option value="Nexus AI SaaS Portal">Nexus AI SaaS Portal</option>
              <option value="Veloce Motors Campaign">Veloce Motors Campaign</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddTask(false)}
              className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-400 text-xs font-bold text-gray-950 hover:bg-cyan-300"
            >
              Create Task
            </button>
          </div>
        </form>
      )}

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);

          return (
            <div
              key={column.id}
              className="rounded-2xl bg-gray-900/70 backdrop-blur-xl border border-gray-800/80 p-4 flex flex-col h-[620px]"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
                <span className={`text-xs font-bold uppercase tracking-wider ${column.color}`}>
                  {column.label}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                  {columnTasks.length}
                </span>
              </div>

              {/* Column Task Cards */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {columnTasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border border-dashed border-gray-800 rounded-xl text-xs text-gray-600">
                    No tasks in queue
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 hover:border-cyan-500/40 transition-all space-y-3 group shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono font-semibold text-cyan-400/90 truncate">
                          {task.projectName}
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold shrink-0 ${
                            task.priority === 'Urgent'
                              ? 'bg-red-950 text-red-400 border border-red-800/60'
                              : task.priority === 'High'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                              : 'bg-gray-900 text-gray-400 border border-gray-800'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                        {task.title}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pt-2 border-t border-gray-900">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {task.dueDate}
                        </span>
                        <span>{task.estimatedHours}h est</span>
                      </div>

                      {/* Status Transition buttons */}
                      <div className="flex items-center justify-end gap-1 pt-1">
                        {column.id !== 'todo' && (
                          <button
                            onClick={() =>
                              moveTaskStatus(
                                task.id,
                                column.id === 'in_progress'
                                  ? 'todo'
                                  : column.id === 'in_review'
                                  ? 'in_progress'
                                  : 'in_review'
                              )
                            }
                            className="text-[10px] text-gray-500 hover:text-gray-300 px-2 py-0.5 rounded bg-gray-900 border border-gray-800"
                          >
                            ← Back
                          </button>
                        )}

                        {column.id !== 'done' && (
                          <button
                            onClick={() =>
                              moveTaskStatus(
                                task.id,
                                column.id === 'todo'
                                  ? 'in_progress'
                                  : column.id === 'in_progress'
                                  ? 'in_review'
                                  : 'done'
                              )
                            }
                            className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 flex items-center gap-1"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
