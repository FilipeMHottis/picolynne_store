import { useState } from "react";
import Navegate from "../components/navegate";
import FormProfile from "../components/formProfile";
import CustomersPanel from "../components/customerPanel";
import SaleHistory from "../components/saleHistory";
import { 
    UserIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    StoreIcon,
} from "lucide-react";

function Profile() {  
    const [pageContent, setPageContent] = useState("perfil");

    const handlePageChange = (page: string) => {
        setPageContent(page);
    }

    function renderPageContent() {
        switch (pageContent) {
            case "perfil":
                return (
                    <FormProfile />
                );
            case "clientes":
                return <CustomersPanel />;
            case "vendas":
                return <SaleHistory />;
            default:
                return <div className="text-center text-blue-600 font-medium">Página ainda não disponível.</div>;
        }
    }

    return (
        <div className="
            flex flex-col 
            items-center 
             min-h-screen
            bg-gradient-to-br from-blue-50 to-white 
            overflow-auto 
            px-4 
            pb-18
            pt-[calc(1rem+env(safe-area-inset-top))]"
        >
            
            <Navegate />

            <div className="relative sm:fixed sm:top-16 sm:left-1/2 sm:-translate-x-1/2 sm:z-40 bg-white/90 backdrop-blur-md border border-blue-100 rounded-2xl shadow-lg px-2 sm:px-4 pt-2 pb-3 w-full sm:w-auto mt-2">
                <nav className="flex flex-wrap justify-center gap-2">
                    {[
                        { key: "perfil", label: "Perfil", icon: <UserIcon className="w-5 h-5" /> },
                        { key: "clientes", label: "Clientes", icon: <ShoppingBagIcon className="w-5 h-5" /> },
                        { key: "vendas", label: "Vendas", icon: <ShoppingCartIcon className="w-5 h-5" /> },
                        { key: "novos-perfis", label: "Novos Perfis", icon: <StoreIcon className="w-5 h-5" /> },
                    ].map(({ key, label, icon }) => (
                        <button
                            key={key}
                            onClick={() => handlePageChange(key)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                                ${pageContent === key
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"}
                            `}
                        >
                            {icon}
                            <span className="font-semibold">{label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="pt-4 sm:pt-36 pb-20 sm:pb-24 px-2 sm:px-4 overflow-y-auto h-full w-full">
                {renderPageContent()}
            </div>
        </div>
    );
}

export default Profile;
