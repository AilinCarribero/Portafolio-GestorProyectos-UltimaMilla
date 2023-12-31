const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const User = new Schema ({
    nombre: { type: String , trime:true , require: true},
    hashed_password: { type: String , required: true },
    salt: String,
    cargo: { type: Number , time: true , default: 0 }
},{timestamps: true}
);

User.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password= this.encryptPassword(password);
    }).get(function() {
            return this._password;
        });

User.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password) {
        if(!password) return '';
        try {
            return crypto.createHmac('sha1' , this.salt)
            .update(password)
            .digest('hex')
        } catch (err){
            return "";
        }
    }
};

module.exports = mongoose.model('User' , User); 