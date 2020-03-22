const Prescription = require(".././models").Prescription;
const Utils = require("../utilities/utils");


module.exports.create = (request, response, next) => { 
    if (request.body.currUserRole !== '1') {
        return response.status(200).json({
            "message":"Access denied, Admin Only"
        });
    }
    Prescription.create({...request.body, createdBy:request.body.currUserId})
    .then((prescription) => {
        if ((Object.keys(prescription).length > 0) && (prescription.constructor === Prescription)) {    
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
    Prescription.findAll({
        where : { id: request.params.id }
    }).then((prescription) => {
        if (Utils.notEmptyArray(prescription)) {    
            return response.status(200).json(prescription);
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
    Prescription.findAll({
        where : { id: request.params.id }
    }).then((prescription) => {
        if (Utils.notEmptyArray(prescription)) { 
            Prescription.update({...request.body, modifiedBy:request.body.currUserId}, { where: {id: request.params.id } })
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
                "message":"Prescription record not found!"
            });
        }
    })
    .catch((error) => {
        Utils.logError(error);
        return response.status(500).json({
            "message":"Prescription record not resolved!"
        });
    });
};


module.exports.remove = (request, response, next) => {
    if (request.body.currUserRole !== '1') {
        return response.status(200).json({
            "message":"Access denied, Admin Only"
        });
    }

    Prescription.destroy({
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
    Prescription.findAll({
        attributes: ['id', 'names', 'description']
    })
    .then(prescription => {
        return response.status(200).json(prescription);
    }).catch((error) => {
        Utils.logError(error);
        return response.status(500).json({ "message":error});
    });
};