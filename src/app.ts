import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";


import { router } from "./routes";




const app = express();

app.use(cors())
const serverHttp = http.createServer(app); //para o web socket preciso usar o http+io
const io = new Server(serverHttp,  {         //então eu passo o app para dentro do httpServer e configuro o io para user
    cors: {
      origin: '*', //o cors serve para dizer quem pode acessar nosso serviço, no caso * (todos)
    },
})       

io.on("connection", socket => {
  console.log(`usuário conectado no socket: ${socket.id}`);
})

app.use(express.json())
app.use(router)


app.get('/github', (request, response) => {
  response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
})

app.get('/signin/callback', (request, response) => {
  const { code } = request.query;

  response.send(code);
})







serverHttp.listen(4000, () => console.log(`🚀  servidor rodando na porta 4000`))

export { io,serverHttp }