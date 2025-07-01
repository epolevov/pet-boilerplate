import { useLocation } from 'react-router-dom';
import appConfig from '../../configs/appConfig';
import { Navigate } from 'react-router-dom';

const AuthRedirect = () => {
  const { pathname } = useLocation();

  // ℹ️ Bring me `lang`
  const redirectUrl = `/auth?redirectTo=${pathname}`;
  const login = `/auth`;
  const homePage = appConfig.homePageUrl;

  return (
    <Navigate
      to={
        pathname === login ? login : pathname === homePage ? login : redirectUrl
      }
      replace
    />
  );
};

export default AuthRedirect;
