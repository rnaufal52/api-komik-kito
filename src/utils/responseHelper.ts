import { Request } from 'express';

export interface PaginationMeta {
  page: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export const buildPaginationMeta = (req: Request, page: number, hasNextPage: boolean): PaginationMeta => {
    const protocol = req.protocol;
    const host = req.get('host');
    const envBaseUrl = process.env.APP_BASE_URL;
    
    // Determine the base domain (e.g. http://localhost:3000)
    const domain = envBaseUrl ? envBaseUrl.replace(/\/$/, '') : `${protocol}://${host}`;
    
    // Append the current path (e.g. /api/popular)
    const currentPath = req.originalUrl.split('?')[0];
    const fullBaseUrl = `${domain}${currentPath}`;
    
    const query = { ...req.query };

    // Next URL
    let nextUrl: string | null = null;
    if (hasNextPage) {
        query.page = String(page + 1);
        const searchParams = new URLSearchParams(query as any);
        nextUrl = `${fullBaseUrl}?${searchParams.toString()}`;
    }

    // Prev URL
    let prevUrl: string | null = null;
    if (page > 1) {
        query.page = String(page - 1);
        const searchParams = new URLSearchParams(query as any);
        prevUrl = `${fullBaseUrl}?${searchParams.toString()}`;
    }

    return {
        page,
        hasNextPage,
        nextPageUrl: nextUrl,
        prevPageUrl: prevUrl
    };
};

export const createSuccessResponse = <T>(
  data: T,
  meta?: PaginationMeta,
  message?: string
): ApiResponse<T> => {
  return {
    success: true,
    data,
    meta,
    message,
  };
};

export const createErrorResponse = (message: string): ApiResponse<null> => {
  return {
    success: false,
    data: null,
    message,
  };
};
