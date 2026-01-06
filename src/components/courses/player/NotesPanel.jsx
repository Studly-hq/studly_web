import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Save, FileText } from 'lucide-react';
import { useCoursePlayer } from '../../../context/CoursePlayerContext';
import jsPDF from 'jspdf';
import { toast } from 'react-hot-toast';

const NotesPanel = ({ topicId, topicTitle }) => {
  const { saveNotes, getNotes } = useCoursePlayer();
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Load notes on mount
  useEffect(() => {
    const savedNotes = getNotes(topicId);
    setNotes(savedNotes);
  }, [topicId, getNotes]);

  // Auto-save notes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notes !== getNotes(topicId)) {
        handleSaveNotes();
      }
    }, 1000); // Save after 1 second of no typing

    return () => clearTimeout(timer);
  }, [notes]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveNotes = () => {
    setIsSaving(true);
    saveNotes(topicId, notes);
    setLastSaved(new Date());

    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const handleExportPDF = () => {
    if (!notes.trim()) {
      toast.error('No notes to export');
      return;
    }

    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(topicTitle, 20, 20);

      // Add date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Exported on ${new Date().toLocaleDateString()}`, 20, 30);

      // Add divider
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);

      // Add notes content
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(notes, 170);
      doc.text(splitText, 20, 45);

      // Save PDF
      doc.save(`${topicTitle.replace(/\s+/g, '_')}_notes.pdf`);

      toast.success('Notes exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export notes');
    }
  };

  return (
    <div className="h-1/2 flex flex-col border-b border-white/5">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-reddit-orange/10">
            <FileText className="w-3.5 h-3.5 text-reddit-orange" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-reddit-textMuted">My Notes</h3>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={!notes.trim()}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
            ${notes.trim()
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-white/5 text-reddit-textMuted/50 cursor-not-allowed'
            }
          `}
          title="Export as PDF"
        >
          <Download className="w-3 h-3" />
          <span>Export</span>
        </button>
      </div>

      {/* Notes textarea */}
      <div className="flex-1 relative group">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Start typing your notes here..."
          className="w-full h-full bg-transparent border border-transparent resize-none text-sm text-white/90 placeholder-white/20 focus:border-reddit-orange focus:ring-0 focus:outline-none p-5 leading-relaxed transition-colors"
          style={{ fontFamily: 'inherit' }}
        />

        {/* Save indicator overlay */}
        <div className="absolute bottom-4 right-4 text-xs pointer-events-none">
          {isSaving ? (
            <span className="text-reddit-orange/80 flex items-center gap-1.5 bg-reddit-dark/80 backdrop-blur px-2 py-1 rounded-md border border-reddit-orange/20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Save className="w-3 h-3" />
              </motion.div>
              Saving...
            </span>
          ) : lastSaved ? (
            <span className="text-emerald-500/80 flex items-center gap-1.5 bg-reddit-dark/80 backdrop-blur px-2 py-1 rounded-md border border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Save className="w-3 h-3" />
              Saved
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
