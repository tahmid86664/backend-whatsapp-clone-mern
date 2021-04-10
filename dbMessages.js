import mongoose from 'mongoose';

const whatsappSchema = mongoose.Schema({
    message: String,
    name: String,
    email: String,
    timeStamp: String,
    received: Boolean,
    roomId: String
});

// this model is referred to collection
export default mongoose.model('messages', whatsappSchema);