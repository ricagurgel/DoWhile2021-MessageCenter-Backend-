import { Request, Response } from 'express'
import { lastMessagesService } from '../services/lastMessagesService'

class lastMessageController {
  async handle(request: Request, response: Response) {
    const service = new lastMessagesService();

    const result = await service.execute();

    return response.json(result);

  }
}

export { lastMessageController }
