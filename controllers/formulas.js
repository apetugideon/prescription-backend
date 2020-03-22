const Formula = require(".././models").Formula;
const Prescription = require(".././models").Prescription;
const Ailment = require(".././models").Ailment;
const Utils = require("../utilities/utils");


module.exports.create = (request, response, next) => { 
    if (request.body.currUserRole !== '1') {
        return response.status(200).json({
            "message":"Access denied, Admin Only"
        });
    }
    Formula.create({...request.body, createdBy:request.body.currUserId})
    .then((formula) => {
        if ((Object.keys(formula).length > 0) && (formula.constructor === Formula)) {    
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
    Formula.findAll({
        where : { id: request.params.id }
    }).then((formula) => {
        if (Utils.notEmptyArray(formula)) {    
            return response.status(200).json(formula);
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
    Formula.findAll({
        where : { id: request.params.id }
    }).then((formula) => {
        if (Utils.notEmptyArray(formula)) { 
            Formula.update({...request.body, modifiedBy:request.body.currUserId}, { where: {id: request.params.id } })
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
                "message":"Formula record not found!"
            });
        }
    })
    .catch((error) => {
        Utils.logError(error);
        return response.status(500).json({
            "message":"Formula record not resolved!"
        });
    });
};


module.exports.remove = (request, response, next) => {
    if (request.body.currUserRole !== '1') {
        return response.status(200).json({
            "message":"Access denied, Admin Only"
        });
    }

    Formula.destroy({
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
    Formula.findAll({
        attributes: ['id','prescriptionId','ailmentId','usageTime','dosage'],
        include: [{model: Prescription, attributes:['names']}, {model: Ailment, attributes:['names']}]
    })
    .then((formula) => {
        return response.status(200).json(formula);
    }).catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message":error});
    });
};