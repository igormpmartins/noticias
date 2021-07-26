const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')

const User = require('./models/user')
//const Noticia = require('./models/noticia')

const rtNoticias = require('./router/noticias')
const rtRestrito = require('./router/restrito')
const rtAuth = require('./router/auth')
const rtPages = require('./router/pages')
const rtAdmin = require('./router/admin')

/* Environment */
const port = process.env.PORT || 3000
const mongodb = process.env.MONGODB || 'mongodb://localhost/noticias'

const app = express()

/* configs */
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static('public'))
app.use(session({secret: 'superTreku'}))
app.use(bodyParser.urlencoded({extended: true}))

/* routes */
app.use('/', rtAuth)
app.use('/', rtPages)
app.use('/noticias', rtNoticias)
app.use('/restrito', rtRestrito)
app.use('/admin', rtAdmin)

const checkInitUsers = async() => {

    const count = await User.countDocuments({})

    if (count === 0) {

        //admin
        const user = new User({
            username: 'igor',
            password: '1234',
            roles: ['admin', 'restrito']
        })

        await user.save()

        //restrito
        const user2 = new User({
            username: 'guest',
            password: '1234',
            roles: ['restrito']
        })

        await user2.save()

        console.log('Initial users created')
    }

    /*
    const not1 = new Noticia({
        title: 'Notícia Pública 2',
        content: 'texto público',
        category: 'public'
    })

    await not1.save()

    const not2 = new Noticia({
        title: 'Notícia Privada 2',
        content: 'texto privado',
        category: 'private'
    })

    await not2.save()*/

}

mongoose.Promise = global.Promise

mongoose
    .connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true})
    .then( () => {
        console.log('MongoDB connected...')

        app.listen(port, () => {
            
            console.log('Server online')
            checkInitUsers()

        })
    })
    .catch(e => console.log(e))
