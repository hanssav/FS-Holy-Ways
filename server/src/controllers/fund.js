const { Fund, Payment, User } = require("../../models");
const fs = require('fs');

let FILE_PATH = 'http://localhost:5000/uploads/'
let PATH_DELETE = '../BE Holy Ways/uploads/'

exports.getFundsUserDonate = async (req, res) => {
    try {
        let data = await Fund.findAll({
            include: [
                { model: User,
                as: "userDonate",
                    attributes: {
                    exclude: ["password", "status", "createdAt", "updatedAt"]
                },
                through: {
                    model: Payment,
                    as: "payment",
                    attributes: {
                        exclude: [ "createdAt", "updatedAt"]
                    }
                    // "userId","fundId",
                }
                }
            ],
            attributes: {
                exclude: ['adminId', 'updatedAt', "createdAt"]
            }
        })

        data = JSON.parse(JSON.stringify(data))
        // console.log(data)

        data = data.map((item) => {
            return {
                ...item,
                thumbnail: FILE_PATH + item.thumbnail
                }
            })
            // console.log(data)

        res.status(200).send({
            status: "success",
            data
        })

    } catch (error) {
        // console.log(error)
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.getFundsUserDonateOne = async (req, res) => {
    try {
        const { id } = req.params

        const data = await Fund.findOne({
            include: {
                id,
                model: User,
                as: "userDonate",
                through: {
                    model: Payment,
                    as: "payment",
                    attributes: {
                        exclude: ["userId", "fundId", "updatedAt"]
                    },
                },
                attributes: {
                    exclude: ["password", "status", "createdAt", "updatedAt"]
                }
            },
            where: {
                id: id
            },
            attributes: {
                exclude: ['adminId', 'updatedAt', "createdAt"]
            }
        })

        res.status(200).send({
            status: "success",
            data,
            thumbnail: FILE_PATH + data.thumbnail
        })

    } catch (error) {
        // console.log(error)
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.addFund = async(req, res) => {
    try {
        const { ...dataFund } = req.body

        const createFund = await Fund.create({
            ...dataFund,
            thumbnail: req.file.filename,
            // userId: req.user.id
        })

        fundData = JSON.parse(JSON.stringify(createFund))


        res.status(200).send({
            status: "success",
            data: {
                ...fundData,
                image : fundData.image
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: 'Server Error'
        })
    }
}

exports.updateFund = async (req, res) => {
    try {
        const { id } = req.params

        const data = {
            title: req?.body?.title,
            description: req?.body.description,
            goal: req?.body?.goal,
            thumbnail: req?.file?.filename,
        };

        await Fund.update(data, {
            where: {
                id
            }
        })

        // try to delete data image
        const findData = await Fund.findOne({
            where: {
                id
            }
        })
        // console.log(data.thumbnail)
        if (findData.thumbnail) {
            fs.unlink(PATH_DELETE + findData.thumbnail, function (err) {
                if (err) {
                    console.log(err)
                }

                console.log("Delete Image")
            })
        }

        // show data after update
        let update = await Fund.findOne({
            include: {
                model: User,
                as: "userDonate",
                through: {
                    model: Payment,
                    as: "payment",
                    attributes: {
                        exclude: ["userId", "fundId", "createdAt", "updatedAt"]
                    }
                },
                attributes: {
                    exclude: ["password", "status", "createdAt", "updatedAt"]
                }
            },
            where: {
                id: id
            },
            attributes: {
                exclude: ["adminId", "createdAt", "updatedAt"]
            }
        })

        res.status(200).send({
            status: "success",
            message: `Update data user id ${id} Successfuly`,
            data: update,
            thumbnail: req?.file?.filename,
        })
        // fundData = JSON.parse(JSON.stringify(fundData))

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: 'Server Error'
        })
    }
}

exports.deleteFund = async (req, res) => {
    try {
        const {id} = req.params

        const data = await Fund.findOne({
            where: {
                id
            }
        })
        // console.log(data.thumbnail)
        if (data.thumbnail) {
            fs.unlink(PATH_DELETE + data.thumbnail, function (err) {
                if (err) {
                    console.log(err)
                }

                console.log("Delete Image")
            })
        }
        if (data) {
            await Fund.destroy({
                where: {
                    id
                }
            })
        }

        const updateData = await Fund.findAll()

        res.status(200).send({
            status: "success",
            message: `Delete Fund id = ${id} Successfuly`,
            updateData
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}