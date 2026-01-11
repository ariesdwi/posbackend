import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<{ statusCode: number }>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: unknown) => ({
        success: true,
        statusCode,
        message: this.getSuccessMessage(context, data),
        data: data as T,
        timestamp: new Date().toISOString(),
      })),
    );
  }

  private getSuccessMessage(context: ExecutionContext, data: unknown): string {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<{ method: string; route?: { path: string }; url: string }>();
    const method = request.method;
    const path = request.route?.path || request.url;

    // Custom messages based on data or default messages
    if (data && typeof data === 'object' && 'message' in data) {
       return (data as { message: string }).message;
    }

    // Default messages based on HTTP method
    switch (method) {
      case 'POST':
        if (path.includes('login')) return 'Login successful';
        if (path.includes('register')) return 'User registered successfully';
        return 'Resource created successfully';
      case 'PUT':
      case 'PATCH':
        return 'Resource updated successfully';
      case 'DELETE':
        return 'Resource deleted successfully';
      case 'GET':
      default:
        return 'Request successful';
    }
  }
}
