const Placement = require(".././models").Placement;
const Formula = require(".././models").Formula;
const Prescription = require(".././models").Prescription;
const Ailment = require(".././models").Ailment;
const Verification = require(".././models").Verification;
const User = require(".././models").User;
const Utils = require("../utilities/utils");


module.exports.create = (request, response, next) => {     
    let currUserId = request.body.currUserId;
    delete request.body.currUserId;
    delete request.body.currUserEmail;
    delete request.body.currUserRole;
    
    const today = new Date();
    let useDate = `${today.getUTCFullYear()}-${Utils.padStr(today.getUTCMonth()+1, 2)}-${Utils.padStr(today.getUTCDate(), 2)}`;

    //Placement.create({...request.body, createdBy:currUserId, useDate:useDate})

    Verification.create({...request.body, createdBy:currUserId, useDate:useDate})
    .then((verification) => {
        if ((Object.keys(verification).length > 0) && (verification.constructor === Verification)) {    
            return response.status(200).json({
                "status":"success", "data":verification
            });
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
    fetchRecs(request, response);
};


const showOne = (request, response) => {
    Verification.findAll({
        where : { id: request.params.id }
    }).then((verification) => {
        if (Utils.notEmptyArray(verification)) {    
            return response.status(200).json(verification);
        } else {
            return response.status(200).json({
                "status":"success", "data":{ "message":"No match found" }
            });
        }
    })
    .catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message" : "User Not Found!" });
    });
}

module.exports.update = (request, response, next) => {  
    Verification.findAll({
        where : { id: request.params.id }
    }).then((verification) => {
        if (Utils.notEmptyArray(verification)) { 
            Verification.update({...request.body, modifiedBy:request.body.currUserId}, { where: {id: request.params.id } })
            .then(update => {
                if ((Object.keys(update).length > 0) && (update.constructor === Array)) {    
                    return response.status(200).json({
                        "status":"success", "data":update
                    });
                } else {
                    return response.status(200).json({
                        "status":"success", "data":{ "message":"No match found" }
                    });
                }
            })
            .catch((error) => {
                console.log('error', error);
                
                Utils.logError(error);
                return response.status(500).json({
                    "message":"Could Not Update User Details"
                });
            });
        } else {
            return response.status(500).json({
                "message":"verification record not found!"
            });
        }
    })
    .catch((error) => {
        Utils.logError(error);
        return response.status(500).json({
            "message":"verification record not resolved!"
        });
    });
};


module.exports.remove = (request, response, next) => {
    Verification.destroy({
        where: { id: request.params.id }
    })
    .then((status) => {
        if (status === 1) {
            fetchRecs(request, response);
        } else {
            return response.status(500).json({ "message":"Action Failed"});
        }
    }).catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message":error});
    });
};


const fetchRecs = (request, response) => {
    Verification.findAll({
        attributes: ['id', 'placementId', 'formulaId','ailmentId','prescriptionId','status'],
        include: [{model: Ailment, attributes:['names','id']}, {model: User, attributes:['id','names']}]
    })
    .then((verification) => {
        return response.status(200).json(verification);
    }).catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message":error});
    });
};
  

const fetchUserVerifications = (request, response, next) => {
    Verification.findAll({
        attributes:  ['id', 'placementId', 'formulaId','ailmentId','prescriptionId','status'],
        include: [
            {
                model: Ailment, 
                attributes: ['names','id','description'], 
                include: [
                    { model: Prescription, attributes:['id','names'], include:[{model: Formula}] }
                ]
            }, 
            {model: User, attributes:['names']}
        ],
        where: {createdBy: request.body.currUserId}
    })
    .then((verification) => {
        return response.status(200).json(verification);
    }).catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message":error});
    });
};



module.exports.show = (request, response, next) => {
    (request.params.id === 'current') ? fetchUserVerifications(request, response) : showOne(request, response);
};