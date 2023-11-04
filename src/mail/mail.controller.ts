import {
    Controller,
    Post,
    Body,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Post()
    async create(@Body() createMailDto: CreateMailDto) {
        const { from, to, subject, html, attachments } = createMailDto;

        if (!from || !to || !subject || !html) {
            throw new HttpException(
                'Valores incompletos',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (attachments && !Array.isArray(attachments)) {
            throw new HttpException(
                'attachments debe ser un arreglo',
                HttpStatus.BAD_REQUEST,
            );
        }

        const dto = {
            from,
            to,
            subject,
            html,
            attachments: attachments,
        };

        try {
            await this.mailService.create(dto);
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return { statusCode: 200, message: 'Email sent' };
    }
}
