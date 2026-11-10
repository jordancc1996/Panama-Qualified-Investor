export const LINKEDIN_FIELD_ERROR =
  'Please enter a LinkedIn profile link, e.g. linkedin.com/in/yourname';

const HOST_RE = /^(?:www\.|[a-z]{2,3}\.)?linkedin\.com$/i;
const HANDLE_RE = /^[A-Za-z0-9](?:[A-Za-z0-9_-]{0,99})$/;

type LinkedInResult = { ok: true; value: string } | { ok: false; error: string };

export function normalizeLinkedInUrl(raw: string): LinkedInResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, value: '' };

  let candidate = trimmed;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return { ok: false, error: LINKEDIN_FIELD_ERROR };
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, error: LINKEDIN_FIELD_ERROR };
  }

  if (!HOST_RE.test(url.hostname)) {
    return { ok: false, error: LINKEDIN_FIELD_ERROR };
  }

  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length < 2) {
    return { ok: false, error: LINKEDIN_FIELD_ERROR };
  }

  const kind = segments[0].toLowerCase();

  if (kind === 'in') {
    let handle = '';
    try {
      handle = decodeURIComponent(segments[1]).replace(/\/+$/, '');
    } catch {
      return { ok: false, error: LINKEDIN_FIELD_ERROR };
    }
    if (!HANDLE_RE.test(handle)) {
      return { ok: false, error: LINKEDIN_FIELD_ERROR };
    }
    return { ok: true, value: `https://www.linkedin.com/in/${handle}` };
  }

  if (kind === 'pub') {
    const path = `/${segments.map((part) => encodeURIComponent(safeDecode(part))).join('/')}`;
    return { ok: true, value: `https://www.linkedin.com${path}` };
  }

  return { ok: false, error: LINKEDIN_FIELD_ERROR };
}

function safeDecode(part: string): string {
  try {
    return decodeURIComponent(part);
  } catch {
    return part;
  }
}

export function linkedinFieldError(value: string): string {
  const result = normalizeLinkedInUrl(value);
  return result.ok ? '' : result.error;
}

export function applyLinkedInToFormData(data: FormData): string {
  const result = normalizeLinkedInUrl(String(data.get('linkedin_url') ?? ''));
  if (!result.ok) return result.error;
  data.set('linkedin_url', result.value);
  return '';
}
