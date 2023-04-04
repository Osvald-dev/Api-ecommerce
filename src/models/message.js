import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    content: String,
    user: String,
    timestamp: { type: Date, default: Date.now }
  });
  
 
  
export default MessageSchema;