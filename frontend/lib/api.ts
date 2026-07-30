/**
 * Helper to resolve absolute API URL dynamically for local dev, localhost, and network IPs (e.g. 10.121.117.206).
 */
export function getApiBase(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'https://urbanix-brdpdta5acenanh5.centralindia-01.azurewebsites.net/api';
  // Ensure trailing slashes are trimmed so paths like `${base}/contact/` format cleanly without double slashes
  return envUrl.replace(/\/+$/, '');
}

/**
 * Resolves relative Django media URLs (e.g., '/media/images/pic.jpg') to an absolute URL
 * pointing to the Django backend root server (e.g., 'https://urbanix-brdpdta5acenanh5.centralindia-01.azurewebsites.net/media/images/pic.jpg').
 */
export function resolveImageUrl(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  
  // If already absolute (http:// or https://), return as-is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'https://urbanix-brdpdta5acenanh5.centralindia-01.azurewebsites.net/api';
  const backendRoot = envUrl.replace(/\/+$/, '').replace(/\/api\/?$/, '');
  
  // If image path starts with '/' or relative
  if (trimmed.startsWith('/')) {
    return `${backendRoot}${trimmed}`;
  }
  
  return `${backendRoot}/${trimmed}`;
}

// ─────────────────────────────────────────────────────────────
// Lightweight in-memory cache (5-minute TTL)
// Prevents redundant API round-trips when navigating between
// pages — Navbar, Hero, Portfolio, PortfolioShowcase all share
// the same cached results within a browser session.
// ─────────────────────────────────────────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const _cache: Map<string, CacheEntry<unknown>> = new Map()

function cacheGet<T>(key: string): T | null {
  const entry = _cache.get(key) as CacheEntry<T> | undefined
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    _cache.delete(key)
    return null
  }
  return entry.data
}

function cacheSet<T>(key: string, data: T): void {
  _cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}


export interface ApiPricingTier {
  id: number;
  name: string;
  price: string;
  delivery_time?: string;
  features?: string[];
  is_popular?: boolean;
  order?: number;
}

export interface ApiService {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  full_description?: string;
  pricing_text?: string;
  base_price?: string | null;
  features?: string[];
  pricing_tiers?: ApiPricingTier[];
  icon_name?: string;
  icon?: string;
  order?: number;
  is_active?: boolean;
}

export interface ApiCategory {
  id: number;
  name: string;
  title?: string;
  slug: string;
  description?: string;
  icon_name?: string;
  icon?: string;
  order?: number;
}

export interface ApiProject {
  id: number;
  title: string;
  short_description?: string;
  sector?: string;
  image?: string | null;
  image_url?: string | null;
  image_url_resolved?: string | null;
  tech_tags?: string[];
  live_link?: string | null;
  is_featured?: boolean;
  created_at?: string;
  category?: string;
  description?: string;
  tech_list?: string[];
  results_highlight?: string;
  roi_metric?: string;
}

export type Project = ApiProject;

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  service_interested: string;
  message: string;
  captcha_id?: string;
  captcha_input?: string;
}

export interface CareerPayload {
  name: string;
  email: string;
  phone: string;
  role_applied: string;
  state?: string;
  district?: string;
  town?: string;
  portfolio_link?: string;
  cover_letter?: string;
  captcha_id?: string;
  captcha_input?: string;
}

export interface AgencyPartnerPayload {
  company_name: string;
  contact_person: string;
  whatsapp_number: string;
  email: string;
  core_services: string;
  portfolio_link: string;
  team_size: string;
  state?: string;
  district?: string;
  town?: string;
  proposal?: string;
  captcha_id?: string;
  captcha_input?: string;
}

export interface CallbackPayload {
  full_name?: string;
  phone_number?: string;
  name?: string;
  phone?: string;
  state?: string;
  district?: string;
  town?: string;
}

/**
 * Submit quick callback request to POST /api/callback/
 */
