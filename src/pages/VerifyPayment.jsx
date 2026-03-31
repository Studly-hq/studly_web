import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../api/billing';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VerifyPayment = () => {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get('reference');
    const navigate = useNavigate();
    const { refetchUser } = useAuth(); // Assume we might need to refresh user profile/limits
    
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!reference) {
            setStatus('error');
            setMessage('No payment reference found.');
            return;
        }

        const verify = async () => {
            try {
                const result = await verifyPayment(reference);
                if (result.success) {
                    setStatus('success');
                    setMessage(result.message || 'Payment successful!');
                    if (refetchUser) {
                        try { await refetchUser(); } catch (e) {}
                    }
                    setTimeout(() => {
                        navigate('/study');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(result.message || 'Verification failed.');
                }
            } catch (error) {
                setStatus('error');
                setMessage(error?.response?.data?.message || 'An error occurred during verification.');
            }
        };

        verify();
    }, [reference, navigate, refetchUser]);

    return (
        <div className="min-h-screen bg-reddit-bg flex flex-col items-center justify-center p-4">
            <div className="bg-reddit-card border border-reddit-border rounded-2xl w-full max-w-md p-8 text-center shadow-xl">
                {status === 'verifying' && (
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="animate-spin text-reddit-orange w-12 h-12" />
                        <h2 className="text-xl font-bold text-white">Verifying Payment...</h2>
                        <p className="text-reddit-textMuted text-sm">Please wait while we confirm your transaction securely.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="text-green-500 w-16 h-16 mb-2" />
                        <h2 className="text-2xl font-bold text-white">Welcome to Premium!</h2>
                        <p className="text-reddit-textMuted">{message}</p>
                        <p className="text-sm text-reddit-textMuted mt-4">Redirecting you to Study Hub...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-300">
                        <XCircle className="text-red-500 w-16 h-16 mb-2" />
                        <h2 className="text-xl font-bold text-white">Payment Failed</h2>
                        <p className="text-red-400 font-medium">{message}</p>
                        <button 
                            onClick={() => navigate('/study')}
                            className="mt-6 px-6 py-2 bg-reddit-dark text-white rounded-lg hover:bg-reddit-border transition-colors font-medium border border-reddit-border"
                        >
                            Return to App
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyPayment;
