
export interface ApiResponse<T = null> {
  data?: T;
  error?: string;
  message?: string;
}
