import { useState, useEffect } from "react";
import { User } from "../types/user";
import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import StorageUtil from "../utils/storageUtil";
import Navegate from "../components/navegate";
import ProfilePopup from "../components/profilePopup";
import { useNavigate } from "react-router-dom";
import FormProfile from "../components/formProfile";
import CostumersPanel from "../components/customerPanel";
import { 
    UserIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    StoreIcon,
} from "lucide-react";

function Profile() {
    const token = StorageUtil.getItem("token");
    const storedUser = StorageUtil.getItem("user");
    const username = storedUser?.username;
    const URL = BACKEND_URL + "/users";
    const navigate = useNavigate();
    
    const [user, setUser] = useState<User | undefined>(undefined);
    const [formData, setFormData] = useState<Partial<User>>({});
    const [popupOpen, setPopupOpen] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [pageContent, setPageContent] = useState("perfil");

    const handlePageChange = (page: string) => {
        setPageContent(page);
    }

    function renderPageContent() {
        switch (pageContent) {
            case "perfil":
                return (
                    <FormProfile
                        user={user} 
                        setUser={setUser}
                        formData={formData}
                        setFormData={setFormData}
                        setPopupOpen={setPopupOpen}
                        setUpdateSuccess={setUpdateSuccess}
                    />
                );
            case "clientes":
                return <CostumersPanel />;
            default:
                return <div className="text-gray-500">Pagina não funcioal!</div>;
        }
    }

    
    const handleClosePopup = () => {
        setPopupOpen(false);
        StorageUtil.clear(); 
        navigate("/login");
    };

    const fetchProfile = async () => {
        try {
            const response = await apiRequest<User>({
                method: "GET",
                url: `${URL}/username/${username}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data);
            setFormData({ ...response.data, password: "" }); // não mostra senha
        } catch (error) {
            console.error("Erro ao buscar perfil do usuário:", error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="
            flex flex-col 
            items-center 
            justify-center 
            min-h-screen
            bg-gradient-to-br from-blue-50 to-white 
            overflow-auto 
            px-4 
            pb-18
            pt-[calc(1rem+env(safe-area-inset-top))]
        ">
            <Navegate />
            <ProfilePopup
                open={popupOpen}
                success={updateSuccess}
                onClose={handleClosePopup}
            />

            <nav className="flex gap-4 mb-8 flex-wrap justify-center">
                <button
                    onClick={() => handlePageChange("perfil")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm transition-all duration-200
                        ${pageContent === "perfil"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"}
                    `}
                >
                    <UserIcon className="w-5 h-5" />
                    Perfil
                </button>

                <button
                    onClick={() => handlePageChange("clientes")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm transition-all duration-200
                        ${pageContent === "clientes"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"}
                    `}
                >
                    <ShoppingBagIcon className="w-5 h-5" />
                    Clientes
                </button>

                <button
                    onClick={() => handlePageChange("vendas")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm transition-all duration-200
                        ${pageContent === "vendas"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"}
                    `}
                >
                    <ShoppingCartIcon className="w-5 h-5" />
                    Vendas
                </button>

                <button
                    onClick={() => handlePageChange("novos-perfis")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm transition-all duration-200
                        ${pageContent === "novos-perfis"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"}
                    `}
                >
                    <StoreIcon className="w-5 h-5" />
                    Novos Perfis
                </button>
            </nav>


            {renderPageContent()}
        </div>
    );
}

export default Profile;
