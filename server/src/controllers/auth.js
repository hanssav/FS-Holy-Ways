const { User } = require("../../models")

const Joi = require("joi")

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")

// const dotenv = require("dotenv")
// dotenv.config();

exports.register = async(req, res) => {
    try {
        const data = req.body

        const schema = Joi.object({
            fullname: Joi.string().min(5).required(),
            email: Joi.string().email().min(5).required(),
            password: Joi.string().min(5).required(),
            status: Joi.string()
        })

        const { error } = schema.validate(data)

        if (error) {
            console.log(error)
            return res.status(400).send({
                status: "error",
                message: error.details[0].message
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        await User.create({
            fullName: data.fullname,
            email: data.email,
            password: hashedPassword,
            status: "user"
        })

        const token = jwt.sign({ id: User.id }, process.env.TOKEN_KEY)

        res.status(201).send({
            status: "success",
            data: {
                fullName: data.fullName,
                email: data.email,
                password: hashedPassword,
                status: data.status,
                token
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "Server Error"
        })
    }
}

exports.login = async(req, res) => {
    const data = req.body

    const schema = Joi.object({
        email: Joi.string().email().min(6).required(),
        password: Joi.string().required()
    })

    const { error } = schema.validate(data)

    if (error) {
        return res.status(400).send({
            status: "error",
            message: error.details[0].message
        })
    }

    try {
        const userExist = await User.findOne({
            where: {
                email: data.email
            },
            attributes: {
                exclude: ["createdAt", "updateAt"]
            }
        })

        const isMatch = await bcrypt.compare(req.body.password, userExist.password)

        if (!isMatch) {
            return res.status(400).send({
                status: "failed",
                message: "email or password doesnt exist"
            })
        }

        const token = jwt.sign({ id: User.id }, process.env.TOKEN_KEY)

        res.status(200).send({
            status: "success",
            data: {
                id: userExist.id,
                fullName: userExist.fullName,
                email: userExist.email,
                status: userExist.status,
                token,
                idToken: User.id
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "Server Error"
        })
    }
}

exports.checkAuth = async (req, res) => {
  try {
      const id = req.user.id;
      
      const dataUser = await User.findOne({
          where: {
              id,
          },
          attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
          },
      });
      if (!dataUser) {
          return res.status(404).send({
              status: "failed",
          });
      }

    res.send({
      status: "success...",
      data: {
        user: {
          id: dataUser.id,
          name: dataUser.name,
          email: dataUser.email,
          status: dataUser.status,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};