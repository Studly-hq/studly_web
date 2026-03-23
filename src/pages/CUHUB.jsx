import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const CUHUB = () => {
    const CUHUB_URL = 'https://cuhub.usestudly.com';
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="w-full h-full bg-reddit-bg overflow-hidden flex flex-col pt-2 relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-reddit-bg z-10">
                    <Loader2 className="animate-spin text-reddit-orange" size={48} />
                </div>
            )}
            <iframe 
                src={CUHUB_URL}
                className={`w-full flex-1 border-none bg-reddit-card rounded-t-xl transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                title="CUHUB"
                allow="clipboard-read; clipboard-write"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

export default CUHUB;
