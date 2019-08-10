import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
    heading:String,
    details:String,
    date:String
});

mongoose.model('mknews', NewsSchema);
module.exports = mongoose.model('mknews')