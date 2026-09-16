import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'node:crypto';

const codeByStatus: Partial<Record<number, string>> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.PAYLOAD_TOO_LARGE]: 'PAYLOAD_TOO_LARGE',
  [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: 'UNSUPPORTED_MEDIA_TYPE',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_FAILED',
  [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
};

interface HttpExceptionBody {
  code?: string;
  error?: string;
  message?: string | string[];
}

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<FastifyRequest>();
    const reply = context.getResponse<FastifyReply>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const body =
      exception instanceof HttpException
        ? (exception.getResponse() as string | HttpExceptionBody)
        : undefined;
    const traceHeader = request.headers['x-request-id'];
    const traceId = typeof traceHeader === 'string' ? traceHeader : randomUUID();
    const code =
      typeof body === 'object' && body.code
        ? body.code
        : (codeByStatus[status] ?? 'INTERNAL_SERVER_ERROR');
    const rawMessage = typeof body === 'string' ? body : body?.message;
    const detail = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage;
    const title =
      typeof body === 'object' && body.error
        ? body.error
        : status === 500
          ? 'Internal Server Error'
          : 'Request failed';

    reply
      .header('content-type', 'application/problem+json')
      .header('x-trace-id', traceId)
      .status(status)
      .send({
        type: `https://api.moajam.app/problems/${code.toLowerCase().replaceAll('_', '-')}`,
        title,
        status,
        code,
        traceId,
        ...(detail ? { detail } : {}),
      });
  }
}
