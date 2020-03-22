/**
 * Required Modules
 */
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require('cors');
const cron = require('node-cron');


const usersRoute = require('./routes/users');
const prescriptionsRoute = require('./routes/prescriptions');
const ailmentsRoute = require('./routes/ailments');
const formulasRoute = require('./routes/formulas');
const placementsRoute = require('./routes/placements');
const verificationsRoute = require('./routes/verifications');
const reminder = require('./controllers/reminder');


/**
 * Variables
 */
const app = express();
const port = process.env.PORT || "8000";


/**
 *  Configurations
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


/**
 * Routes
 */
app.use('/api/user', cors(), usersRoute);
app.use('/api/prescriptions', cors(), prescriptionsRoute);
app.use('/api/ailments', cors(), ailmentsRoute);
app.use('/api/formulas', cors(), formulasRoute);
app.use('/api/placements', cors(), placementsRoute);
app.use('/api/verifications', cors(), verificationsRoute);


//Reminder Schedule
cron.schedule("* * * * *", function() {
    reminder.sendReminder();
});



/**
 * Server
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});