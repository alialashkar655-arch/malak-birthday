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

const RAW_API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const API_BASE = RAW_API_URL ? `${RAW_API_URL}/api` : '/api';
export const BACKEND_URL = RAW_API_URL;

export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (BACKEND_URL && url.startsWith('/uploads')) {
    return `${BACKEND_URL}${url}`;
  }
  return url;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('malak_admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Authentication
  async login(password: string): Promise<{ token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async verifyAuth(): Promise<boolean> {
    const token = localStorage.getItem('malak_admin_token');
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      return Boolean(data.valid);
    } catch {
      return false;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } finally {
      localStorage.removeItem('malak_admin_token');
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Password update failed');
    }
  },

  // Media Upload
  async uploadFile(file: File): Promise<{ url: string; type: string }> {
    const token = localStorage.getItem('malak_admin_token');
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'File upload failed');
    }
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Timeline
  async getTimeline(): Promise<TimelineEntry[]> {
    const res = await fetch(`${API_BASE}/timeline`);
    if (!res.ok) throw new Error('Failed to fetch timeline');
    return res.json();
  },

  async addTimelineEntry(entry: Partial<TimelineEntry>): Promise<TimelineEntry> {
    const res = await fetch(`${API_BASE}/timeline`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry)
    });
    if (!res.ok) throw new Error('Failed to add timeline entry');
    return res.json();
  },

  async updateTimelineEntry(id: string, entry: Partial<TimelineEntry>): Promise<TimelineEntry> {
    const res = await fetch(`${API_BASE}/timeline/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry)
    });
    if (!res.ok) throw new Error('Failed to update timeline entry');
    return res.json();
  },

  async deleteTimelineEntry(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/timeline/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete timeline entry');
  },

  async reorderTimeline(orderedIds: string[]): Promise<TimelineEntry[]> {
    const res = await fetch(`${API_BASE}/timeline/reorder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderedIds })
    });
    if (!res.ok) throw new Error('Failed to reorder timeline');
    return res.json();
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    const res = await fetch(`${API_BASE}/gallery`);
    if (!res.ok) throw new Error('Failed to fetch gallery');
    return res.json();
  },

  async addGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to add gallery item');
    return res.json();
  },

  async updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to update gallery item');
    return res.json();
  },

  async deleteGalleryItem(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete gallery item');
  },

  async toggleFavorite(id: string): Promise<{ isFavorite: boolean }> {
    const res = await fetch(`${API_BASE}/gallery/${id}/favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to toggle favorite');
    return res.json();
  },

  // Photobook
  async getPhotobook(): Promise<PhotobookData> {
    const res = await fetch(`${API_BASE}/photobook`);
    if (!res.ok) throw new Error('Failed to fetch photobook');
    return res.json();
  },

  async updatePhotobookInfo(info: Partial<PhotobookData>): Promise<PhotobookData> {
    const res = await fetch(`${API_BASE}/photobook/info`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(info)
    });
    if (!res.ok) throw new Error('Failed to update photobook');
    return res.json();
  },

  async addPhotobookPage(page: any): Promise<any> {
    const res = await fetch(`${API_BASE}/photobook/pages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(page)
    });
    if (!res.ok) throw new Error('Failed to add photobook page');
    return res.json();
  },

  async updatePhotobookPage(id: string, page: any): Promise<any> {
    const res = await fetch(`${API_BASE}/photobook/pages/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(page)
    });
    if (!res.ok) throw new Error('Failed to update page');
    return res.json();
  },

  async deletePhotobookPage(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/photobook/pages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete page');
  },

  // Compliments & Reasons
  async getCompliments(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/compliments`);
    if (!res.ok) throw new Error('Failed to fetch compliments');
    return res.json();
  },

  async updateCompliments(compliments: string[]): Promise<string[]> {
    const res = await fetch(`${API_BASE}/compliments`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ compliments })
    });
    if (!res.ok) throw new Error('Failed to update compliments');
    return res.json();
  },

  async getReasons(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/reasons`);
    if (!res.ok) throw new Error('Failed to fetch reasons');
    return res.json();
  },

  async updateReasons(reasons: string[]): Promise<string[]> {
    const res = await fetch(`${API_BASE}/reasons`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reasons })
    });
    if (!res.ok) throw new Error('Failed to update reasons');
    return res.json();
  },

  // Love Letters
  async getLetters(): Promise<LoveLettersData> {
    const res = await fetch(`${API_BASE}/letters`);
    if (!res.ok) throw new Error('Failed to fetch love letters');
    return res.json();
  },

  async updateLetters(data: Partial<LoveLettersData>): Promise<LoveLettersData> {
    const res = await fetch(`${API_BASE}/letters`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update letters');
    return res.json();
  },

  // Date Invitation & Questions
  async getDateInvitation(): Promise<DateInvitationData> {
    const res = await fetch(`${API_BASE}/date-invitation`);
    if (!res.ok) throw new Error('Failed to fetch date invitation');
    return res.json();
  },

  async updateDateInvitation(data: Partial<DateInvitationData>): Promise<DateInvitationData> {
    const res = await fetch(`${API_BASE}/date-invitation`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update invitation');
    return res.json();
  },

  async getDateQuestions(): Promise<DateQuestion[]> {
    const res = await fetch(`${API_BASE}/date-questions`);
    if (!res.ok) throw new Error('Failed to fetch date questions');
    return res.json();
  },

  async updateDateQuestions(questions: DateQuestion[]): Promise<DateQuestion[]> {
    const res = await fetch(`${API_BASE}/date-questions`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ questions })
    });
    if (!res.ok) throw new Error('Failed to update questions');
    return res.json();
  },

  // Date Submissions
  async submitDatePlan(plan: Partial<DateSubmission>): Promise<{ success: boolean; message: string }> {
    const localSubmission: DateSubmission = {
      id: `local-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      invitationAnswerId: String(plan.invitationAnswerId || 'yes'),
      invitationAnswerLabel: String(plan.invitationAnswerLabel || 'Yes 💗'),
      dateType: Array.isArray(plan.dateType) ? plan.dateType : [String(plan.dateType || '')],
      flowerColor: String(plan.flowerColor || 'Red roses'),
      flowerType: Array.isArray(plan.flowerType) ? plan.flowerType : [String(plan.flowerType || '')],
      foodChoice: Array.isArray(plan.foodChoice) ? plan.foodChoice : [String(plan.foodChoice || '')],
      foodNotes: String(plan.foodNotes || ''),
      preferredDate: String(plan.preferredDate || ''),
      preferredTimeOfDay: String(plan.preferredTimeOfDay || ''),
      activities: Array.isArray(plan.activities) ? plan.activities : [],
      personalNote: String(plan.personalNote || ''),
      status: 'new'
    };

    // Always save local backup in case server is unavailable
    try {
      const stored = JSON.parse(localStorage.getItem('malak_local_date_submissions') || '[]');
      stored.unshift(localSubmission);
      localStorage.setItem('malak_local_date_submissions', JSON.stringify(stored));
    } catch {
      // ignore localStorage quota error
    }

    try {
      const res = await fetch(`${API_BASE}/date-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });
      if (!res.ok) throw new Error('Failed to submit date plan to server');
      return res.json();
    } catch (err) {
      console.warn('Backend server unavailable, saved date submission locally:', err);
      return {
        success: true,
        message: "Your wish list is officially in my hands. Now let me make our date special. ♡"
      };
    }
  },

  async getDateSubmissions(): Promise<DateSubmission[]> {
    let serverSubmissions: DateSubmission[] = [];
    try {
      const res = await fetch(`${API_BASE}/date-submissions`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        serverSubmissions = await res.json();
      }
    } catch (err) {
      console.warn('Could not fetch server submissions:', err);
    }

    let localSubmissions: DateSubmission[] = [];
    try {
      localSubmissions = JSON.parse(localStorage.getItem('malak_local_date_submissions') || '[]');
    } catch {
      localSubmissions = [];
    }

    // Merge and deduplicate by content/id
    const combined = [...serverSubmissions];
    localSubmissions.forEach(localItem => {
      const exists = combined.some(s => s.submittedAt === localItem.submittedAt);
      if (!exists) {
        combined.push(localItem);
      }
    });

    return combined;
  },

  async deleteDateSubmission(id: string): Promise<void> {
    try {
      const local = JSON.parse(localStorage.getItem('malak_local_date_submissions') || '[]');
      const filtered = local.filter((item: any) => item.id !== id);
      localStorage.setItem('malak_local_date_submissions', JSON.stringify(filtered));
    } catch {
      // ignore
    }

    try {
      await fetch(`${API_BASE}/date-submissions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {
      // ignore
    }
  },

  // Backup & Restore
  async getBackup(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/backup`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to export backup');
    return res.json();
  },

  async restoreBackup(data: any): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/restore`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to restore backup');
  },

  async resetDefaults(): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/reset-defaults`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to reset defaults');
  }
};
