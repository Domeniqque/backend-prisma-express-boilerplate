import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import Container, { Service } from 'typedi';
import { AuthPayload } from '~/@types/authentication';
import { UserNotFound } from '~/app/exceptions/UserNotFound';
import { UserService } from '~/app/modules/account/services/user.service';
import { AppConfig } from '~/config';
import { logger } from '~/logger';
import { exclude } from '~/prisma/utils/exclude';

@Service()
export class AuthenticateMiddleware implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;

    if (!authToken) {
      return response.status(401).json({
        message: 'Token missing'
      });
    }

    const [, token] = authToken.split(' ');

    try {
      const { userId } = verify(
        token,
        AppConfig.JWT_ACCESS_SECRET
      ) as AuthPayload;

      const userService = Container.get(UserService);

      const user = await userService.findById(userId);

      if (!user) {
        throw new UserNotFound(userId, '[auth middleware]');
      }

      request.user = exclude(user, 'password');

      return next();
    } catch (error) {
      if (error instanceof UserNotFound) {
        logger.error(error);
      }

      return response.status(401).json({
        message: 'Invalid token'
      });
    }
  }
}
