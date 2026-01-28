import React from 'react';
import logo from '../../assets/logo.png';

const LoadingGate = ({ children, isLoading }) => {
    if (!isLoading) return children;

    return (
        <div className="fixed inset-0 z-[9999] bg-reddit-bg flex flex-col items-center justify-center">
            <div className="relative">
                {/* Subtle pulse animation for the logo */}
                <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full animate-pulse-slow" />
                <img
                    src={logo}
                    alt="Studly"
                    className="w-16 h-16 object-contain animate-float relative z-10"
                />
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                .animate-float {
                    animation: float 2s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default LoadingGate;
