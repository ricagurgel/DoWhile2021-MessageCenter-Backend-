import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface iPayLoad {
  sub: string
}

export function ensureAuthenticate(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization

  if (!authToken) {
    return response.status(400).json({
      errorCode: 'token.missing'
    })
  }

  // o token vai vir assim:
  // Bearer 9sad789d0ad90sd7sad7a9a9
  // por isso o split(" "), porque o [0] = "Bearer" e o [1] = o token
  // e na constante [ ,token ] a virgula é para pegar apenas a segunda posição
  // ignorando assim a palavra "Bearer"
  const [, token] = authToken.split(' ')

  try {
    // importante saber... o jwt retorna como padrão a chave dentro de sub (no caso a chave é o user_id)
    // mas eu tenho também o user_id dentro de user.id
    const { sub } = verify(token, process.env.JWT_SECRET) as iPayLoad
    request.body.user_id = sub

    return next()
  } catch (err) {
    return response.status(401).json({
      errorCode: 'token.invalid'
    })
  }
}
