const { Op } = require('sequelize');
const nodemailer = require("nodemailer");
const Placement = require(".././models").Placement;
const User = require(".././models").User;
const Ailment = require(".././models").Ailment;
const Prescription = require(".././models").Prescription;
const Formula = require(".././models").Formula;
const Verification = require(".././models").Verification;
const Utils = require("../utilities/utils");

const fetchPlacement = () => {

    // create mail transporter
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "apetugideon@gmail.com",
            pass: "Adisababa2$"
        }
    });

    const today = new Date();
    const dsDate = `${today.getUTCFullYear()}-${Utils.padStr(today.getUTCMonth()+1, 2)}-${Utils.padStr(today.getUTCDate(), 2)}`;
    const dsHour = Utils.padStr(today.getUTCHours()+1, 2); 
    const startHour = (dsHour == 24) ? "00" : dsHour;
    let endHour = "";
    if (dsHour == 23) {
        endHour = "00";
    } else if (dsHour == 24) {
        endHour = "01";
    } else {
        endHour = `${dsHour+1}`;
    }

    Placement.findAll({
        attributes: ['id','names','userId','ailmentId','startDate','endDate','status'],
        where: { endDate: { [Op.gte]: dsDate } },
        include: [
        {
            model: Ailment, 
            include: [{ 
                model: Formula, 
                attributes: ['prescriptionId','ailmentId','usageTime','dosage','id'], 
                where: { usageTime: { [Op.like]: `%${startHour}:%` } }, //usageTime: { [Op.lte]: endHour }
                include: [{model: Prescription, attributes: ['names']}]
            }]
        },
        { model: User, attributes: ['names','email'] }]
    })
    .then((placement) => { 
        if (Utils.notEmptyArray(placement)) {
            placement.forEach((item, pos) => {
                const userName = (item.dataValues.User) ? item.dataValues.User.names : "";
                const userEmail = (item.dataValues.User) ? item.dataValues.User.email : "";
                const ailmentName = (item.dataValues.Ailment) ? item.dataValues.Ailment.names : "";
                const ailmentSymptons = (item.dataValues.Ailment) ? item.dataValues.Ailment.symptons : "";
                const ailmentFormulas = (item.dataValues.Ailment) ? item.dataValues.Ailment.Formulas : []; 
                if (Utils.notEmptyArray(ailmentFormulas)) {
                    ailmentFormulas.forEach((posItem, itemPos) => {
                        const usageTime = posItem.usageTime;
                        const dosage = posItem.dosage;
                        const drugName = posItem.Prescription.names;

                        // sending emails at periodic intervals
                        console.log("-------------------------------");
                        console.log("Sending Prescription reminder!");
                        let mailOptions = {
                            from: "apetugideon@gmail.com",
                            to: userEmail,
                            subject: `A timely reminder`,
                            text: `Kindly be reminded that you will be taking ${dosage} dosage(s) of ${drugName} by ${usageTime}`
                        };
                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                Utils.logError(error);
                            } else {
                                console.log("Email successfully sent!");
                            }
                        });

                    });
                }
            });
        }
    }).catch((error) => {
        Utils.logError(error);
    });
};


module.exports.sendReminder = () => {
    console.log("Reminder Sent");
    fetchPlacement();
}