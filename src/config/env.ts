import envVar from 'env-var';
import { config } from 'dotenv';

config();

export const env = {
    nodeEnv: envVar.get('NODE_ENV').default('development').asString(),
    port: envVar.get('PORT').default('4000').asPortNumber(),
    logger: envVar.get('LOGGER').default('false').asBoolStrict(),
    host: envVar.get('HOST').default('0.0.0.0').asString(),

    database: {
        url: envVar.get("DATABASE_URL").required().asString(),
    },

    google: {
        clientId: envVar.get("GOOGLE_CLIENT_ID").required().asString(),
        clientSecret: envVar.get("GOOGLE_CLIENT_SECRET").required().asString(),
    },

    jwt: {
        jwtSecret: envVar.get("JWT_SECRET").required().asString(),
    },
};