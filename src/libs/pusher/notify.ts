import pusher from '.'
import { ResponseObjectData } from '../../helpers/request'

export const notify = async (
  channel: string | string[],
  event: string,
  message: ResponseObjectData
): Promise<void> => {
  await pusher.trigger(channel, event, {
    message
  })
}
