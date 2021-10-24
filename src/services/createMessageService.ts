import prismaClient from '../prisma'
import { io } from '../app'

class createMessageService {
  async execute(text: string, user_id: string) { //isso aqui é uma função
    const message = await prismaClient.message.create({
      data: { text, user_id }, // quando tem create sempre tem data
      include: { user_relation: true } // relação messages e users para pegar os dados do usuário
    })

    const infoWS = { 
      id: message.id,
      text: message.text,
      user_id: message.user_id,
      created_at: message.created_at,
      user_relation: {
        name: message.user_relation.name,
        avatar_url: message.user_relation.avatar_url
      }
    }

    io.emit("new_message",infoWS)


    return message
  }
}

export { createMessageService }
