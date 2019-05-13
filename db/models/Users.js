const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

if (mongoose.connection.readyState === 0)
    mongoose.connect(require('../connection-config.js'))
        .catch(err => {
            console.error('mongoose Error', err)
        });



let UsersSchema = new Schema({
    userName: {
        type: String, 
        required: true, 
        trim: true, 
        index: {unique: true},
        minlength: 3,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

UsersSchema.pre('save', async function preSave(next) {
    this.updatedAt = Date.now();
    const user = this;
    if(!user.isModified('password')) return next();
    try {
        const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
        user.password =  hash;
        return next();
    }catch (err){
        return next(err);
    }
    
});

UsersSchema.methods.comparePassword = async function comparePassword (userPass){
    return bcrypt.compare(userPass, this.password);
}

UsersSchema.pre('update', function () {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});

UsersSchema.pre('findOneAndUpdate', function () {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});



/** @name db.Users */
module.exports = mongoose.model('Users', UsersSchema);
