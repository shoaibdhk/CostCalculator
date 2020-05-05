import { Resolver, Query, Mutation } from 'type-graphql'
import User from './User.type'

@Resolver(User)
class UserResolver {
	@Query(() => User)
	me() {}

	@Mutation(() => User)
	login() {}
}

export default UserResolver
