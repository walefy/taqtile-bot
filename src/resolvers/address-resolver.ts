import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { AddressService } from '../services/address-service';
import { AuthGuard } from '../decorators/auth-guard';
import { AddressInput } from '../dtos/inputs/address-input';
import { AddressModel } from '../dtos/models/address-model';

@Service()
@Resolver()
export class AddressResolver {
  constructor(private readonly service: AddressService) {}

  @Mutation(() => AddressModel)
  @AuthGuard()
  createAddress(@Arg('data') data: AddressInput): Promise<AddressModel> {
    return this.service.create(data);
  }

  @Query(() => [AddressModel])
  @AuthGuard()
  async findAddressByUserId(@Arg('userId', () => Int) userId: number): Promise<AddressModel[]> {
    return this.service.findAddressByUserId(userId);
  }
}
