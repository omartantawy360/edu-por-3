import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';

const ConfirmDialog = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Confirm', 
    cancelText = 'Cancel',
    type = 'warning' // 'warning', 'danger', 'success'
}) => {
    if (!isOpen) return null;

    const typeStyles = {
        warning: {
            icon: AlertTriangle,
            iconColor: 'text-amber-600',
            iconBg: 'bg-amber-100',
            buttonClass: 'bg-amber-600 hover:bg-amber-700'
        },
        danger: {
            icon: XCircle,
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100',
            buttonClass: 'bg-red-600 hover:bg-red-700'
        },
        success: {
            icon: CheckCircle,
            iconColor: 'text-green-600',
            iconBg: 'bg-green-100',
            buttonClass: 'bg-green-600 hover:bg-green-700'
        }
    };

    const style = typeStyles[type];
    const Icon = style.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-soft-xl border border-border animate-scale-in">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${style.iconBg} shrink-0`}>
                            <Icon className={style.iconColor} size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50 mb-2">{title}</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600 shrink-0"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
                
                <div className="flex justify-end gap-3 px-6 pb-6 pt-2">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-6 py-2.5 text-white rounded-xl font-semibold transition-all shadow-lg ${style.buttonClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
