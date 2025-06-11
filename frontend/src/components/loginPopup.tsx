import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StorageUtil from '../utils/storageUtil';

export default function LoginPopup() {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const user = StorageUtil.getItem('user');
        if (!user) setShowPopup(true);
    }, []);

    if (!showPopup) return null;

    const handleLoginRedirect = () => {
        StorageUtil.clear();
        setShowPopup(false);
        navigate('/login');
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-white/30"
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center border border-gray-200"
                onClick={(e) => e.stopPropagation()} // evita propagação de clique
            >
                <h2 id="popup-title" className="text-2xl font-bold mb-3 text-gray-800">
                    Você não está logado
                </h2>
                <p className="mb-5 text-gray-600">
                    Faça login para continuar usando o aplicativo.
                </p>
                <button
                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition"
                    onClick={handleLoginRedirect}
                >
                    Ir para o login
                </button>
            </div>
        </div>
    );
}
