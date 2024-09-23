import { AppDataSource } from '../database/data-source'
import { CodeToken } from '../database/entity/CodeToken'

export const CodeTokenRepository = AppDataSource.getRepository(
  CodeToken
).extend({
  async removeByUserId(userId: string) {
    return await this.createQueryBuilder('code_token')
      .delete()
      .where('code_token.user_id = :userId', { userId })
      .execute()
  }
})
