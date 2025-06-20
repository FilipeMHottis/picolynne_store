import { useState, useEffect } from "react";
import { User } from "../types/user";
import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import StorageUtil from "../utils/storageUtil";
import Navegate from "../components/navegate";
import {
    User as UserIcon,
    Lock,
    ShieldCheck,
    Save,
    Eye,
    EyeOff,
} from "lucide-react";
import ProfilePopup from "../components/profilePopup";
import { useNavigate } from "react-router-dom";

function Profile() {
    const token = StorageUtil.getItem("token");
    const storedUser = StorageUtil.getItem("user");
    const username = storedUser?.username;
    const URL = BACKEND_URL + "/users";
    const navigate = useNavigate();
    
    const [user, setUser] = useState<User | undefined>(undefined);
    const [formData, setFormData] = useState<Partial<User>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const passwordsMatch = () => {
        return formData.password === confirmPassword && !!formData.password;
    };

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

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const response = await apiRequest<User>({
                method: "PUT",
                url: `${URL}/${user.id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    ...formData,
                    password: formData.password || user.password,
                },
            });
            setUser(response.data);
            setUpdateSuccess(true);
            setPopupOpen(true);
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            setUpdateSuccess(false);
            setPopupOpen(true);
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

            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 mt-6">
                <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                    Perfil do Usuário
                </h1>

                {user ? (
                    <form onSubmit={updateProfile} className="space-y-5">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <UserIcon className="w-4 h-4" />
                                Nome de usuário
                            </label>
                            <input
                                type="text"
                                value={formData.username || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </div>

                        
                        <div className="relative">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <Lock className="w-4 h-4" />
                                Nova senha 🔒
                            </label>

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Deixe em branco para manter a senha atual"
                                value={formData.password || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring focus:border-blue-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-[37px] text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>                           
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <Lock className="w-4 h-4" />
                                Confirme sua senha 🔁
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite novamente a nova senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                            />
                            {formData.password && confirmPassword && !passwordsMatch() && (
                                <p className="text-xs text-red-500 mt-1">
                                    ❌ A senha e a confirmação devem ser iguais.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <ShieldCheck className="w-4 h-4" />
                                Cargo 🛡️
                            </label>
                            <input
                                type="text"
                                value={formData.role || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, role: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                * O cargo é apenas informativo nesta versão.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={!passwordsMatch()}
                            className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition
                                ${passwordsMatch()
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                            `}
                        >
                            <Save className="w-5 h-5" />
                            Salvar Alterações 💾
                        </button>
                    </form>
                ) : (
                    <p className="text-center text-gray-600">🔄 Carregando perfil...</p>
                )}
            </div>
        </div>
    );
}

export default Profile;
