const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require(".././models").User;
const Utils = require("../utilities/utils");


module.exports.selectItems = (request, response, next) => {
    console.log('request.body', request.body);
    
    if (request.body.currUserRole !== '1') {
        return response.status(200).json({
            "message":"Access denied, Admin Only"
        });
    }

    User.findAll({
        attributes: ['id', 'names']
    })
    .then((placement) => {
        return response.status(200).json(placement);
    }).catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message":error});
    });
};


module.exports.index = (req, res, next) => {
    User.findAll({
        include: [Category]
    })
    .then(users => {
        res.render('index', {users:users});
    });
};


module.exports.create = (req, res, next) => {
    if (!req.body.userRole) req.body.userRole = "1";
    bcrypt.hash(req.body.password, 10).then((hash) => {
        User.create({...req.body, password:hash}).then((user) => {
            const userId = user.dataValues.id;
            const payLoadParam = userId + "!~+=" + user.dataValues.email + "!~+=" + user.dataValues.userRole;
            const token = jwt.sign({userId:payLoadParam}, 'RANDOM_TOKEN_SECRET', {expiresIn:'24h'});
            return res.status(201).json({
                "status":"success",
                "data":{ "token":token, "userId":userId, "userRole":user.dataValues.userRole }
            });
        })
        .catch((error) => {
            Utils.logError(error);
            return res.status(500).json({"message":error});
        });
    }).catch((error) => {
        Utils.logError(error);
        return res.status(500).json({"message":error});
    });
};


module.exports.getUser = (req, res, next) => {
    User.findAll({
        where : { email: req.body.email }
    }).then((user) => {
        if (Utils.notEmptyArray(user)) {    
            bcrypt.compare(req.body.password, user[0].dataValues.password)
            .then((valid) => {
                if (!valid) {
                    return res.status(401).json({"message": "Incorrect Password"});
                }
                const userId = user[0].dataValues.id;
                const payLoadParam = userId + "!~+=" + user[0].dataValues.email + "!~+=" + user[0].dataValues.userRole;
                const token = jwt.sign({userId:payLoadParam}, 'RANDOM_TOKEN_SECRET', {expiresIn:'24h'});
                return res.status(200).json({
                    "status":"success", "data":{ "token":token, "userId":userId, "userRole":user[0].dataValues.userRole || "0" }
                });
            })
            .catch((error) => {
                Utils.logError(error);
                return res.status(500).json({"message":"User cannot be Authenticated!"});
            });
        } else {
            return res.status(200).json({
                "status":"success", "data":{ "message":"No match found" }
            });
        }
    })
    .catch((error) => {
        Utils.logError(error);
        return res.status(500).json({ "message" : "User Not Found!" });
    });
};


module.exports.checkDsUser = (request, response, next) => {
    const currUserId = request.body.currUserId; 
    const currUserEmail = request.body.currUserEmail; 
    const currUserRole = request.body.currUserRole;
    User.findAll({
        attributes: ['names', 'userRole'],
        where: { id: currUserId, email:currUserEmail }
    })
    .then((user) => {
        const rVals =  user[0].dataValues;
        if ((Object.keys(user).length > 0) && (user.constructor === Array)) {    
            return response.status(200).json({
                "userName": rVals.names,
                "isAdmin": rVals.userRole === '1' ? true : false,
                "isValid": true
            });
        } else {
            return response.status(200).json({
                "userName": '',
                "isAdmin": false,
                "isValid": false
            });
        }
    }).catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message":"Could not resolve User Details"});
    });
};