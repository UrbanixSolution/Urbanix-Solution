'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Filter,
  Clock,
  User,
  ExternalLink,
  ChevronRight,
  Plus,
  Sparkles
} from 'lucide-react';
import { Project } from './mockData';

interface ProjectsViewProps {
  projects: Project[];
  onOpenSubmitDeliverableModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onOpenSubmitDeliverableModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-cyan-400" />
            <span>My Assigned Projects</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Overview of active agency client contracts, progress benchmarks, and deadlines
          </p>
        </div>

        <button
          onClick={onOpenSubmitDeliverableModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-gray-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Project Deliverable</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by project name or client..."
            className="w-full pl-9 pr-3 py-2 bg-gray-950/90 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex items-center gap-1 bg-gray-950/90 p-1 rounded-xl border border-gray-800">
            {['all', 'In Progress', 'Under Review', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  statusFilter === status
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/90 hover:border-cyan-500/40 p-6 shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                    {project.category}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-wide mt-2">
                    {project.title}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border ${
                    project.status === 'In Progress'
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                      : project.status === 'Under Review'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                <span>Client: <strong className="text-gray-200">{project.clientName}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-cyan-400">
                  <Clock className="w-3 h-3" /> Due {project.deadline}
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-3 p-2.5 rounded-xl bg-gray-950/60 border border-gray-800">
                Deliverable Target: <span className="text-gray-200 font-medium">{project.deliverableType}</span>
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-gray-800/80">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-400">Milestone Progress</span>
                  <span className="text-cyan-400 font-mono">{project.progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-950 overflow-hidden border border-gray-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-500"
                    style={{ width: `${project.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{project.teamMembers.join(', ')}</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">
                  Est. Payout: ₹{project.payoutEst.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
