import prismaClient from '../prisma'


class lastMessagesService  {
  async execute() { 
    const messages = await prismaClient.message.findMany(
    {
        take: 3,
        orderBy: {
          created_at: "desc",
        },
          include: {
            user_relation: true,
        },
    })
    return messages
  }
  
  }


export { lastMessagesService }
