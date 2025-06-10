import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Boxes, Tags, Layers, User } from "lucide-react";

function NavPc() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <nav
      className="
        bg-red-600 
        shadow-md 
        px-6 py-4 
        flex items-center justify-start gap-12
        fixed 
        w-full 
        top-0
        z-50
      "
    >
      <h1
        onClick={handleLogoClick}
        className="text-xl font-bold text-white cursor-pointer"
      >
        🍦 Picolynne Store
      </h1>

      <ul className="flex gap-8 text-white font-medium">
        <li>
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
          >
            <ShoppingCart size={20} />
            Vendas
          </Link>
        </li>
        <li>
          <Link
            to="/estoque"
            className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
          >
            <Boxes size={20} />
            Estoque
          </Link>
        </li>
        <li>
          <Link
            to="/categorias"
            className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
          >
            <Layers size={20} />
            Categorias
          </Link>
        </li>
        <li>
          <Link
            to="/tags"
            className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
          >
            <Tags size={20} />
            Tags
          </Link>
        </li>

        <li>
          <Link
            to="/perfil"
            className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
          >
            <User size={20} />
            Perfil
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavPc;
