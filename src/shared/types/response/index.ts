export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface DeleteResponse {
  success: boolean;
  message?: string;
}

