import { CheckCircle, XCircle, LogIn } from "lucide-react";

interface ProfilePopupProps {
    open: boolean;
    success: boolean;
    onClose: () => void;
}

function ProfilePopup({ open, success, onClose }: ProfilePopupProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center space-y-4">
                <div className="flex flex-col items-center">
                    {success ? (
                        <>
                            <CheckCircle className="w-12 h-12 text-green-500" />
                            <h2 className="text-lg font-semibold mt-2 text-green-700">
                                ✨ Perfil atualizado com sucesso!
                            </h2>
                        </>
                    ) : (
                        <>
                            <XCircle className="w-12 h-12 text-red-500" />
                            <h2 className="text-lg font-semibold mt-2 text-red-700">
                                ❌ Erro ao atualizar perfil.
                            </h2>
                        </>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <LogIn className="w-5 h-5" />
                    Refazer login
                </button>
            </div>
        </div>
    );
}

export default ProfilePopup;
