const { User } = require('../models')

const Sequelize = require('sequelize')
const Op = Sequelize.Op

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/

const jwtSecret = 'awesome-secret-string'
const generateJwt =(id, username, email, isAdmin) =>{
    return jwt.sign({
        iss: 'http://localhost:8080',
        id,
        username,
        email,
        isAdmin,
        exp: parseInt(Date.now() / 1000 + 60 * 60)// Ce JWT expirera dans 1h
    }, jwtSecret)
}

const checkJwt = (req, res, next) => {
    try {
        if (!req.header('Authorization'))
        {
            throw "No Authorization Header in the request !"
        }
        const authorizationParts = req.header('Authorization').split(' ')
        let token = authorizationParts[1]
        jwt.verify(token, jwtSecret, (error, decodeToken) => {
            if (error) {
                throw error
            }
            req.token = decodeToken
            next()
        })
    }
    catch (e) {
        console.log(e)
        res.status(401).json({
            msg : 'Acces Denied ! (JWT)',
            event: e
        })
    }
}

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

            const hashPassword = bcrypt.hashSync(password, 10)

            User.findOrCreate({
                where: {
                    [Op.or]: [{username}, {email}]
                },
                defaults: {
                    username, password: hashPassword, email, isAdmin: false
                },
                attributes: [
                    'id', 'email', 'username'
                ]
            }).then(resultUser => {
                if (resultUser[1]) {
                    const { username, id, email, isAdmin } = resultUser[0]
                    const token = generateJwt(id, username, email, isAdmin)

                    return res.status(201).json({
                        msg: 'New User Created !',
                        user: resultUser[0],
                        token
                    })
                } else {
                    return res.status(422).json({
                        error: true,
                        msg: 'User with email or username already exist !',
                        user: resultUser[0]
                    })
                }
            })
        }
    },
    signin(req, res) {
        const { body: { username } } = req
        return res.status(200).json({
            msg: `Welcome ${ username } !`
        })
    }
}
