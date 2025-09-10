interface Config {
  API_ENDPOINT: string | undefined;
  API_KEY: string | undefined;
  TOKEN_KEY: string;
}

const config: Config = {
  API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT || 'https://web-production-a960.up.railway.app',
  API_KEY: process.env.REACT_APP_API_KEY,
  TOKEN_KEY: 'simple-budget-auth-token',
};

export default config;
