export interface ApiResponse<T = any> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    timestamp: string;
}
export interface ApiErrorResponse {
    success: boolean;
    statusCode: number;
    message: string;
    error: string;
    timestamp: string;
    path?: string;
}
