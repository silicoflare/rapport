// env.ts
export interface ENVType {
  DATABASE_URL: string;
  AUTH_SALT: string;
  PASSPHRASE: string;
  SECRET_KEY: string;
}

function getEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(`${name} not declared in .env`);
  }
  return val;
}

const env: ENVType = {
  DATABASE_URL: getEnv("DATABASE_URL"),
  AUTH_SALT: getEnv("AUTH_SALT"),
  PASSPHRASE: getEnv("PASSPHRASE"),
  SECRET_KEY: getEnv("SECRET_KEY")
}

export default env;
