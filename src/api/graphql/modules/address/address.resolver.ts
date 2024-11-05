import { AuthGuard } from '@graphql/decorators/auth-guard';
import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Address } from '../common/address.type';
import { AddressInput } from '../common/address.input';
import { CreateAddressUseCase, FindAddressByUserIdUseCase } from '@domain/address';

@Service()
@Resolver()
export class AddressResolver {
  constructor(
    private readonly createAddressUseCase: CreateAddressUseCase,
    private readonly findAddressByUserIdUseCase: FindAddressByUserIdUseCase,
  ) {}

  @Mutation(() => Address)
  @AuthGuard()
  createAddress(@Arg('data') data: AddressInput): Promise<Address> {
    return this.createAddressUseCase.execute(data);
  }

  @Query(() => [Address])
  @AuthGuard()
  findAddressByUserId(@Arg('userId', () => Int) userId: number): Promise<Address[]> {
    return this.findAddressByUserIdUseCase.execute(userId);
  }
}
