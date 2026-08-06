const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '') + '/api';

export function getAccessToken() {
  return localStorage.getItem('gc_access_token');
}

export function getRefreshToken() {
  return localStorage.getItem('gc_refresh_token');
}

export function setAuthTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem('gc_access_token', accessToken);
  if (refreshToken) localStorage.setItem('gc_refresh_token', refreshToken);
}

export function clearAuthTokens() {
  localStorage.removeItem('gc_access_token');
  localStorage.removeItem('gc_refresh_token');
}

function getHeaders(customHeaders = {}) {
  const token = getAccessToken();
  const headers = { ...customHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response, skipRefresh = false) {
  if (response.status === 401 && !skipRefresh) {
    // Attempt token refresh if refresh_token available for authenticated requests
    const refreshed = await refreshTokenApi();
    if (!refreshed) {
      clearAuthTokens();
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMsg = data?.detail?.message || data?.detail || data?.message || 'API request failed';
    const err = new Error(errorMsg);
    err.code = data?.detail?.code || 'API_ERROR';
    err.status = response.status;
    throw err;
  }
  return data;
}

/**
 * User Login Authentication
 */
export async function loginApi(email, password) {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response, true);
  if (data.access_token) {
    setAuthTokens(data.access_token, data.refresh_token);
  }
  return data;
}

/**
 * User Registration
 */
export async function registerApi(name, email, password, confirmPassword, role = 'Customer') {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, confirmPassword, role }),
  });

  const data = await handleResponse(response, true);
  if (data.access_token) {
    setAuthTokens(data.access_token, data.refresh_token);
  }
  return data;
}

/**
 * Refresh Access Token
 */
export async function refreshTokenApi() {
  const refresh_token = getRefreshToken();
  if (!refresh_token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/users/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token }),
    });

    if (!response.ok) {
      clearAuthTokens();
      return false;
    }

    const data = await response.json();
    if (data.access_token) {
      setAuthTokens(data.access_token, data.refresh_token);
      return true;
    }
    return false;
  } catch (err) {
    clearAuthTokens();
    return false;
  }
}

/**
 * Fetch Current Authenticated User (Session Persistence)
 */
export async function fetchMe() {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getHeaders({ 'Content-Type': 'application/json' }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await refreshTokenApi();
        if (refreshed) return await fetchMe();
      }
      clearAuthTokens();
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('API Error (fetchMe):', error);
    return null;
  }
}

/**
 * User Logout
 */
export async function logoutApi() {
  try {
    await fetch(`${API_BASE_URL}/users/logout`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
    });
  } catch (e) {
    // Ignore logout request network errors
  } finally {
    clearAuthTokens();
  }
}

/**
 * Fetch all processed claims from FastAPI backend
 */
export async function fetchClaims() {
  try {
    const response = await fetch(`${API_BASE_URL}/claims`, {
      headers: getHeaders({ 'Content-Type': 'application/json' }),
    });
    if (!response.ok) handleResponse(response);
    return await response.json();
  } catch (error) {
    console.error('API Error (fetchClaims):', error);
    return [];
  }
}

/**
 * Fetch detailed claim breakdown by ID
 */
export async function fetchClaimById(claimId) {
  try {
    const response = await fetch(`${API_BASE_URL}/claims/${claimId}`, {
      headers: getHeaders({ 'Content-Type': 'application/json' }),
    });
    if (!response.ok) handleResponse(response);
    return await response.json();
  } catch (error) {
    console.error('API Error (fetchClaimById):', error);
    return null;
  }
}

/**
 * Fetch authorized SAS URL or backend document stream URL for private storage
 */
export async function fetchClaimDocumentUrl(claimId) {
  try {
    const response = await fetch(`${API_BASE_URL}/claims/${claimId}/document`, {
      headers: getHeaders({ 'Content-Type': 'application/json' }),
    });
    const data = await response.json();
    if (data && data.documentUrl) {
      return data.documentUrl;
    }
  } catch (error) {
    console.warn('API Warning (fetchClaimDocumentUrl):', error);
  }
  return `${API_BASE_URL}/claims/${claimId}/document-stream`;
}

/**
 * Submit new claim with file upload to FastAPI -> Azure Blob -> 4-Agent Pipeline
 */
export async function submitClaimApi(formDataPayload, selectedFile) {
  const formData = new FormData();
  formData.append('user_id', formDataPayload.userId || '');
  formData.append('claimant_name', formDataPayload.claimantName || '');
  formData.append('policy_number', formDataPayload.policyNumber || 'POL-HTH-7721');
  formData.append('policy_type', formDataPayload.policyType || 'Health Standard');
  formData.append('claim_type', formDataPayload.claimType || 'Emergency Medical');
  formData.append('amount', formDataPayload.amount);
  formData.append('incident_date', formDataPayload.incidentDate);
  formData.append('description', formDataPayload.description || '');

  if (selectedFile) {
    formData.append('file', selectedFile);
  }

  const response = await fetch(`${API_BASE_URL}/claims/submit`, {
    method: 'POST',
    headers: getHeaders(), // Attach Authorization Bearer header
    body: formData,
  });

  return await handleResponse(response);
}

/**
 * Perform OCR / AI field extraction on an uploaded document file
 */
export async function parseDocumentApi(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/claims/parse-document`, {
    method: 'POST',
    headers: getHeaders(),
    body: formData,
  });

  return await handleResponse(response);
}

/**
 * Submit Human Officer Decision (Approve / Reject / Request Info)
 */
export async function reviewClaimApi(claimId, status, notes, officerId) {
  const response = await fetch(`${API_BASE_URL}/claims/${claimId}/review`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      status,
      notes,
      officer_id: officerId,
    }),
  });

  return await handleResponse(response);
}

/**
 * Fetch System Audit Logs
 */
export async function fetchAuditLogs() {
  try {
    const response = await fetch(`${API_BASE_URL}/audit-logs`, {
      headers: getHeaders({ 'Content-Type': 'application/json' }),
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('API Error (fetchAuditLogs):', error);
    return [];
  }
}

/**
 * Send query to Microsoft Copilot assistant (Grounded RAG)
 */
export async function sendCopilotChat(message) {
  const response = await fetch(`${API_BASE_URL}/copilot/chat`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ message }),
  });

  return await handleResponse(response);
}
