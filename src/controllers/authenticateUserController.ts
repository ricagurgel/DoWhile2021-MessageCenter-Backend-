import { Request, Response } from "express";

import { authenticateUserService } from "../services/authenticateUserService"

class authenticateUserController {
  async handle(request: Request, response: Response) {


    const { code } = request.body;

    const service = new authenticateUserService; //tem que criar uma nova instância (new) para usar o service

    try {
      const result = await service.execute(code);
      return response.json(result);
    } catch (err) {
      return response.json({ error: err.message })

    }


  }
}

export { authenticateUserController }