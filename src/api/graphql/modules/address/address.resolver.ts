import { AuthGuard } from 'decorators/auth-guard';
import { AddressService } from 'services/address-service';
import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Address } from '../common/address.type';
import { AddressInput } from '../common/address.input';

@Service()
@Resolver()
export class AddressResolver {
  // TODO: transformar service em um use-case
  constructor(private readonly service: AddressService) {}

  @Mutation(() => Address)
  @AuthGuard()
  createAddress(@Arg('data') data: AddressInput): Promise<Address> {
    return this.service.create(data);
  }

  @Query(() => [Address])
  @AuthGuard()
  findAddressByUserId(@Arg('userId', () => Int) userId: number): Promise<Address[]> {
    return this.service.findAddressByUserId(userId);
  }
}
