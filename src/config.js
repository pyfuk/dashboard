import dotenv from 'dotenv'

dotenv.config();

const env = process.env;


export const server = {
    URL: env.VUE_APP_URL
}

export const timeout = {
    LIST_SLEEP: env.LIST_SLEEP || 500
}

export const timeZone = 'Asia/Tashkent'
