import mongoose from "mongoose"

export const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://poorna:artspire123@cluster0.crtpk8o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>console.log('MongoDB connected successfully..'))
}