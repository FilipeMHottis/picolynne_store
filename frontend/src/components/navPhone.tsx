import { Link } from "react-router-dom";
import { ShoppingCart, Boxes, Tags, Layers, User } from "lucide-react";

function NavPhone() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-red-600 shadow-md px-4 py-2 flex justify-between items-center z-50 rounded-t-xl">
      <Link
        to="/"
        className="flex flex-col items-center text-white hover:text-yellow-400 transition-colors"
      >
        <ShoppingCart size={22} />
        <span className="text-xs mt-1">Vendas</span>
      </Link>

      <Link
        to="/estoque"
        className="flex flex-col items-center text-white hover:text-yellow-400 transition-colors"
      >
        <Boxes size={22} />
        <span className="text-xs mt-1">Estoque</span>
      </Link>

      <Link
        to="/categorias"
        className="flex flex-col items-center text-white hover:text-yellow-400 transition-colors"
      >
        <Layers size={22} />
        <span className="text-xs mt-1">Categorias</span>
      </Link>

      <Link
        to="/tags"
        className="flex flex-col items-center text-white hover:text-yellow-400 transition-colors"
      >
        <Tags size={22} />
        <span className="text-xs mt-1">Tags</span>
      </Link>

      <Link
        to="/perfil"
        className="flex flex-col items-center text-white hover:text-yellow-400 transition-colors"
      >
        <User size={22} />
        <span className="text-xs mt-1">Perfil</span>
      </Link>
    </nav>
);
}

export default NavPhone;
