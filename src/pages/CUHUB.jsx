import { motion } from 'framer-motion';
import { ExternalLink, BookOpen } from 'lucide-react';

const CUHUB = () => {
    const CUHUB_URL = 'https://cuhub.usestudly.com';

    return (
        <div className="w-full h-full bg-reddit-bg overflow-hidden flex flex-col pt-2">
            <iframe 
                src={CUHUB_URL}
                className="w-full flex-1 border-none bg-reddit-card rounded-t-xl"
                title="CUHUB"
                allow="clipboard-read; clipboard-write"
            />
        </div>
    );
};

export default CUHUB;
