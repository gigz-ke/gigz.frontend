export interface Config {
  API_BASE_URL: string;
}

// Read from window object injected at runtime, fallback to default
export const config: Config = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  API_BASE_URL: (window as any).ENV?.API_BASE_URL || "http://localhost:5000/api",
};