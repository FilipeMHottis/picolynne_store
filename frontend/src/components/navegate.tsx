import { Link, useNavigate } from "react-router-dom";

function Navegate() {
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
            flex items-center justify-start gap-8
            fixed 
            w-full 
            top-0 md:top-0 md:bottom-auto 
            bottom-0 md:flex-row flex-col 
            md:h-auto h-16
            z-50
        "
    >
        <h1
            onClick={handleLogoClick}
            className="text-xl font-bold text-white cursor-pointer"
        >
            🍦 Picolynne Store
        </h1>

        <ul className="flex md:flex-row flex-col gap-6 text-white font-medium md:mt-0 mt-2">
            <li>
            <Link to="/" className="hover:text-yellow-400 transition-colors">
                Vendas
            </Link>
            </li>
            <li>
            <Link to="/" className="hover:text-yellow-400 transition-colors">
                Estoque
            </Link>
            </li>
            <li>
            <Link to="/" className="hover:text-yellow-400 transition-colors">
                Caregotias
            </Link>
            </li>
            <li>
            <Link to="/" className="hover:text-yellow-400 transition-colors">
                Tags
            </Link>
            </li>
        </ul>
    </nav>

  );
}

export default Navegate;
