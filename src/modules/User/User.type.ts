import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
class User {
	@Field(() => ID)
	_id: string

	@Field()
	name: string

	@Field()
	createdAt?: Date

	@Field()
	updatedAt?: Date
}
export default User
