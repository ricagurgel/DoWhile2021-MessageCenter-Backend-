/*
Muito bem. Agora precisamos nos comunicar com o github
para enviarmos o código gerado para pegarmos o token de acesso
e a partir do token de acesso (gerado pelo github)
, ai sim poderemos recuperar os dados do usuário.

tanto para enviar o código do github, quanto para pegar o token,
depois enviar o token e pegar os dados do usuário vamos usar o AXIOS

Como o token do github vai ser requisitado??? em json, vamos também usar o jsonwebtoken

*/
import axios from 'axios'
import prismaClient from '../prisma'
import { sign } from 'jsonwebtoken'

/*



 🌶 Isso aqui é do caralho também...
 com essa interface eu posso pré-definir dados que eu sei que vao vir do request
 mas que enquanto estou programando eu não sei quais são, porque ainda não me fiz o request
 então, no caso, no teste eu já sei que o github devolve:
              {
                "access_token": "",
                "token_type": "bearer",
                "scope": ""
              }
  Então agora é só definir os campos dentro da interface e depois eu uso essa interface
  dentro do axios (nesse caso) olha lá no 🔗🔗🔗
*/
interface iAccessTokenResponse {
  access_token: string
}

interface iUserResponse {
  login: string
  id: number
  avatar_url: string
  name: string

  /* "gravatar_id": "",
    "url": string,
    "html_url": string,
    "followers_url": string,
    "following_url": string,
    "gists_url": string,
    "starred_url": string,
    "subscriptions_url": string,
    "organizations_url": string,
    "repos_url": string,
    "events_url": string,
    "received_events_url": string,
    "type": string,
    
    "company": string,
    "blog": string,
    "location": string,
    "email": string,
    "bio": string,
    "twitter_username": string,
    "public_repos": number,
    "public_gists": number,
    "followers": number,
    "following": number,
    "created_at": string,
    "updated_at": string */
}

class authenticateUserService {
  async execute(code: string) {
    const url = 'https://github.com/login/oauth/access_token' //requisitar o access_token do github

    //
    //
    //
    // Isso aqui é docaralho...
    // Estou usando o axios para conectar com o github e pegar o 👉access_token👈
    // primeiro eu tinha uma const 👉response = await👈
    // dai, como eu sei que o axios responde com um objeto chamado data eu uso 👉response.data.access_token👈
    //
    // MAS !!!! AI É QUE COMEÇA A FICAR LEGAL
    // Como eu sei que o axios responde $data então eu posso desestruturar assim: 👉{ data } = await👈
    // dai poderia usar só 👉data.access_token👈
    // porém !!! ainda melhor !!! data é muito genérico, então eu posso usar ":" dentro
    // da desestrututuração, para mudar o nome de data !!!
    // é só colocar data: nomeQueEuQuiser
    // e agora, neste caso, remomeei para accessTokenResponse e assim posso usar 👉accessTokenResponse.access_token👈
    // Ai está um pouco mais das vantagens do Typescript
    ///////////
    const { data: accessTokenResponse } =
      await axios.post<iAccessTokenResponse>(url, null, {
        //🔗olha aqui a interface
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code
        },
        headers: {
          Accept: 'application/json '
        }
      }) //o axios pede (url,data,params). Neste caso não temos data por isso null

    const response = await axios.get<iUserResponse>(
      'https://api.github.com/user',
      {
        headers: {
          authorization: `Bearer ${accessTokenResponse.access_token}`
        }
      }
    )
    const { login, id, avatar_url, name } = response.data

    //
    // procura o usuário no banco de dados
    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    })

    // se usuário não foi encontrado no DB cria um novo
    if (!user) {
      console.log('usuário não existe')
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          name,
          avatar_url
        }
      })
    } else {
      console.log(user)
    }

    // cria token próprio que expira em 1 dia
    //////
    const token = sign(
      {
        user: {
          name: user.name,
          avatar_ur: user.avatar_url,
          id: user.id
        }
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '1d'
      }
    )

    return { token, user }
  }
}

export { authenticateUserService }
