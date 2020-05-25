const User = require('../models/user')


const bcrypt = require('bcrypt')

const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/


module.exports = {
    signup(req, res) {
        const { body: { username, password, email } } = req

        if (!username || !password || !email) {
            return res.status(422).json({
                error: true,
                msg: 'One or many field are missing !',
            })
        } else {
            let validatedEmail = emailRegex.test(email)
            let validatedPassword = passwordRegex.test(password)
            let validatedUsername = username.length <= 16 && username.length >= 4

            if (!validatedUsername) {
                return res.status(422).json({
                    error: true,
                    msg: 'Username doesn\'t match conditions !',
                })
            }
            if (!validatedEmail) {
                return res.status(422).json({
                    error: true,
                    msg: 'Invalid Email',
                })
            }
            if (!validatedPassword) {
                return res.status(422).json({
                    error: true,
                    msg: 'Password doesn\'t match conditions !',
                })
            }

            User.findOne({
                where: {
                    email
                },
                attributes: [
                    'id', 'email', 'username'
                ]
            }).then(resultUser => {
                if (resultUser) {
                    return res.status(422).json({
                        error: true,
                        msg: 'User already exist !',
                    })
                } else {
                    return res.status(201).json({
                        msg: 'Nouvel utilisateur créé !',
                        username,
                    })

                    // Hash password

                    // User.create()
                }
            })
        }
    },
    signin(req, res) {
        const { body: { username } } = req
        return res.status(200).json({
            msg: `Bienvenue ${ username } !`
        })
    }
}
