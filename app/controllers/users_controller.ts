import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import User from '#models/user'

@inject()
export default class UsersController {
  constructor(protected userService: UserService) {}

  async index({}: HttpContext) {
    return this.userService.all()
  }

  async register({ request, response }: HttpContext) {
    const userDetails = request.except(['password_confirmation'])
    const user = await User.create(userDetails)

    return response.ok(user)
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(
      user,
      ['*'], // with all abilities
      {
        name: 'token',
        expiresIn: '30 days', // expires in 30 days
      }
    )
    return response.ok(token)
  }
}
