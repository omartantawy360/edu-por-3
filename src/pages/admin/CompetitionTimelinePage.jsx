import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Plus, Trophy, Calendar, Users, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import CompetitionTimeline from '../../components/ui/CompetitionTimeline';
import AddPostModal from '../../components/ui/AddPostModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const CompetitionTimelinePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { competitions, getCompetitionPosts, addPost, editPost, deletePost } = useApp();

  const competition = competitions.find(c => c.id === id);
  const posts = getCompetitionPosts(id);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, postId: null });

  if (!competition) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-400">
        <Trophy size={40} className="mx-auto mb-3 opacity-30" />
        <p className="font-medium">Competition not found.</p>
        <button onClick={() => navigate('/admin')} className="mt-4 text-violet-600 hover:underline text-sm">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const handleSave = (postData) => {
    if (editingPost) {
      editPost(id, editingPost.id, postData);
    } else {
      addPost(id, postData);
    }
    setEditingPost(null);
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setModalOpen(true);
  };

  const handleDeleteConfirm = (postId) => {
    setConfirmDelete({ open: true, postId });
  };

  const doDelete = () => {
    deletePost(id, confirmDelete.postId);
    setConfirmDelete({ open: false, postId: null });
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin')}
          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Admin · Competition Timeline</p>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">{competition.name}</h1>
        </div>
      </div>

      {/* Competition meta card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 text-white p-6 shadow-xl shadow-violet-500/20">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-violet-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} /> {competition.type} Competition
            </div>
            <h2 className="text-2xl font-bold">{competition.name}</h2>
            <p className="text-violet-200 text-sm max-w-md">{competition.description}</p>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-violet-200">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} /> {competition.startDate} → {competition.endDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={12} /> Max {competition.maxParticipants} participants
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-white/20 border-white/30 text-white font-bold">
              {posts.length} Post{posts.length !== 1 ? 's' : ''}
            </Badge>
            <Button
              onClick={() => { setEditingPost(null); setModalOpen(true); }}
              className="bg-white text-violet-700 hover:bg-violet-50 font-bold shadow-lg gap-2 shrink-0"
            >
              <Plus size={16} /> Add Post
            </Button>
          </div>
        </div>
      </div>

      {/* Stage pills */}
      {competition.stages && competition.stages.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stages:</span>
          {competition.stages.map((stage, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold border border-violet-100 dark:border-violet-800"
            >
              {stage}
            </span>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Timeline Feed</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => { setEditingPost(null); setModalOpen(true); }}
            className="gap-2"
          >
            <Plus size={14} /> Add Post
          </Button>
        </div>

        <CompetitionTimeline
          posts={posts}
          competitionId={id}
          isAdmin={true}
          onEdit={handleEditClick}
          onDelete={handleDeleteConfirm}
          emptyMessage="No posts yet. Click 'Add Post' to start building the timeline."
        />
      </div>

      {/* Add / Edit Modal */}
      <AddPostModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        initialData={editingPost}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, postId: null })}
        onConfirm={doDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default CompetitionTimelinePage;
