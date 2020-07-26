// Requiring our models and passport as we've configured it
const db = require('../models');
const passport = require('../config/passport');

module.exports = function (app) {
    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the members page.
    // Otherwise the user will be sent an error
    app.post('/api/login', passport.authenticate('local'), (req, res) => {
        // Sending back a password, even a hashed password, isn't a good idea
        res.json({
            email: req.user.email,
            id: req.user.id,
        });
    });

    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post('/api/signup', (req, res) => {
        db.User.create({
            email: req.body.email,
            password: req.body.password,
        })
            .then(() => {
                // res.redirect(307, '/api/login');
                res.render('login');
            })
            .catch((err) => {
                res.status(401).json(err);
            });
    });

    // Route for logging user out
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    // Route for getting some data about our user to be used client side
    app.get('/api/user_data', (req, res) => {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        } else {
            // Otherwise send back the user's email and id
            // Sending back a password, even a hashed password, isn't a good idea
            res.json({
                email: req.user.email,
                id: req.user.id,
            });
        }
    });

    app.get('/data', (req, res) => {
        // 13.17
        // db.all(function (data) {
        //     var hbsObject = {
        //         journalentries: data,
        //         activityentries: data,
        //         nutritionentries: data,
        //     };
        //     console.log(hbsObject);
        //     res.render('data', hbsObject);
        // });
        // 14.14
        const query = {};
        if (req.query.user_id) {
            query.UserId = req.query.user_id;
        }
        // db.JournalEntry.findAll({
        // where: UserId=1,
        //   include: [db.ActivityEntry, db.NutritionEntry],
        //}).then(function (data) {
        //  console.log(data[0]);
        // res.json(data);
        // res.render('data', data[0]);
        //});
        // db.User.findAll({
        // where: {UserId=1,
        // include: [
        //  {
        //     model: db.JournalEntry,
        // as: 'JournalEntries',
        // where: {
        //     name: 'id',
        // },
        //  include: [
        //     db.ActivityEntry,
        //     db.NutritionEntry,
        // {
        //     model: db.ActivityEntry,
        //     as: 'ActivityEntries',
        //     required: false,
        //     // where: {
        //     //     name: 'Some section name',
        //     // },
        // },
        //  ],
        // },
        // ],
        //  }).then(function (data) {
        //   console.log(data[0]);
        // console.log(data[0].JournalEntries.JournalEntry.ActivityEntries[0]);
        // res.json(data);
        //res.render('data', data[0]);
        // });

        db.User.findAll({
            // where: UserId=1,
            include: [db.JournalEntry],
         }).then(function (JournalEntryData) {
             console.log(JournalEntryData);
            db.JournalEntry.findAll({
                // where: UserId=1,
                include: [db.ActivityEntry, db.NutritionEntry],
             }.then(function (data) {
                //  console.log(data[0]);
                 res.json(data);
                // const hbsObject = {
                    // journalentries: JournalEntryData,
                    activityentries: data[0].ActivityEntries,
                    // nutritionentries: data[0].NutritionEntries,
                }; 
                res.render('data', { JournalEntries: data });
            });
        });

        // db.JournalEntry.findAll({
        // where: UserId=1,
        //   include: [db.ActivityEntry, db.NutritionEntry],
        //}).then(function (data) {
        //  console.log(data[0]);
        // res.json(data);
        // res.render('data', data[0]);
        //});
        // res.render('data');
        // var dataObject = {
        //     journalentries: [
        //         {
        //             title: 'id',
        //             date: 'date',
        //             id: 'id',
        //         },
        //     ],
        //     activityentries: [
        //         {
        //             name: 'test',
        //             totalTime: 'test',
        //             entryActivityText: 'test',
        //             JournalEntryId: 'test',
        //         },
        //     ],
        //     nutritionentries: [
        //         {
        //             entryNutrictionText: 'test',
        //             typeOfMeal: 'test',
        //             JournalEntryId: 'test',
        //         },
        //     ],
        // };
        // res.render('data', dataObject);
    });

    app.get('/userProfile', (req, res) => {
        res.render('userProfile');
    });
};
