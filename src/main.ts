import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction, Response } from 'express';
import {
    HttpException,
    HttpStatus,
    INestApplication,
    Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

declare module 'express' {
    interface Request {
        infoPeticion: string;
        logger: Logger;
    }
}

const createWhitelist = (app: INestApplication) => {
    const configService = app.get(ConfigService);
    const whitelist = []; // Habilito los frontend que no vengan como string vacío
    if (configService.get('URL_FRONTEND1'))
        whitelist.push(configService.get('URL_FRONTEND1'));
    if (configService.get('URL_FRONTEND2'))
        whitelist.push(configService.get('URL_FRONTEND2'));
    if (configService.get('URL_FRONTEND3'))
        whitelist.push(configService.get('URL_FRONTEND3'));
    return whitelist;
};

const createLogger = (
    req: Request,
    _res: Response,
    next: NextFunction,
    logger: Logger,
) => {
    // Implemento logger en todos los endpoints
    req.infoPeticion = `Petición a la ruta '${req.url}' | Método ${req.method}`;
    req.logger = logger;
    logger.log(req.infoPeticion);
    next();
};

const validateToken = (
    req: Request,
    _res: Response,
    next: NextFunction,
    app: INestApplication,
) => {
    if (req.path === '/' && (req.method === 'GET' || req.method === 'HEAD'))
        return next(); // Si la petición es a la ruta principal, permito el acceso siempre y cuando sea con el método GET o HEAD

    const token =
        req.headers.authorization?.split(' ')[0] === 'Bearer' &&
        req.headers.authorization?.split(' ')[1]; // Token enviado en el encabezado de la petición

    const configService = app.get(ConfigService);

    if (token === configService.get('TOKEN_GRAL')) {
        next(); // Permitimos el acceso del cliente sólo si en los encabezados coloca el token de acceso, utilizando el esquema de autenticación Bearer
    } else {
        req.logger.error(
            `${req.infoPeticion} | Forbidden | Token de acceso inválido. Visita https://github.com/Ale6100/backend-personal.git#endpoints-%EF%B8%8F`,
        );

        throw new HttpException(
            `${req.infoPeticion} | Forbidden | Token de acceso inválido. Visita https://github.com/Ale6100/backend-personal.git#endpoints-%EF%B8%8F`,
            HttpStatus.FORBIDDEN,
        );
    }
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('RequestLogger');

    const whitelist = createWhitelist(app);
    if (whitelist.length === 0) {
        logger.fatal('No hay URLs FRONTEND configuradas');
        throw new Error('No hay URLs FRONTEND configuradas');
    }

    app.enableCors({
        credentials: true,
        origin: whitelist,
    });

    app.use((req: Request, res: Response, next: NextFunction) => {
        createLogger(req, res, next, logger);
    });

    app.use((req: Request, res: Response, next: NextFunction) => {
        validateToken(req, res, next, app);
    });

    await app.listen(3000);
}
bootstrap();
