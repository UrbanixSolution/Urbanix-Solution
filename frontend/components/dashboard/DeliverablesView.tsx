'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  FileCheck,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Send,
  Sparkles
} from 'lucide-react';
import { Deliverable, Project } from './mockData';

interface DeliverablesViewProps {
  deliverables: Deliverable[];
  projects: Project[];
  onSubmitDeliverable: (newDeliverable: Deliverable) => void;
}

export const DeliverablesView: React.FC<DeliverablesViewProps> = ({
  deliverables,
  projects,
  onSubmitDeliverable,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !linkUrl.trim()) return;

    setIsSubmitting(true);
    const proj = projects.find((p) => p.id === selectedProjectId) || projects[0];

    setTimeout(() => {
      const newDeliv: Deliverable = {
        id: `del-${Date.now()}`,
        projectId: proj.id,
        projectName: proj.title,
        title: title.trim(),
        linkUrl: linkUrl.trim(),
        submittedAt: 'Just Now',
        fileSize: '500 MB',
        status: 'Pending Review',
        notes: notes.trim() || 'Uploaded via internal portal.',
      };

      onSubmitDeliverable(newDeliv);
      setIsSubmitting(false);
      setTitle('');
      setLinkUrl('');
      setNotes('');
      setSuccessMsg('Deliverable link successfully registered and logged for client review!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <UploadCloud className="w-6 h-6 text-cyan-400" />
          <span>Upload Project Deliverables</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Submit completed motion renders, design components, or code repository URLs to agency leads & clients
        </p>
      </div>

      {/* Submission Form Card */}
      <div className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/90 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-800">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            New Deliverable Submission
          </h2>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Project */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Target Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.clientName})
                  </option>
                ))}
              </select>
            </div>

            {/* Asset Title / File Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Asset Title / File Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Apex_Promo_4K_Cut_v3.mp4"
                required
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Cloud Asset / Repo Link URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Cloud Asset URL (Google Drive / Frame.io / Figma / GitHub)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://frame.io/player/..."
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Release Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Release Notes / Review Instructions
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Specify color profile, sound overlay updates, or pull request branch..."
              className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-gray-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
            >
              {isSubmitting ? (
                <span>Registering Link...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Deliverable For Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Submission Log Table */}
      <div className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/90 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-cyan-400" />
          <span>Recent Deliverables History Log</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Asset Title</th>
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3">Submitted At</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium">
              {deliverables.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UploadCloud className="w-6 h-6 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-400">No deliverables submitted yet.</span>
                      <span className="text-xs text-gray-500">Use the form above to upload your project deliverable link.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                deliverables.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-950/40 transition-colors">
                    <td className="py-3 px-3 text-white font-bold max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3 px-3 text-gray-300 font-mono text-[11px]">
                      {item.projectName}
                    </td>
                    <td className="py-3 px-3 text-gray-400 font-mono text-[11px]">
                      {item.submittedAt}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold ${
                          item.status === 'Approved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'Pending Review'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-cyan-400 text-[11px] transition-colors"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
