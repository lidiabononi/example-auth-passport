const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const User = require('../user/controller')

var Passport = {
    configuration: async () => {

        passport.serializeUser((user, done) => {
            done(null, user.id);
        });


        passport.deserializeUser(async (id, done) => {
            try {
                const user = await User.findById(id);
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        });

        passport.use(new LocalStrategy(
            async function (username, password, done) {

                var user = await User.findUser(username);

                if (!user || user == null) {
                    return done(null, false, { message: 'Incorrect username.' });
                }

                //comparando as senhas
                const isValid = User.validPassword(password, user);
                if (!isValid) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, user);

            }
        ));
    },

    passport: passport

}

module.exports = Passport;
