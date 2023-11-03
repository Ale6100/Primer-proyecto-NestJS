import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private configService: ConfigService,
    ) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        const { first_name, last_name, email, password } = createUserDto;

        if (!first_name || !last_name || !email || !password) {
            throw new HttpException(
                'Valores incompletos',
                HttpStatus.BAD_REQUEST,
            );
        }

        const dto = {
            first_name,
            last_name,
            email,
            password,
        };

        return this.usersService.create(dto);
    }

    @Get()
    findAll(@Query('limit') limit: string) {
        console.log(this.configService.get<string>('VARIABLE_DE_PRUEBA')); // Muestro esto por consola simplemente para verificar si funciona la obtencion de la variable
        return this.usersService.findAll(+limit);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
}
