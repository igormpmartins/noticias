const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        enum: ['restrito', 'admin']
    }
})

UserSchema.pre('save', function(next) {
    const user = this

    if (!user.isModified('password')) {
        return next()
    }

    bcrypt.genSalt((err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash
            return next()
        })
    })

})

UserSchema.methods.checkPassword = function (password, cb) {
    return new Promise((res, rej) => {
        bcrypt.compare(password, this.password, (err, isMatch) => {
            if (err) {
                rej(err)
            } else {
                res(isMatch)
            }
        })
    })
}

const User = mongoose.model('User', UserSchema)

module.exports = User
