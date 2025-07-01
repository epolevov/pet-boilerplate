// Config Imports
import appConfig from '../../configs/appConfig';
import { Navigate } from 'react-router-dom';

const HomeRedirect = () => {
  const homePage = appConfig.homePageUrl;

  return <Navigate to={homePage} replace />;
};

export default HomeRedirect;
