'use client';

import React, { useState } from 'react';
import { X, Send, Link as LinkIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { Project, Deliverable } from './mockData';

interface SubmitDeliverableModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSubmit: (newDeliverable: Deliverable) => void;
}

export const SubmitDeliverableModal: React.FC<SubmitDeliverableModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSubmit,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

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
        fileSize: '450 MB',
        status: 'Pending Review',
        notes: notes.trim() || 'Uploaded via quick action modal.',
      };

      onSubmit(newDeliv);
      setIsSubmitting(false);
      setIsDone(true);

      setTimeout(() => {
        setIsDone(false);
        setTitle('');
        setLinkUrl('');
        setNotes('');
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-2xl bg-gray-900/95 backdrop-blur-2xl border border-gray-800 shadow-2xl p-6 text-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Submit Project Deliverable
              </h3>
              <p className="text-xs text-gray-400">Direct upload or link handoff</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white bg-gray-950 border border-gray-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isDone ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Deliverable Logged!</h4>
            <p className="text-xs text-gray-400">
              Notification sent to project leads for verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Target Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.clientName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Asset Name / Version
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Apex_UI_VFX_Sequence_Final.mov"
                required
                className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                File / Repository URL
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white font-mono placeholder-gray-600 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Key updates or instructions for review..."
                className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-xs text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-gray-950 font-bold text-xs hover:from-cyan-300 shadow-md shadow-cyan-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Uploading...' : 'Submit Link'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
