import fs from 'fs/promises';

export const isProduction = () => process.env.ENVIRONMENT === "PRODUCTION";

const keyFolder = process.env.KEY_PATH || './keys';

export const getPrivateKey = async() => {
    const privateKey = await fs.readFile(`${keyFolder}/private.pem`, { encoding: 'utf-8'});
    return privateKey;
}

export const getFileByS3Url = (url) => {
    const split = url?.split('/');
    return split[3];
}

export const inputValidator = (values) => {
    for(const value of values){
        if(!value){
            throw Error('Invalid input');
        }
    }
}

export const awsConfig = () => {
    return {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        }
    }
}