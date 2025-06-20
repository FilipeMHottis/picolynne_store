import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Boxes, Tags, Layers, User } from "lucide-react";

function NavPhone() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const baseClasses = "flex flex-col items-center transition-all duration-200";
    const activeClasses = "text-yellow-400 border-t-2 border-yellow-400 pt-1";
    const inactiveClasses = "text-white hover:text-yellow-400";

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-red-600 shadow-md px-4 py-2 flex justify-between items-center z-50 rounded-t-xl">
            <Link
                to="/"
                className={`${baseClasses} ${isActive("/") ? activeClasses : inactiveClasses}`}
            >
                <ShoppingCart size={isActive("/") ? 26 : 22} />
                <span className={`text-xs mt-1 ${isActive("/") ? "font-bold" : ""}`}>
                    Vendas
                </span>
            </Link>

            <Link
                to="/estoque"
                className={`${baseClasses} ${isActive("/estoque") ? activeClasses : inactiveClasses}`}
            >
                <Boxes size={isActive("/estoque") ? 26 : 22} />
                <span className={`text-xs mt-1 ${isActive("/estoque") ? "font-bold" : ""}`}>
                    Estoque
                </span>
            </Link>

            <Link
                to="/categorias"
                className={`${baseClasses} ${isActive("/categorias") ? activeClasses : inactiveClasses}`}
            >
                <Layers size={isActive("/categorias") ? 26 : 22} />
                <span className={`text-xs mt-1 ${isActive("/categorias") ? "font-bold" : ""}`}>
                    Categorias
                </span>
            </Link>

            <Link
                to="/tags"
                className={`${baseClasses} ${isActive("/tags") ? activeClasses : inactiveClasses}`}
            >
                <Tags size={isActive("/tags") ? 26 : 22} />
                <span className={`text-xs mt-1 ${isActive("/tags") ? "font-bold" : ""}`}>
                    Tags
                </span>
            </Link>

            <Link
                to="/perfil"
                className={`${baseClasses} ${isActive("/perfil") ? activeClasses : inactiveClasses}`}
            >
                <User size={isActive("/perfil") ? 26 : 22} />
                <span className={`text-xs mt-1 ${isActive("/perfil") ? "font-bold" : ""}`}>
                    Perfil
                </span>
            </Link>
        </nav>
    );
}

export default NavPhone;
  // This component provides a responsive navigation bar for mobile devices.