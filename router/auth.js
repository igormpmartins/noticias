const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const User = require('../models/user')

const router = express.Router()

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new FacebookStrategy({
    callbackURL: 'http://localhost:3000/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'photos']
    }, async(accessToken, refreshToken, profile, done) => {

        const userDB = await User.findOne({facebookId: profile.id})
    
        if (userDB) {
            return done(null, userDB)
        } else {

            const user = new User({
                facebookId: profile.id,
                name: profile.displayName,
                roles: ['restrito']
            })
    
            await user.save()

            return done(null, user)
        }

    })
) 

passport.use(new LocalStrategy(async(username, password, done) => {

    const user = await User.findOne({username})
    let isValid = false
    
    if (user) {
        isValid = await user.checkPassword(password)
    }

    if (isValid) {
        return done(null, user)
    } else {
        return done(null, false)
    }

}))

router.use((req, res, next) => {

    if (req.isAuthenticated()) {
        res.locals.user = req.user
        if (!req.session.role) {
            req.session.role = req.user.roles[0]
        }
        res.locals.role = req.session.role
    }

    next()
})

router.get('/logout', (req, res) => {
    req.session.destroy((e) => {
        res.redirect('/')
    })
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
    })  
)

router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback', 
    passport.authenticate('facebook', {failureRedirect: '/'}), 
    (req, res) => {
        res.redirect('/')
    })



router.get('/change-role/:role', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.roles.indexOf(req.params.role) >=0) {
            req.session.role = req.params.role
        }
    }
    res.redirect('/')    
})

module.exports = router