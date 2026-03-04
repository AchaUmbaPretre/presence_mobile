interface Config {
  REACT_APP_SERVER_DOMAIN: string;
}

const config: Config = {
  REACT_APP_SERVER_DOMAIN:
    process.env.REACT_APP_SERVER_DOMAIN || "http://localhost:3001",
};

export default config;
