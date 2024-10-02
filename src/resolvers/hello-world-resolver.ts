import { Query, Resolver } from 'type-graphql';

@Resolver()
export class HelloWorldResolver {
  @Query(() => String)
  async helloWorld() {
    return 'Hello World';
  }
}
