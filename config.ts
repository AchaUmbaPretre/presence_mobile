interface Config {
  REACT_APP_SERVER_DOMAIN: string;
}

const config: Config = {
  REACT_APP_SERVER_DOMAIN:
    process.env.REACT_APP_SERVER_DOMAIN || "http:192.168.1.111:8080",
};

export default config;
