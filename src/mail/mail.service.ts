import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private transport;

    constructor(private configService: ConfigService) {
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: this.configService.get('NODEMAILER_USER'),
                pass: this.configService.get('NODEMAILER_PASS'),
            },
        });
    }

    async create(createMailDto: CreateMailDto) {
        const { from, to, subject, html, attachments } = createMailDto;

        return await this.transport.sendMail({
            from: `<${from}>`, // El from debe ser quien envía el mail, aunque realmente esto es simbólico porque quien envía el mail realmente es el definido en NODEMAILER_USER. Por esta razón recomiendo colocar el email de envío dentro del propio html o en el subject de la petición | El < > es opcional
            to: to, // Mail de destino | También se puede configurar para que envíe a varios mails, si el "to" fuera un arreglo de mails
            subject: subject, // Asunto
            html: html, // HTML del cuerpo del mail
            attachments: attachments, // Archivos adjuntos
        });
    }
}
