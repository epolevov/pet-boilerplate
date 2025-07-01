import { useState, useRef, useEffect, MouseEvent } from 'react';
import { User, UserCircle, Home } from 'lucide-react';
import { useStoreMap } from 'effector-react';
import authMeStore, { reset } from '../../store/auth/me';
import authConfig from '../../configs/authConfig';
import { patchAxiosAuthorization } from '../../@core/utils/userToken';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Header = () => {
  const push = useNavigate();
  const data = useStoreMap({
    store: authMeStore,
    keys: [],
    fn: (store) => store.data,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogOut = () => {
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    patchAxiosAuthorization(null);
    reset();
    setTimeout(() => push('/auth'), 100);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        // event.target can be Node or Window; ensure it’s an Element
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside as any);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as any);
    };
  }, []);

  return (
    <header className="w-full mx-auto shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <Link
              to="/"
              className="flex items-center justify-center p-2 rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="View Wave"
            >
              <Home className="h-6 w-6 text-gray-100" />
            </Link>
          </div>

          <div className="flex gap-2">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-center p-2 rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="User Menu"
              >
                <User className="h-8 w-8 text-gray-100" />
              </button>

              {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-500">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <button
                      className="block w-full text-left mb-2  text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <div className="flex gap-2 border-b border-gray-200 px-4 py-2">
                        <Link
                          onClick={toggleDropdown}
                          to={`/profile/${data?._id}`}
                        >
                          <UserCircle
                            aria-hidden="true"
                            className="h-12 w-12 text-gray-700"
                          />
                        </Link>
                        <div>
                          <p className="text-gray-800">{data?.fullName}</p>
                          <p className="text-gray-500">{data?.role}</p>
                        </div>
                      </div>
                    </button>
                    <Link
                      to="/user/settings"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={toggleDropdown}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
