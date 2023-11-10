import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Bienvenido a mi backend! Este es mi único endpoint público';
    }
}
