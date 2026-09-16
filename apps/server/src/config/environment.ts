const environments = ['development', 'test', 'production'] as const;

type Environment = (typeof environments)[number];

const requireString = (config: Record<string, unknown>, key: string) => {
  const value = config[key];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export function validateEnvironment(config: Record<string, unknown>) {
  const nodeEnvironment = (config.NODE_ENV ?? 'development') as Environment;

  if (!environments.includes(nodeEnvironment)) {
    throw new Error(`NODE_ENV must be one of: ${environments.join(', ')}`);
  }

  const port = Number(config.PORT ?? 3000);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return {
    ...config,
    NODE_ENV: nodeEnvironment,
    PORT: port,
    DATABASE_URL: requireString(config, 'DATABASE_URL'),
    SUPABASE_URL: requireString(config, 'SUPABASE_URL'),
    SUPABASE_PUBLISHABLE_KEY: requireString(config, 'SUPABASE_PUBLISHABLE_KEY'),
  };
}
