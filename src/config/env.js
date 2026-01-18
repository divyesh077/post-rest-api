import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key,defaultValue) => {
    const value = process.env[key] ?? defaultValue;
    if(value === undefined){
        throw new Error(`Missing environment variable: ${key}`)
    }
    return value;
}

export const env = {
    nodeEnv :getEnv("NODE_ENV","development"),
    port : Number(getEnv("PORT",3000))
}