import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

@Service()
@Resolver()
export class HelloWorldResolver {
  @Query(() => String)
  async helloWorld() {
    return 'Hello World';
  }
}
