import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
    roomName: String,
    createdTime: String,
    lastMessage: String,
    roomImage: String,
});

export default mongoose.model('rooms', roomSchema);