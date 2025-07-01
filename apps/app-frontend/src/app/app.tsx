import { Route, Routes } from 'react-router-dom';
import PlatformLayout from '../@layouts/PlatformLayout';
import BlankLayout from '../@layouts/BlankLayout';
import AuthGuard from '../hocs/AuthGuard';

import GuestOnlyRoute from '../hocs/GuestOnlyRoute';
import AuthPage from './(guest-only)/auth/page';
import SignUpPage from './(guest-only)/signup/page';
import ProfileDetailPage from './(platform)/profile/[id]/page';
import UserSettingsPage from './(platform)/user/settings/page';
import HomePage from './(platform)/home/page';
import HomeRedirect from '../components/redirects/HomeRedirect';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route
        element={
          <GuestOnlyRoute>
            <BlankLayout />
          </GuestOnlyRoute>
        }
      >
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>
      <Route
        element={
          <AuthGuard>
            <PlatformLayout />
          </AuthGuard>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile/:id" element={<ProfileDetailPage />} />
        <Route path="/user/settings" element={<UserSettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
