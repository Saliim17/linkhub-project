// for development and production environments
function resolveApiUrl(): string {
  return import.meta.env.VITE_API_URL || 'http://192.168.1.40:3000';
}

// exporting as a function for easier testing 
export function getApiUrl(): string {
  return resolveApiUrl();
}

// exporting as a constant for regular usage
export const API_URL: string = resolveApiUrl();