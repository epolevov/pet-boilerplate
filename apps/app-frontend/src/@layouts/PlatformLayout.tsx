import { Outlet } from 'react-router-dom';
import Header from './components/Header';

const PlatformLayout = () => {
  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default PlatformLayout;
