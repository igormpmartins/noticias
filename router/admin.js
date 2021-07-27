const express = require('express')
const Noticia = require('../models/noticia')

const router = express.Router()

router.use('/', (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.roles.indexOf('admin')>=0) {
            return next()
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/login')
    }
})

router.get('/', (req, res) => res.send('admin'))

router.get('/noticias', async(req, res) => {
    const noticias = await Noticia.find({})
    res.render('noticias/admin', {noticias})
})

module.exports = router
