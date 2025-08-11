/**
 * API Response Utilities
 * Standardized response format for API endpoints
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Create successful API response
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  meta?: ApiResponse<T>['meta']
): ApiResponse<T> {
  const response: ApiResponse<T> = { success };
  
  if (data !== undefined) {
    response.data = data;
  }
  
  if (message) {
    response.message = message;
  }
  
  if (meta) {
    response.meta = meta;
  }
  
  return response;
}

/**
 * Create error API response
 */
export function createErrorResponse(
  message: string,
  errors?: ApiResponse['errors'],
  data?: any
): ApiResponse {
  const response: ApiResponse = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  if (data !== undefined) {
    response.data = data;
  }
  
  return response;
}

/**
 * Create paginated API response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message?: string
): ApiResponse<T[]> {
  return createApiResponse(
    true,
    data,
    message,
    {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  );
}