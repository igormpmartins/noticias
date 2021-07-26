const express = require('express')
const Noticia = require('../models/noticia')

const router = express.Router()

router.get('/', async(req, res) => {

    //uma ideia é filtrar assim, verificando se tem a sessão :)
    /*let conditions = {}
    if (!('user' in req.session)) {
        conditions = {category: 'public'}
    }
    */

    const noticias = await Noticia.find({category: 'public'})
    res.render('noticias/index', {noticias})
})

module.exports = router
