const Ailment = require(".././models").Ailment;
const Utils = require("../utilities/utils");


module.exports.create = (request, response, next) => { 
    if (request.body.currUserRole !== '1') {
        return response.status(200).json({
            "message":"Access denied, Admin Only"
        });
    }
    Ailment.create({...request.body, createdBy:request.body.currUserId})
    .then((ailment) => {
        if ((Object.keys(ailment).length > 0) && (ailment.constructor === Ailment)) {    
            fetchRecs(response);
        } else {
            return response.status(200).json({
                "status":"success", "data":{ "message":"No match found" }
            });
        }
    }).catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message":error});
    });
};


module.exports.index = (request, response, next) => {
    fetchRecs(response);
};


module.exports.show = (request, response, next) => {
    Ailment.findAll({
        where : { id: request.params.id }
    }).then((ailment) => {
        if (Utils.notEmptyArray(ailment)) {    
            return response.status(200).json(ailment);
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


module.exports.update = (request, response, next) => {  
    Ailment.findAll({
        where : { id: request.params.id }
    }).then((ailment) => {
        if (Utils.notEmptyArray(ailment)) { 
            Ailment.update({...request.body, modifiedBy:request.body.currUserId}, { where: {id: request.params.id } })
            .then(update => {
                return response.status(200).json({
                    "status":"success", "data":update
                });
            })
            .catch((error) => {
                Utils.logError(error);
                return response.status(500).json({
                    "message":"Could Not Update User Details"
                });
            });
        } else {
            return response.status(500).json({
                "message":"Ailment record not found!"
            });
        }
    })
    .catch((error) => {
        Utils.logError(error);
        return response.status(500).json({
            "message":"Ailment record not resolved!"
        });
    });
};


module.exports.remove = (request, response, next) => {
    if (request.body.currUserRole !== '1') {
        return response.status(200).json({
            "message":"Access denied, Admin Only"
        });
    }

    Ailment.destroy({
        where: { id: request.params.id }
    })
    .then((status) => {
        if (status === 1) {
            fetchRecs(response);
        } else {
            return response.status(500).json({ "message":"Action Failed"});
        }
    }).catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message":error});
    });
};


const fetchRecs = (response) => {
    Ailment.findAll({
        attributes: ['id', 'names', 'description','symptons'],
        //include: [{model: Prescription, attributes:['names','id']}]
    })
    .then((ailment) => {
        return response.status(200).json(ailment);
    }).catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message":error});
    });
};