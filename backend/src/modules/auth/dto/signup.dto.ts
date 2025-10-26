import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';


export class SignupDto {
    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;
}