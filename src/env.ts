// env.ts
export interface ENVType {
  DATABASE_URL: string;
  AUTH_SALT: string;
  PASSPHRASE: string;
}

function getEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(`${name} not declared in .env`);
  }
  return val;
}

const env = {
  DATABASE_URL: getEnv("DATABASE_URL"),
  AUTH_SALT: getEnv("AUTH_SALT"),
  PASSPHRASE: getEnv("PASSPHRASE"),
}

export default env;
