import type { User } from '../database/entity/User'
import Service, { type IService } from '.'
import { UserRepository } from '../repositories/user.repository'
import type { UserRefresh } from '../database/entity/User/dto/user-refresh'
import { createRefreshToken, createToken } from '../helpers/tokenize'

interface IAuthService extends IService<User> {
  refresh: (id: string) => Promise<UserRefresh>
}

class AuthService
  extends Service<User, typeof UserRepository>
  implements IAuthService
{
  constructor() {
    super(UserRepository)
  }

  public async refresh(id: string): Promise<UserRefresh> {
    const token = createToken(id)
    const refreshToken = createRefreshToken(id)

    await this.repository.update({ id }, { refresh_token: refreshToken })

    return {
      token,
      refresh_token: refreshToken
    }
  }
}

export default AuthService
