import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Boxes, Tags, Layers, User } from "lucide-react";

function NavPhone() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const baseClasses = "flex flex-col items-center transition-colors";
  const activeClasses = "text-yellow-400";
  const inactiveClasses = "text-white hover:text-yellow-400";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-red-600 shadow-md px-4 py-2 flex justify-between items-center z-50 rounded-t-xl">
      <Link
        to="/"
        className={`${baseClasses} ${isActive("/") ? activeClasses : inactiveClasses}`}
      >
        <ShoppingCart size={22} />
        <span className="text-xs mt-1">Vendas</span>
      </Link>

      <Link
        to="/estoque"
        className={`${baseClasses} ${isActive("/estoque") ? activeClasses : inactiveClasses}`}
      >
        <Boxes size={22} />
        <span className="text-xs mt-1">Estoque</span>
      </Link>

      <Link
        to="/categorias"
        className={`${baseClasses} ${isActive("/categorias") ? activeClasses : inactiveClasses}`}
      >
        <Layers size={22} />
        <span className="text-xs mt-1">Categorias</span>
      </Link>

      <Link
        to="/tags"
        className={`${baseClasses} ${isActive("/tags") ? activeClasses : inactiveClasses}`}
      >
        <Tags size={22} />
        <span className="text-xs mt-1">Tags</span>
      </Link>

      <Link
        to="/perfil"
        className={`${baseClasses} ${isActive("/perfil") ? activeClasses : inactiveClasses}`}
      >
        <User size={22} />
        <span className="text-xs mt-1">Perfil</span>
      </Link>
    </nav>
  );
}

export default NavPhone;
