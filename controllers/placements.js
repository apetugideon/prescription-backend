const Placement = require(".././models").Placement;
const User = require(".././models").User;
const Ailment = require(".././models").Ailment;
const Prescription = require(".././models").Prescription;
const Formula = require(".././models").Formula;
const Verification = require(".././models").Verification;
const Utils = require("../utilities/utils");


module.exports.create = (request, response, next) => { 
    request.body.userId = request.body.userIds;
    
    if (request.body.currUserRole !== '1') {
        return response.status(200).json({
            "message":"Access denied, Admin Only"
        });
    }

    let currUserId = request.body.currUserId;
    delete request.body.userIds;
    delete request.body.currUserId;
    delete request.body.currUserEmail;
    delete request.body.currUserRole;
    
    Placement.create({...request.body, createdBy:currUserId})
    .then((placement) => {
        if ((Object.keys(placement).length > 0) && (placement.constructor === Placement)) {    
            fetchRecs(request, response);
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
    if (request.body.currUserRole !== '1') {
        return response.status(200).json({
            "message":"Access denied, Admin Only"
        });
    }

    Placement.findAll({
        where : { id: request.params.id }
    }).then((placement) => {
        if (Utils.notEmptyArray(placement)) {    
            return response.status(200).json(placement);
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
    Placement.findAll({
        where : { id: request.params.id }
    }).then((placement) => {
        if (Utils.notEmptyArray(placement)) { 
            Placement.update({...request.body, modifiedBy:request.body.currUserId}, { where: {id: request.params.id } })
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
                "message":"Placement record not found!"
            });
        }
    })
    .catch((error) => {
        Utils.logError(error);
        return response.status(500).json({
            "message":"Placement record not resolved!"
        });
    });
};


module.exports.remove = (request, response, next) => {
    if (request.body.currUserRole !== '1') {
        return response.status(200).json({
            "message":"Access denied, Admin Only"
        });
    }

    Placement.destroy({
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
    Placement.findAll({
        attributes: ['id', 'names', 'userId','ailmentId','startDate','endDate','status'],
        include: [{model: Ailment, attributes:['names','id']}, {model: User, attributes:['id','names']}]
    })
    .then((placement) => {
        return response.status(200).json(placement);
    }).catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message":error});
    });
};
  

const fetchUserPlacement = (request, response, next) => {

    const today = new Date();
    let useDate = `${today.getUTCFullYear()}-${Utils.padStr(today.getUTCMonth()+1, 2)}-${Utils.padStr(today.getUTCDate(), 2)}`;

    Placement.findAll({
        attributes: ['id', 'names', 'userId','ailmentId','startDate','endDate','status'],
        include: [
            {
                model: Ailment, 
                attributes: ['names','id','description'], 
                include: [
                    { 
                        model: Formula,
                        attributes: ['prescriptionId','ailmentId','usageTime','dosage','id'],
                        include: [
                            { model: Prescription,  attributes: ['id','names','description']},
                            { model: Verification, required: false, where: { useDate: useDate } }
                        ]
                    }
                ]
            }, 
            {model: User, attributes:['id','names']}
        ],
        where: {userId: request.body.currUserId}
    })
    .then((placement) => {
        return response.status(200).json(placement);
    }).catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message":error});
    });
};



/**const fetchUserPlacement = (request, response, next) => {
    Placement.findAll({
        attributes: ['id', 'names', 'userId','ailmentId','startDate','endDate','status'],
        include: [
            {
                model: Ailment, 
                attributes: ['names','id','description'], 
                include: [
                    { model: Prescription, attributes:['id','names'], include:[{model: Formula}] }
                ]
            }, 
            {model: User, attributes:['id','names']}
        ],
        where: {userId: request.body.currUserId}
    })
    .then((placement) => {
        return response.status(200).json(placement);
    }).catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message":error});
    });
};**/


module.exports.show = (request, response, next) => {
    (request.params.id === 'current') ? fetchUserPlacement(request, response) : showOne(request, response);
};