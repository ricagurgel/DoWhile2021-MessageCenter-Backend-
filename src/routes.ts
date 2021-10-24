import { Router } from 'express'
import { authenticateUserController } from './controllers/authenticateUserController'
import { createMessageController } from './controllers/createMessageController'
import { lastMessageController } from './controllers/lastMessagesController'
import { profileUserController } from './controllers/profileUserController'
import { ensureAuthenticate } from './middleware/ensureAuthenticate'

const router = Router()

router.post('/authenticate', new authenticateUserController().handle)

router.post('/messages', ensureAuthenticate, new createMessageController().handle)

router.get('/last', new lastMessageController().handle)

router.get('/profile', ensureAuthenticate, new profileUserController().handle)

export { router }
