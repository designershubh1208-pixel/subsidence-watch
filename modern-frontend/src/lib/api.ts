export const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Native fetcher function to be used with SWR.
 */
export const fetcher = async (url: string) => {
  const res = await fetch(`${API_BASE_URL}${url}`);
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    (error as any).info = await res.json();
    (error as any).status = res.status;
    throw error;
  }
  
  return res.json();
};

export interface Zone {
  zone_id: string;
  name: string;
  latitude: number;
  longitude: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  last_updated: string;
}

export interface Report {
  id: string;
  zone_id: string | null;
  latitude: number;
  longitude: number;
  issue_type: 'crack' | 'uneven_ground' | 'other';
  photo_url: string | null;
  phone_number: string | null;
  status: 'new' | 'reviewed';
  created_at: string;
}

/**
 * Submits a new community report to the backend.
 */
export const submitReport = async (data: {
  latitude: number;
  longitude: number;
  issue_type: string;
  phone_number?: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error('Failed to submit report');
  }

  return res.json();
};
