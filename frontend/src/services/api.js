const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Fetch all processed claims from FastAPI backend
 */
export async function fetchClaims() {
  try {
    const response = await fetch(`${API_BASE_URL}/claims`);
    if (!response.ok) throw new Error('Failed to fetch claims');
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
    const response = await fetch(`${API_BASE_URL}/claims/${claimId}`);
    if (!response.ok) throw new Error('Failed to fetch claim detail');
    return await response.json();
  } catch (error) {
    console.error('API Error (fetchClaimById):', error);
    return null;
  }
}

/**
 * Submit new claim with file upload to FastAPI -> Azure Blob -> 4-Agent Pipeline
 */
export async function submitClaimApi(formDataPayload, selectedFile) {
  const formData = new FormData();
  formData.append('user_id', formDataPayload.userId || 'USR-101');
  formData.append('claimant_name', formDataPayload.claimantName);
  formData.append('policy_number', formDataPayload.policyNumber);
  formData.append('policy_type', formDataPayload.policyType);
  formData.append('claim_type', formDataPayload.claimType);
  formData.append('amount', formDataPayload.amount);
  formData.append('incident_date', formDataPayload.incidentDate);
  formData.append('description', formDataPayload.description || '');

  if (selectedFile) {
    formData.append('file', selectedFile);
  }

  const response = await fetch(`${API_BASE_URL}/claims/submit`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Submission failed: ${errText}`);
  }

  return await response.json();
}

/**
 * Submit Human Officer Decision (Approve / Reject / Request Info)
 */
export async function reviewClaimApi(claimId, status, notes, officerId = 'USR-801') {
  const response = await fetch(`${API_BASE_URL}/claims/${claimId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status,
      notes,
      officer_id: officerId,
    }),
  });

  if (!response.ok) throw new Error('Failed to submit officer decision');
  return await response.json();
}

/**
 * Fetch System Audit Logs
 */
export async function fetchAuditLogs() {
  try {
    const response = await fetch(`${API_BASE_URL}/audit-logs`);
    if (!response.ok) throw new Error('Failed to fetch audit logs');
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) throw new Error('Copilot response failed');
  return await response.json();
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

  if (!response.ok) throw new Error('Login failed');
  return await response.json();
}

/**
 * User Registration
 */
export async function registerApi(name, email, password, role = 'Customer') {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!response.ok) throw new Error('Registration failed');
  return await response.json();
}
