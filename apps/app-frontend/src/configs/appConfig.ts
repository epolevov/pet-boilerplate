const apiUrl = import.meta.env.VITE_API_URL;

const appConfig = {
  homePageUrl: '/home',
  api: apiUrl || 'http://localhost:8080',
};

export default appConfig;
