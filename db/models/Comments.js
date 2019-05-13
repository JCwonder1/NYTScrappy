const mongoose = require('mongoose');
const Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0)
    mongoose.connect(require('../connection-config.js'))
        .catch(err => {
            console.error('mongoose Error', err)
        });



let CommentsSchema = new Schema({
    isActive: {type : Boolean, default: true},
    comment: {type: String},
    user: {type: String, default: 'Guest'},
    article: [{type: Schema.Types.ObjectId, ref: 'Articles'}],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

CommentsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

CommentsSchema.pre('update', function () {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});

CommentsSchema.pre('findOneAndUpdate', function () {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});



/** @name db.Comments */
module.exports = mongoose.model('Comments', CommentsSchema);
