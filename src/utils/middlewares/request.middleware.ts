import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID library

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Generate a unique request ID
        const requestId = uuidv4();

        // Attach the request ID to the request object
        req['requestId'] = requestId;

        // Optionally, you can set it in the response headers
        res.setHeader('X-Request-Id', requestId);

        next();
    }
}