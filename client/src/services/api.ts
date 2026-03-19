import { LocationState } from '../components/Location/Location';

const SOCKET_BASE_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';
const API_BASE_URL = process.env.REACT_APP_API_URL || `${SOCKET_BASE_URL}/api`;

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getAxes(): Promise<string[]> {
  return fetchJSON<string[]>('/axes');
}

export async function getUsersByAxe(axe: string): Promise<string[]> {
  return fetchJSON<string[]>(`/users/${encodeURIComponent(axe)}`);
}

export async function getUserLocation(user: string): Promise<LocationState> {
  const payload = await fetchJSON<{ user: string; location: LocationState }>(
    `/locations/${encodeURIComponent(user)}`
  );

  return payload.location;
}

export async function updateUserLocation(user: string, location: LocationState): Promise<void> {
  await fetchJSON(`/locations/${encodeURIComponent(user)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ location })
  });
}