export async function submitCallbackForm(
  payload: CallbackPayload
): Promise<{ success: boolean; data?: any; error?: string }> {
  const base = getApiBase();
  const bodyData = {
    full_name: payload.full_name || payload.name || '',
    phone_number: payload.phone_number || payload.phone || '',
    state: payload.state || '',
    district: payload.district || '',
    town: payload.town || '',
  };
  try {
    const res = await fetch(`${base}/callback/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(
        errData.detail ||
          errData.phone_number?.[0] ||
          errData.full_name?.[0] ||
          errData.phone?.[0] ||
          errData.name?.[0] ||
          `Server returned ${res.status}`
      );
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error: any) {
    console.error('[API Submit Callback Error]:', error);
    return { success: false, error: error.message || 'Failed to submit callback request.' };
  }
}

/**
 * Submit B2B agency partner application to POST /api/agency-partner/
 */
export async function submitAgencyPartnerForm(
  payload: AgencyPartnerPayload
): Promise<{ success: boolean; data?: any; error?: string }> {
  const base = getApiBase();
  try {
    const res = await fetch(`${base}/agency-partner/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || errData.error || `Server returned ${res.status}`);
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error: any) {
    console.error('[API Submit Agency Partner Error]:', error);
    return { success: false, error: error.message || 'Failed to submit agency proposal.' };
  }
}

/**
 * Fetch self-hosted text CAPTCHA image and ID from GET /api/captcha/
 */
export async function fetchCaptcha(): Promise<{ captcha_id: string; image_base64: string } | null> {
  const base = getApiBase();
  try {
    const res = await fetch(`${base}/captcha/`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('[API fetchCaptcha Error]:', err);
    return null;
  }
}

/**
 * Fetch projects from GET /api/projects/
 * Supports optional sector filtering (e.g., 'local-business', 'education', 'portfolios')
 */
export async function fetchProjects(sector?: string): Promise<ApiProject[]> {
  const base = getApiBase();
  const cacheKey = sector ? `projects:${sector}` : 'projects:all';
  const cached = cacheGet<ApiProject[]>(cacheKey);
  if (cached) return cached;
  try {
    const url = sector
      ? `${base}/projects/?sector=${encodeURIComponent(sector)}`
      : `${base}/projects/`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items: ApiProject[] = Array.isArray(data) ? data : data.results || [];
    cacheSet(cacheKey, items);
    return items;
  } catch (error) {
    console.error('[API Fetch Projects Error]:', error);
    return [];
  }
}

/**
 * Fetch recent featured projects for homepage slider
 */
export async function fetchRecentProjects(limit: number = 4): Promise<ApiProject[]> {
  const projects = await fetchProjects();
  return projects.slice(0, limit);
}

/**
 * Submit contact lead to POST /api/contact/ (Absolute URL)
 */
export async function submitContactForm(payload: ContactPayload): Promise<{ success: boolean; data?: any; error?: string }> {
  const base = getApiBase();
  const targetUrl = `${base}/contact/`;
  try {
    console.log('[API Contact Submit] Sending POST to:', targetUrl, payload);
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 429) {
        return {
          success: false,
          error: data?.detail || 'You have submitted too many requests recently. Please try again later.',
        };
      }
      const errorMsg =
        data?.non_field_errors?.[0] ||
        data?.detail ||
        data?.email?.[0] ||
        data?.phone?.[0] ||
        'Submission failed. Please check form fields.';
      console.error('[API Contact Submit Error Response]:', data);
      return { success: false, error: errorMsg };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('[API Contact Submit Exception]: Failed to fetch target URL:', targetUrl, err);
    return { success: false, error: err.message || 'Failed to fetch Django backend. Please ensure backend is running.' };
  }
}

/**
 * Submit career application to POST /api/career/ (Absolute URL)
 */
export async function submitCareerForm(payload: CareerPayload): Promise<{ success: boolean; data?: any; error?: string }> {
  const base = getApiBase();
  const targetUrl = `${base}/career/`;
  try {
    console.log('[API Career Submit] Sending POST to:', targetUrl, payload);
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('[API Career Submit Error Response]:', data);
      // Handle rate limiting
      if (res.status === 429) {
        return { success: false, error: data?.detail || 'Too many submissions. Please try again later.' };
      }
      // Extract DRF field-level or non-field errors comprehensively
      const errorMsg =
        data?.non_field_errors?.[0] ||
        data?.detail ||
        data?.error ||
        data?.captcha_input?.[0] ||
        data?.captcha_id?.[0] ||
        data?.name?.[0] ||
        data?.email?.[0] ||
        data?.phone?.[0] ||
        data?.role_applied?.[0] ||
        data?.cover_letter?.[0] ||
        data?.portfolio_link?.[0] ||
        data?.state?.[0] ||
        // If DRF returned a generic object of errors, show first one found
        (typeof data === 'object'
          ? Object.values(data).flat().find((v) => typeof v === 'string') as string | undefined
          : undefined) ||
        `Submission failed (${res.status}). Please check your details and try again.`;
      return { success: false, error: errorMsg };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('[API Career Submit Exception]: Failed to fetch target URL:', targetUrl, err);
    return { success: false, error: err.message || 'Cannot connect to server. Please check your internet connection and try again.' };
  }
}


