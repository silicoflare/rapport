// env.ts
export interface ENVType {
  DATABASE_URL: string;
  AUTH_SALT: string;
  PASSPHRASE: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  SERVER_PUBLIC_KEY: string;
  SERVER_PRIVATE_KEY: string;
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
  NEXTAUTH_URL: getEnv("NEXTAUTH_URL"),
  NEXTAUTH_SECRET: getEnv("NEXTAUTH_SECRET"),
  SERVER_PUBLIC_KEY: getEnv("SERVER_PUBLIC_KEY"),
  SERVER_PRIVATE_KEY: getEnv("SERVER_PRIVATE_KEY"),
};

export default env;
