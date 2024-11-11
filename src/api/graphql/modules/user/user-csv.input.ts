import { UserCsvInputModel } from '@domain/model';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsDateString, IsNumberString } from 'class-validator';

export class UserCsvInput implements UserCsvInputModel {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  'data de nascimento': Date;

  @IsNotEmpty()
  zipCode: string;

  @IsNotEmpty()
  @IsString()
  cidade: string;

  @IsNotEmpty()
  @IsString()
  estado: string;

  @IsNotEmpty()
  @IsString()
  bairro: string;

  @IsNotEmpty()
  @IsString()
  rua: string;

  @IsNumberString()
  'número da casa': string;

  @IsOptional()
  @IsString()
  complemento?: string;
}
