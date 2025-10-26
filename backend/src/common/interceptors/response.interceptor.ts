import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((response) => {
                if (
                    response &&
                    typeof response === 'object' &&
                    ('data' in response || 'meta' in response || 'message' in response)
                ) {
                    return {
                        data: response.data ?? null,
                        meta: response.meta ?? null,
                        message: response.message ?? 'Success',
                    };
                }

                return {
                    data: response ?? null,
                    meta: null,
                    message: 'Success',
                };
            }),
        );
    }
}
