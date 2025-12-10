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
    <div className="h-1/2 flex flex-col border-b border-reddit-border">
      {/* Header */}
      <div className="p-4 border-b border-reddit-border bg-reddit-card/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-reddit-orange" />
            <h3 className="text-sm font-semibold text-white">My Notes</h3>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={!notes.trim()}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
              ${notes.trim()
                ? 'bg-reddit-orange hover:bg-reddit-orange/90 text-white'
                : 'bg-reddit-cardHover text-reddit-placeholder cursor-not-allowed'
              }
            `}
            title="Export as PDF"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>

        {/* Save status */}
        <div className="flex items-center gap-2 text-xs">
          {isSaving ? (
            <span className="text-reddit-orange flex items-center gap-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Save className="w-3 h-3" />
              </motion.div>
              Saving...
            </span>
          ) : lastSaved ? (
            <span className="text-green-400 flex items-center gap-1">
              <Save className="w-3 h-3" />
              Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          ) : (
            <span className="text-reddit-placeholder">Auto-save enabled</span>
          )}
        </div>
      </div>

      {/* Notes textarea */}
      <div className="flex-1 p-4 overflow-hidden">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Take notes as you learn... Your notes are saved automatically."
          className="w-full h-full bg-transparent border-none resize-none text-sm text-white placeholder-reddit-placeholder focus:outline-none"
          style={{ fontFamily: 'inherit' }}
        />
      </div>

      {/* Character count */}
      <div className="px-4 py-2 border-t border-reddit-border bg-reddit-card/30">
        <p className="text-xs text-reddit-placeholder text-right">
          {notes.length} characters
        </p>
      </div>
    </div>
  );
};

export default NotesPanel;
