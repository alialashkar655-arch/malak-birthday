import React, { useState, useEffect } from 'react';
import {
  X, Lock, Key, Settings, Image as ImageIcon, Film, BookOpen, CalendarHeart,
  Heart, Mail, Eye, Save, Trash2, Plus, ArrowUp, ArrowDown, Upload, RefreshCw,
  LogOut, CheckCircle2, Download, AlertCircle, Sparkles
} from 'lucide-react';
import {
  SiteSettings,
  TimelineEntry,
  GalleryItem,
  PhotobookData,
  LoveLettersData,
  DateInvitationData,
  DateQuestion,
  DateSubmission
} from '../types';
import { api } from '../services/api';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  timeline: TimelineEntry[];
  gallery: GalleryItem[];
  photobook: PhotobookData;
  loveLetters: LoveLettersData;
  dateInvitation: DateInvitationData;
  dateQuestions: DateQuestion[];
  compliments: string[];
  reasons: string[];
  onRefreshAll: () => Promise<void>;
  previewBirthdayMode: boolean;
  onToggleBirthdayPreview: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  settings,
  timeline,
  gallery,
  photobook,
  loveLetters,
  dateInvitation,
  dateQuestions,
  compliments,
  reasons,
  onRefreshAll,
  previewBirthdayMode,
  onToggleBirthdayPreview
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'general' | 'photos' | 'timeline' | 'photobook' | 'letters' | 'spotlight' | 'submissions' | 'backup'>('general');

  // Status feedback
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Editable local copies
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [localTimeline, setLocalTimeline] = useState<TimelineEntry[]>(timeline);
  const [localGallery, setLocalGallery] = useState<GalleryItem[]>(gallery);
  const [localPhotobook, setLocalPhotobook] = useState<PhotobookData>(photobook);
  const [localLetters, setLocalLetters] = useState<LoveLettersData>(loveLetters);
  const [localSubmissions, setLocalSubmissions] = useState<DateSubmission[]>([]);

  // Password change
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Check existing session token on modal open
  useEffect(() => {
    if (isOpen) {
      api.verifyAuth().then(valid => {
        setIsAuthenticated(valid);
        if (valid) {
          loadSubmissions();
        }
      });
    }
  }, [isOpen]);

  // Sync props to local state
  useEffect(() => {
    setLocalSettings(settings);
    setLocalTimeline(timeline);
    setLocalGallery(gallery);
    setLocalPhotobook(photobook);
    setLocalLetters(loveLetters);
  }, [settings, timeline, gallery, photobook, loveLetters]);

  const loadSubmissions = async () => {
    try {
      const subs = await api.getDateSubmissions();
      setLocalSubmissions(subs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await api.login(passwordInput);
      localStorage.setItem('malak_admin_token', res.token);
      setIsAuthenticated(true);
      setPasswordInput('');
      loadSubmissions();
    } catch (err: any) {
      setAuthError(err.message || 'Incorrect password (default is malak2026)');
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAuthenticated(false);
  };

  const showSaveSuccess = (msg = 'Changes saved successfully!') => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Upload helper for any field
  const handleFileUpload = async (file: File, onSuccess: (url: string) => void) => {
    setUploading(true);
    try {
      const res = await api.uploadFile(file);
      onSuccess(res.url);
      showSaveSuccess('File uploaded successfully!');
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    try {
      await api.updateSettings(localSettings);
      await onRefreshAll();
      showSaveSuccess('General settings saved!');
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    }
  };

  // Save Spotlight & Compliments
  const handleSaveSpotlight = async () => {
    try {
      await api.updateSettings({ favoritePhoto: localSettings.favoritePhoto });
      await onRefreshAll();
      showSaveSuccess('Spotlight photo & caption updated!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Timeline operations
  const handleAddTimeline = async () => {
    try {
      const created = await api.addTimelineEntry({
        title: 'New Sweet Memory',
        date: 'Date / Milestone',
        caption: 'Write what happened here...',
        mediaUrl: '/placeholders/timeline_1.jpg',
        mediaType: 'image',
        handwrittenNote: 'A sweet scribble ♡',
        sticker: 'heart'
      });
      setLocalTimeline(prev => [...prev, created]);
      await onRefreshAll();
      showSaveSuccess('New timeline entry added!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateTimelineItem = async (item: TimelineEntry) => {
    try {
      await api.updateTimelineEntry(item.id, item);
      await onRefreshAll();
      showSaveSuccess('Memory updated!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteTimelineItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    try {
      await api.deleteTimelineEntry(id);
      setLocalTimeline(prev => prev.filter(t => t.id !== id));
      await onRefreshAll();
      showSaveSuccess('Memory deleted');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Gallery operations
  const handleAddGalleryItem = async () => {
    try {
      const created = await api.addGalleryItem({
        title: 'Our New Moment',
        caption: 'Describe this photo or video...',
        date: 'Memory Date',
        category: 'Our Pictures',
        mediaUrl: '/placeholders/gallery_1.jpg',
        mediaType: 'image',
        isFavorite: false
      });
      setLocalGallery(prev => [...prev, created]);
      await onRefreshAll();
      showSaveSuccess('New gallery photo added!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateGalleryItem = async (item: GalleryItem) => {
    try {
      await api.updateGalleryItem(item.id, item);
      await onRefreshAll();
      showSaveSuccess('Gallery item updated!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('Delete this gallery item?')) return;
    try {
      await api.deleteGalleryItem(id);
      setLocalGallery(prev => prev.filter(g => g.id !== id));
      await onRefreshAll();
      showSaveSuccess('Gallery item deleted');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Photobook operations
  const handleSavePhotobook = async () => {
    try {
      await api.updatePhotobookInfo(localPhotobook);
      await onRefreshAll();
      showSaveSuccess('Keepsake Book details saved!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddPhotobookPage = async () => {
    try {
      const newPage = await api.addPhotobookPage({
        title: 'New Page Chapter',
        caption: 'Caption for this page...',
        date: 'Page Date',
        mediaUrl: '/placeholders/book_page1.jpg',
        handwrittenNote: 'Scribbled with love ♡',
        sticker: 'heart',
        layout: 'polaroid'
      });
      setLocalPhotobook(prev => ({
        ...prev,
        pages: [...prev.pages, newPage]
      }));
      await onRefreshAll();
      showSaveSuccess('New book page added!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdatePhotobookPage = async (page: any) => {
    try {
      await api.updatePhotobookPage(page.id, page);
      await onRefreshAll();
      showSaveSuccess('Page saved!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeletePhotobookPage = async (id: string) => {
    if (!confirm('Delete this scrapbook page?')) return;
    try {
      await api.deletePhotobookPage(id);
      setLocalPhotobook(prev => ({
        ...prev,
        pages: prev.pages.filter(p => p.id !== id)
      }));
      await onRefreshAll();
      showSaveSuccess('Page deleted');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Love Letters operations
  const handleSaveLetters = async () => {
    try {
      await api.updateLetters(localLetters);
      await onRefreshAll();
      showSaveSuccess('Love letters & Open When notes saved!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Submissions operations
  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Delete this submitted response?')) return;
    try {
      await api.deleteDateSubmission(id);
      setLocalSubmissions(prev => prev.filter(s => s.id !== id));
      showSaveSuccess('Submission deleted');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.changePassword(currPassword, newPassword);
      setCurrPassword('');
      setNewPassword('');
      showSaveSuccess('Password updated successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Backup & Reset
  const handleExportBackup = async () => {
    try {
      const data = await api.getBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `our-little-universe-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm('Reset everything to the default romantic template? Any custom photos or entries not backed up will be lost.')) return;
    try {
      await api.resetDefaults();
      await onRefreshAll();
      showSaveSuccess('Reset to defaults complete');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admin Content Management System"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fade-in"
    >
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-rose-200">
        {/* Header Bar */}
        <div className="bg-rose-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-800 flex items-center justify-center text-rose-200">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg leading-tight">Admin & Content CMS</h2>
              <p className="text-[11px] text-rose-300">Customize memories, photos, letters, and date plans</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                {/* Birthday Mode Preview Toggle */}
                <button
                  onClick={onToggleBirthdayPreview}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${
                    previewBirthdayMode ? 'bg-amber-500 text-white' : 'bg-rose-800 text-rose-200 hover:bg-rose-700'
                  }`}
                  title="Toggle Birthday Day celebration preview"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{previewBirthdayMode ? 'Birthday Preview: ON 🎂' : 'Test Birthday Mode 🎂'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-300 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-900 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-rose-900/60 hover:bg-rose-800 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {saveStatus && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-medium text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Modal Body */}
        {!isAuthenticated ? (
          /* LOGIN SCREEN */
          <div className="flex-1 flex items-center justify-center p-6 bg-rose-50/40">
            <div className="paper-texture p-8 sm:p-10 rounded-3xl border border-rose-200 shadow-xl max-w-md w-full text-center">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-rose-950 mb-2">
                Protected Admin Access
              </h3>
              <p className="text-rose-700/80 text-xs sm:text-sm mb-6">
                Enter your admin password to edit photos, memories, love letters, and see Malak's date responses.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    placeholder="Enter password (default: malak2026)"
                    className="w-full px-4 py-3 rounded-xl border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    autoFocus
                  />
                  {authError && (
                    <p className="text-red-500 text-xs mt-2 font-medium">{authError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-colors shadow-md shadow-rose-600/20"
                >
                  Unlock Admin Dashboard
                </button>
              </form>

              <div className="mt-6 text-[11px] text-rose-500 bg-rose-100/60 p-2.5 rounded-xl">
                Default password: <code>malak2026</code> (you can change it anytime inside).
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED TABS & CMS CONTENT */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-56 bg-rose-50/60 border-r border-rose-150 p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              {[
                { id: 'general', label: 'General & Hero', icon: Settings },
                { id: 'photos', label: 'Media Library', icon: ImageIcon },
                { id: 'spotlight', label: 'Favorite Photo', icon: Heart },
                { id: 'timeline', label: 'Our Story Timeline', icon: CalendarHeart },
                { id: 'photobook', label: 'Keepsake Book', icon: BookOpen },
                { id: 'letters', label: 'Love Letters', icon: Mail },
                { id: 'submissions', label: 'Date Submissions', icon: Sparkles },
                { id: 'backup', label: 'Backup & Security', icon: Key },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-rose-800 hover:bg-rose-100/70'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Tab Content Panel */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
              {/* TAB 1: GENERAL & HERO */}
              {activeTab === 'general' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-serif text-xl font-bold text-rose-950">General Site Configuration</h3>
                    <button
                      onClick={handleSaveSettings}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Settings</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-rose-900 mb-1">Recipient Name</label>
                      <input
                        type="text"
                        value={localSettings.recipientName}
                        onChange={e => setLocalSettings({ ...localSettings, recipientName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-rose-900 mb-1">Birthday Date (YYYY-MM-DD)</label>
                      <input
                        type="date"
                        value={localSettings.birthdayDate}
                        onChange={e => setLocalSettings({ ...localSettings, birthdayDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-rose-900 mb-1">Timezone</label>
                    <input
                      type="text"
                      value={localSettings.timezone}
                      onChange={e => setLocalSettings({ ...localSettings, timezone: e.target.value })}
                      placeholder="Africa/Cairo"
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-rose-900 mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={localSettings.heroTitle}
                      onChange={e => setLocalSettings({ ...localSettings, heroTitle: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-rose-900 mb-1">Hero Introduction</label>
                    <textarea
                      rows={3}
                      value={localSettings.heroIntro}
                      onChange={e => setLocalSettings({ ...localSettings, heroIntro: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-rose-900 mb-1">Hero Photo URL or Upload</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={localSettings.heroPhotoUrl}
                        onChange={e => setLocalSettings({ ...localSettings, heroPhotoUrl: e.target.value })}
                        className="flex-1 px-3 py-2 border rounded-xl text-sm"
                      />
                      <label className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-medium rounded-xl cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], url => {
                                setLocalSettings(prev => ({ ...prev, heroPhotoUrl: url }));
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-serif font-bold text-rose-950 text-base mb-3">Birthday Greeting Message (Nov 20)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-rose-900 mb-1">Birthday Heading</label>
                        <input
                          type="text"
                          value={localSettings.birthdayMessage.heading}
                          onChange={e => setLocalSettings({
                            ...localSettings,
                            birthdayMessage: { ...localSettings.birthdayMessage, heading: e.target.value }
                          })}
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-rose-900 mb-1">Birthday Letter</label>
                        <textarea
                          rows={4}
                          value={localSettings.birthdayMessage.letter}
                          onChange={e => setLocalSettings({
                            ...localSettings,
                            birthdayMessage: { ...localSettings.birthdayMessage, letter: e.target.value }
                          })}
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA LIBRARY */}
              {activeTab === 'photos' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-rose-950">Photos & Videos Gallery</h3>
                      <p className="text-xs text-rose-600">Upload pictures and videos to display in the Pinterest gallery</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload New Media</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={e => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], async url => {
                                const isVid = e.target.files![0].type.startsWith('video');
                                await api.addGalleryItem({
                                  title: 'Uploaded Moment',
                                  caption: 'Our special moment',
                                  category: isVid ? 'Videos' : 'Our Pictures',
                                  mediaUrl: url,
                                  mediaType: isVid ? 'video' : 'image',
                                  isFavorite: false
                                });
                                await onRefreshAll();
                              });
                            }
                          }}
                        />
                      </label>
                      <button
                        onClick={handleAddGalleryItem}
                        className="px-3 py-2 border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-medium rounded-xl flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add by URL</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {localGallery.map((item, idx) => (
                      <div key={item.id} className="p-4 rounded-2xl border border-rose-200 bg-rose-50/30 flex gap-4">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border shrink-0">
                          {item.mediaType === 'video' ? (
                            <video src={item.mediaUrl} className="w-full h-full object-cover" />
                          ) : (
                            <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={item.title}
                            onChange={e => {
                              const updated = { ...item, title: e.target.value };
                              setLocalGallery(prev => prev.map(g => g.id === item.id ? updated : g));
                            }}
                            onBlur={() => handleUpdateGalleryItem(item)}
                            className="w-full px-2 py-1 text-xs font-bold border rounded"
                            placeholder="Title"
                          />
                          <input
                            type="text"
                            value={item.caption}
                            onChange={e => {
                              const updated = { ...item, caption: e.target.value };
                              setLocalGallery(prev => prev.map(g => g.id === item.id ? updated : g));
                            }}
                            onBlur={() => handleUpdateGalleryItem(item)}
                            className="w-full px-2 py-1 text-xs border rounded"
                            placeholder="Caption"
                          />
                          <div className="flex items-center justify-between">
                            <select
                              value={item.category}
                              onChange={e => {
                                const updated = { ...item, category: e.target.value as any };
                                setLocalGallery(prev => prev.map(g => g.id === item.id ? updated : g));
                                handleUpdateGalleryItem(updated);
                              }}
                              className="text-xs px-2 py-1 border rounded"
                            >
                              <option>Our Pictures</option>
                              <option>Her Pictures</option>
                              <option>Dates</option>
                              <option>Random Moments</option>
                              <option>Videos</option>
                            </select>

                            <button
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SPOTLIGHT & COMPLIMENTS */}
              {activeTab === 'spotlight' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-serif text-xl font-bold text-rose-950">Spotlight Portrait of Malak</h3>
                    <button
                      onClick={handleSaveSpotlight}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Spotlight</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-rose-900 mb-1">Portrait Photo</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={localSettings.favoritePhoto.imageUrl}
                        onChange={e => setLocalSettings({
                          ...localSettings,
                          favoritePhoto: { ...localSettings.favoritePhoto, imageUrl: e.target.value }
                        })}
                        className="flex-1 px-3 py-2 border rounded-xl text-sm"
                      />
                      <label className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-medium rounded-xl cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], url => {
                                setLocalSettings(prev => ({
                                  ...prev,
                                  favoritePhoto: { ...prev.favoritePhoto, imageUrl: url }
                                }));
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-rose-900 mb-1">Why I Love This Picture (Caption)</label>
                    <textarea
                      rows={3}
                      value={localSettings.favoritePhoto.caption}
                      onChange={e => setLocalSettings({
                        ...localSettings,
                        favoritePhoto: { ...localSettings.favoritePhoto, caption: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-rose-900 mb-1">Handwritten Note</label>
                      <input
                        type="text"
                        value={localSettings.favoritePhoto.handwrittenNote}
                        onChange={e => setLocalSettings({
                          ...localSettings,
                          favoritePhoto: { ...localSettings.favoritePhoto, handwrittenNote: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-handwriting text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-rose-900 mb-1">Date & Location</label>
                      <input
                        type="text"
                        value={localSettings.favoritePhoto.location}
                        onChange={e => setLocalSettings({
                          ...localSettings,
                          favoritePhoto: { ...localSettings.favoritePhoto, location: e.target.value }
                        })}
                        placeholder="e.g. Sunset beach walk"
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: OUR STORY TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-serif text-xl font-bold text-rose-950">Our Story Memories Timeline</h3>
                    <button
                      onClick={handleAddTimeline}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Memory</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {localTimeline.map((item, idx) => (
                      <div key={item.id} className="p-4 rounded-2xl border border-rose-200 bg-white shadow-sm flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-32 aspect-video md:aspect-square rounded-xl overflow-hidden bg-rose-50 border shrink-0 relative group">
                          <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                          <label className="absolute inset-0 bg-black/40 text-white text-[10px] font-medium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span>Change Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                if (e.target.files?.[0]) {
                                  handleFileUpload(e.target.files[0], url => {
                                    const updated = { ...item, mediaUrl: url };
                                    setLocalTimeline(prev => prev.map(t => t.id === item.id ? updated : t));
                                    handleUpdateTimelineItem(updated);
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={item.title}
                              onChange={e => {
                                const updated = { ...item, title: e.target.value };
                                setLocalTimeline(prev => prev.map(t => t.id === item.id ? updated : t));
                              }}
                              onBlur={() => handleUpdateTimelineItem(item)}
                              className="flex-1 px-3 py-1.5 text-sm font-bold border rounded-lg"
                              placeholder="Title (e.g. When We First Met)"
                            />
                            <input
                              type="text"
                              value={item.date}
                              onChange={e => {
                                const updated = { ...item, date: e.target.value };
                                setLocalTimeline(prev => prev.map(t => t.id === item.id ? updated : t));
                              }}
                              onBlur={() => handleUpdateTimelineItem(item)}
                              className="w-36 px-2 py-1.5 text-xs border rounded-lg"
                              placeholder="Date or milestone"
                            />
                          </div>

                          <textarea
                            rows={2}
                            value={item.caption}
                            onChange={e => {
                              const updated = { ...item, caption: e.target.value };
                              setLocalTimeline(prev => prev.map(t => t.id === item.id ? updated : t));
                            }}
                            onBlur={() => handleUpdateTimelineItem(item)}
                            className="w-full px-3 py-1.5 text-xs border rounded-lg"
                            placeholder="Write your story caption..."
                          />

                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={item.handwrittenNote || ''}
                              onChange={e => {
                                const updated = { ...item, handwrittenNote: e.target.value };
                                setLocalTimeline(prev => prev.map(t => t.id === item.id ? updated : t));
                              }}
                              onBlur={() => handleUpdateTimelineItem(item)}
                              className="w-1/2 px-2 py-1 text-xs font-handwriting text-base border rounded-lg"
                              placeholder="Handwritten scribble ♡"
                            />

                            <button
                              onClick={() => handleDeleteTimelineItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PHOTOBOOK */}
              {activeTab === 'photobook' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-serif text-xl font-bold text-rose-950">A Little Book of Us Pages</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleAddPhotobookPage}
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-xl flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Page</span>
                      </button>
                      <button
                        onClick={handleSavePhotobook}
                        className="px-3 py-2 border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-medium rounded-xl"
                      >
                        Save Book Cover
                      </button>
                    </div>
                  </div>

                  <div className="bg-rose-50/50 p-4 rounded-2xl space-y-3">
                    <h4 className="font-serif font-bold text-sm text-rose-900">Cover & Secret Page</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-rose-800">Cover Title</label>
                        <input
                          type="text"
                          value={localPhotobook.coverTitle}
                          onChange={e => setLocalPhotobook({ ...localPhotobook, coverTitle: e.target.value })}
                          className="w-full px-2 py-1.5 text-xs border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-rose-800">Secret Quote (Page 1)</label>
                        <input
                          type="text"
                          value={localPhotobook.secretPageQuote}
                          onChange={e => setLocalPhotobook({ ...localPhotobook, secretPageQuote: e.target.value })}
                          className="w-full px-2 py-1.5 text-xs border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-sm text-rose-900">Pages ({localPhotobook.pages.length})</h4>
                    {localPhotobook.pages.map((page, idx) => (
                      <div key={page.id} className="p-4 rounded-2xl border bg-white flex flex-col md:flex-row gap-4 items-center">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-rose-50 shrink-0 relative group">
                          <img src={page.mediaUrl} alt={page.title} className="w-full h-full object-cover" />
                          <label className="absolute inset-0 bg-black/40 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                if (e.target.files?.[0]) {
                                  handleFileUpload(e.target.files[0], url => {
                                    const updated = { ...page, mediaUrl: url };
                                    setLocalPhotobook(prev => ({
                                      ...prev,
                                      pages: prev.pages.map(p => p.id === page.id ? updated : p)
                                    }));
                                    handleUpdatePhotobookPage(updated);
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={page.title}
                              onChange={e => {
                                const updated = { ...page, title: e.target.value };
                                setLocalPhotobook(prev => ({
                                  ...prev,
                                  pages: prev.pages.map(p => p.id === page.id ? updated : p)
                                }));
                              }}
                              onBlur={() => handleUpdatePhotobookPage(page)}
                              className="flex-1 px-2 py-1 text-xs font-bold border rounded"
                            />
                            <button
                              onClick={() => handleDeletePhotobookPage(page.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <textarea
                            rows={2}
                            value={page.caption}
                            onChange={e => {
                              const updated = { ...page, caption: e.target.value };
                              setLocalPhotobook(prev => ({
                                ...prev,
                                pages: prev.pages.map(p => p.id === page.id ? updated : p)
                              }));
                            }}
                            onBlur={() => handleUpdatePhotobookPage(page)}
                            className="w-full px-2 py-1 text-xs border rounded"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: LOVE LETTERS */}
              {activeTab === 'letters' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-serif text-xl font-bold text-rose-950">Love Letters & "Open When..."</h3>
                    <button
                      onClick={handleSaveLetters}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Letters</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-rose-900 mb-1">Main Letter Title</label>
                    <input
                      type="text"
                      value={localLetters.mainLetter.title}
                      onChange={e => setLocalLetters({
                        ...localLetters,
                        mainLetter: { ...localLetters.mainLetter, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-rose-900 mb-1">Main Letter Content</label>
                    <textarea
                      rows={6}
                      value={localLetters.mainLetter.content}
                      onChange={e => setLocalLetters({
                        ...localLetters,
                        mainLetter: { ...localLetters.mainLetter, content: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-rose-900 mb-1">Sign Off</label>
                    <input
                      type="text"
                      value={localLetters.mainLetter.signOff}
                      onChange={e => setLocalLetters({
                        ...localLetters,
                        mainLetter: { ...localLetters.mainLetter, signOff: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-handwriting text-lg"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-serif font-bold text-rose-950 text-base mb-3">Open When Letters</h4>
                    <div className="space-y-3">
                      {localLetters.openWhenNotes.map((note, idx) => (
                        <div key={note.id} className="p-3 border rounded-xl bg-rose-50/40">
                          <span className="text-xs font-bold text-rose-900 block mb-1">{note.title}</span>
                          <textarea
                            rows={2}
                            value={note.content}
                            onChange={e => {
                              const updatedNotes = [...localLetters.openWhenNotes];
                              updatedNotes[idx].content = e.target.value;
                              setLocalLetters({ ...localLetters, openWhenNotes: updatedNotes });
                            }}
                            className="w-full p-2 text-xs border rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: SUBMISSIONS */}
              {activeTab === 'submissions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-rose-950">Malak's Date Submissions</h3>
                      <p className="text-xs text-rose-600">Her dream date choices and submitted notes</p>
                    </div>
                    <button
                      onClick={loadSubmissions}
                      className="p-2 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50"
                      title="Refresh"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {localSubmissions.length === 0 ? (
                    <div className="text-center py-12 text-rose-500 text-sm">
                      No date plans submitted yet. When Malak completes the questionnaire, her choices will appear right here!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {localSubmissions.map(sub => (
                        <div key={sub.id} className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 shadow-sm relative">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-xs text-rose-500 font-medium">
                                Submitted on: {new Date(sub.submittedAt).toLocaleString()}
                              </span>
                              <h4 className="font-serif font-bold text-lg text-rose-950">
                                Invitation Answer: {sub.invitationAnswerLabel}
                              </h4>
                            </div>
                            <button
                              onClick={() => handleDeleteSubmission(sub.id)}
                              className="text-red-400 hover:text-red-700 p-1"
                              title="Delete submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-rose-900 mt-3 pt-3 border-t border-rose-200">
                            <div>
                              <strong>Date Types:</strong>
                              <p>{sub.dateType?.join(', ')}</p>
                            </div>
                            <div>
                              <strong>Flowers:</strong>
                              <p>{sub.flowerColor} ({sub.flowerType?.join(', ')})</p>
                            </div>
                            <div>
                              <strong>Food:</strong>
                              <p>{sub.foodChoice?.join(', ')} {sub.foodNotes ? `(${sub.foodNotes})` : ''}</p>
                            </div>
                            <div>
                              <strong>Date Timing:</strong>
                              <p>{sub.preferredDate} • {sub.preferredTimeOfDay}</p>
                            </div>
                            <div className="col-span-2">
                              <strong>Activities:</strong>
                              <p>{sub.activities?.join(', ')}</p>
                            </div>
                          </div>

                          {sub.personalNote && (
                            <div className="mt-3 p-3 bg-white rounded-xl border border-rose-200 text-xs italic text-rose-900">
                              <strong>Note for you:</strong> "{sub.personalNote}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: BACKUP & SECURITY */}
              {activeTab === 'backup' && (
                <div className="space-y-6 max-w-xl">
                  <div className="border-b pb-3">
                    <h3 className="font-serif text-xl font-bold text-rose-950">Backup, Restore & Password</h3>
                    <p className="text-xs text-rose-600">Download a full JSON backup of all memories and change your password</p>
                  </div>

                  {/* Change Password Form */}
                  <form onSubmit={handleChangePassword} className="space-y-3 p-4 bg-rose-50/50 rounded-2xl border">
                    <h4 className="font-serif font-bold text-sm text-rose-900">Change Admin Password</h4>
                    <div>
                      <label className="text-xs text-rose-800">Current Password</label>
                      <input
                        type="password"
                        value={currPassword}
                        onChange={e => setCurrPassword(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-rose-800">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border rounded-lg"
                        required
                        minLength={6}
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-xl"
                    >
                      Update Password
                    </button>
                  </form>

                  {/* Backup and Restore */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-serif font-bold text-sm text-rose-900">Data Management</h4>
                    <div className="flex gap-3">
                      <button
                        onClick={handleExportBackup}
                        className="flex-1 py-2.5 px-4 bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-rose-200"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Full Site JSON Backup</span>
                      </button>
                    </div>

                    <div className="pt-4 border-t">
                      <button
                        onClick={handleResetDefaults}
                        className="text-xs text-red-600 hover:text-red-800 underline font-medium"
                      >
                        Reset everything to initial template seeds
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
