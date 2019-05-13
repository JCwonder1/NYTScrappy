const mongoose = require('mongoose');
const Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0)
    mongoose.connect(require('../connection-config.js'))
        .catch(err => {
            console.error('mongoose Error', err)
        });



let ArticlesSchema = new Schema({
    title: {type: String},
    desc: {type: String},
    url: {type: String},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comments'}],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

ArticlesSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

ArticlesSchema.pre('update', function () {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});

ArticlesSchema.pre('findOneAndUpdate', function () {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});



/** @name db.Articles */
module.exports = mongoose.model('Articles', ArticlesSchema);
