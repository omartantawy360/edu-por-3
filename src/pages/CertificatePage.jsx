import React from 'react';
import CertificateView from '../components/ui/CertificateView';

const CertificatePage = () => {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-50">My Certificates</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">View and download your achievement certificates</p>
            </div>
            <CertificateView />
        </div>
    );
};

export default CertificatePage;
