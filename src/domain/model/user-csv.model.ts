export interface UserCsvInputModel {
  nome: string;
  email: string;
  'data de nascimento': Date;
  zipCode: string;
  cidade: string;
  estado: string;
  bairro: string;
  rua: string;
  'número da casa': string;
  complemento?: string;
}

export interface UserCsvModel extends UserCsvInputModel {
  password: string;
}