/**
 * Fetch active services from GET /api/services/
 */
export async function fetchServices(): Promise<ApiService[]> {
  const cached = cacheGet<ApiService[]>('services:all');
  if (cached) return cached;
  const base = getApiBase();
  try {
    const res = await fetch(`${base}/services/`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items: ApiService[] = Array.isArray(data) ? data : data.results || [];
    cacheSet('services:all', items);
    return items;
  } catch (error) {
    console.error('[API Fetch Services Error]:', error);
    return [];
  }
}

/**
 * Fetch active work categories from GET /api/categories/
 */
export async function fetchCategories(): Promise<ApiCategory[]> {
  const cached = cacheGet<ApiCategory[]>('categories:all');
  if (cached) return cached;
  const base = getApiBase();
  try {
    const res = await fetch(`${base}/categories/`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items: ApiCategory[] = Array.isArray(data) ? data : data.results || [];
    cacheSet('categories:all', items);
    return items;
  } catch (error) {
    console.error('[API Fetch Categories Error]:', error);
    return [];
  }
}

/**
 * Fetch single service by slug from GET /api/services/{slug}/
 */
export async function fetchServiceBySlug(slug: string): Promise<ApiService | null> {
  const cacheKey = `service:${slug}`;
  const cached = cacheGet<ApiService>(cacheKey);
  if (cached) return cached;
  const base = getApiBase();
  try {
    const res = await fetch(`${base}/services/${encodeURIComponent(slug)}/`, { next: { revalidate: 30 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP ${res.status}`);
    }
    const data: ApiService = await res.json();
    cacheSet(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`[API Fetch Service (${slug}) Error]:`, error);
    return null;
  }
}

/**
 * Fetch single category by slug from GET /api/categories/{slug}/
 */
export async function fetchCategoryBySlug(slug: string): Promise<ApiCategory | null> {
  const cacheKey = `category:${slug}`;
  const cached = cacheGet<ApiCategory>(cacheKey);
  if (cached) return cached;
  const base = getApiBase();
  try {
    const res = await fetch(`${base}/categories/${encodeURIComponent(slug)}/`, { next: { revalidate: 30 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP ${res.status}`);
    }
    const data: ApiCategory = await res.json();
    cacheSet(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`[API Fetch Category (${slug}) Error]:`, error);
    return null;
  }
}

export interface ApiFeedbackPayload {
  feedback_type: string;
  message: string;
  contact_info?: string;
}

/**
 * Submit user feedback or bug report to POST /api/feedback/
 */
export async function submitFeedback(payload: ApiFeedbackPayload): Promise<{ success: boolean; data?: any; error?: string }> {
  const base = getApiBase();
  try {
    const res = await fetch(`${base}/feedback/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Server returned ${res.status}`);
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error: any) {
    console.error('[API Submit Feedback Error]:', error);
    return { success: false, error: error.message || 'Failed to submit feedback.' };
  }
}


/**
 * Submit Call Partner Application to POST /api/call-partner/apply/
 */
export async function submitCallPartnerApplication(payload: {
  full_name: string;
  email: string;
  whatsapp_number: string;
  captcha_id?: string;
  captcha_input?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {

  const base = getApiBase();
  try {
    const res = await fetch(`${base}/call-partner/apply/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg =
        data?.error ||
        data?.detail ||
        data?.email?.[0] ||
        data?.whatsapp_number?.[0] ||
        data?.full_name?.[0] ||
        `Server returned ${res.status}`;
      return { success: false, error: errorMsg };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('[API Submit Call Partner Error]:', error);
    return { success: false, error: error.message || 'Failed to submit Call Partner application.' };
  }
}

/**
 * Submit a referred Client Lead to POST /api/leads/ (Requires Token Auth)
 */
export async function submitClientLead(
  payload: {
    client_name: string;
    client_phone: string;
    project_type: string;
    discussed_price?: string;
  },
  tokenOverride?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  const base = getApiBase();
  const token = tokenOverride || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '') || '';
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    const res = await fetch(`${base}/leads/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg =
        data?.detail ||
        data?.client_name?.[0] ||
        data?.client_phone?.[0] ||
        `Server returned ${res.status}`;
      return { success: false, error: errorMsg };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('[API Submit Client Lead Error]:', error);
    return { success: false, error: error.message || 'Failed to submit lead.' };
  }
}

