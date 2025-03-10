import mongoose from "mongoose";

const  MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000;  // 5 seconds

class DataBaseConnection{
    constructor(){
        this.retryCount = 0
        this.isConnected = false

        //configuration 
        mongoose.set('strictQuery', true);
    }
}