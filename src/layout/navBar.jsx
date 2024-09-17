import { Wifi } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="w-full h-20 bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <NavLink to="/">
            <span className="font-bold text-xl sm:text-2xl tracking-tight">
              CEIT CYBER X NETWORK
            </span>
          </NavLink>
        </div>
        <div className="flex items-center space-x-2">
          <Wifi className="w-6 h-6" />
          <NavLink to="/file">
            <span className="font-semibold text-lg sm:text-xl">
              WIFI ACCESS
            </span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}