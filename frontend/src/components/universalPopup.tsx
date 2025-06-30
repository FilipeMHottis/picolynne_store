import { XIcon } from "lucide-react";
import { ReactNode } from "react";

interface UniversalPopupProps {
    open: boolean;
    title: string;
    message: string | ReactNode;
    onClose: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
    singleButtonText?: string;
    confirmText?: string;
    cancelText?: string;
    doubleButtonMode?: boolean;
}

function UniversalPopup({
    open,
    title,
    message,
    onClose,
    onConfirm,
    onCancel,
    singleButtonText = "OK",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    doubleButtonMode = false,
}: UniversalPopupProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center border border-gray-200 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
                >
                    <XIcon className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-3 text-gray-800">{title}</h2>
                <div className="mb-5 text-gray-600">{message}</div>

                <div className="flex justify-center gap-3">
                    {doubleButtonMode ? (
                        <>
                            <button
                                onClick={onCancel}
                                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition"
                            >
                                {confirmText}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition"
                        >
                            {singleButtonText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UniversalPopup;
