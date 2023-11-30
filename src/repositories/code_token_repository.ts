import Repository from '.'
import CodeToken from '../database/models/codeToken'

interface ICodeTokenRepository {}

export default class CodeTokenRepository
  extends Repository<CodeToken>
  implements ICodeTokenRepository
{
  constructor() {
    super(CodeToken)
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.model.destroy({ where: { user_id: userId } })
  }
}
