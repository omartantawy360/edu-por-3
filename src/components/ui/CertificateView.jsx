import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Download, Share2, Calendar } from 'lucide-react';

const CertificateView = () => {
    const { getStudentCertificates } = useApp();
    
    // For demo: assume logged-in student is ST-001
    const currentStudentId = 'ST-001';
    const certificates = getStudentCertificates(currentStudentId);

    // Inline styles to force black text in dark mode for certificates
    const certificateStyles = `
        .certificate-content * {
            color: black !important;
        }
    `;

    const handleDownload = () => {
        alert('Certificate download feature - In production, this would generate a PDF');
    };

    const handleShare = () => {
        alert('Certificate sharing feature - In production, this would share via social media or email');
    };

    if (certificates.length === 0) {
        return (
            <div className="rounded-2xl border border-border dark:border-slate-700/50 bg-card shadow-soft p-16 text-center">
                <div className="inline-flex p-6 rounded-3xl bg-primary/5 mb-4">
                    <Award className="text-slate-300 dark:text-slate-500" size={56} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No Certificates Yet</h3>
                <p className="text-slate-600 dark:text-slate-300 max-w-sm mx-auto">Complete competitions to earn certificates!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <style>{certificateStyles}</style>
            {certificates.map((cert) => (
                <div key={cert.id} className="rounded-2xl overflow-hidden border border-border dark:border-slate-700/50 bg-card shadow-soft-lg hover:shadow-soft-xl transition-shadow">
                    {/* Certificate Design - always light (paper-like) for readability */}
                    <div className="relative bg-gradient-to-br from-slate-50 via-white to-amber-50/40 dark:from-slate-100 dark:via-white dark:to-amber-50/20 p-12 certificate-content">
                        {/* Decorative Corners */}
                        <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-primary-500 rounded-tl-2xl"></div>
                        <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-primary-500 rounded-tr-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-primary-500 rounded-bl-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-primary-500 rounded-br-2xl"></div>

                        {/* Certificate Content */}
                        <div className="text-center space-y-6 relative z-10">
                            <div className="inline-block p-5 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50">
                                <Award className="text-primary-600" size={48} />
                            </div>
                            
                            <div>
                                <p className="text-sm uppercase tracking-widest text-black font-semibold">Certificate of</p>
                                <h1 className="text-4xl font-bold text-black mt-2">{cert.achievement}</h1>
                            </div>

                            <div className="py-4">
                                <p className="text-black mb-2">This certificate is proudly presented to</p>
                                <h2 className="text-3xl font-bold text-black">{cert.studentName}</h2>
                            </div>

                            <div className="max-w-2xl mx-auto">
                                <p className="text-black leading-relaxed">
                                    For outstanding performance and achievement in the <span className="font-semibold text-black">{cert.competitionName}</span>
                                </p>
                            </div>

                            <div className="flex justify-center items-center gap-12 pt-8">
                                <div className="text-center">
                                    <div className="w-40 border-t-2 border-black mb-2"></div>
                                    <p className="text-sm text-black">Authorized Signature</p>
                                    <p className="text-xs text-black mt-1">{cert.issuedBy}</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center gap-2 text-black">
                                        <Calendar size={16} />
                                        <span className="text-sm">{cert.date}</span>
                                    </div>
                                    <p className="text-xs text-black mt-1">Date of Issue</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 py-5 flex gap-4 justify-center border-t border-border bg-slate-50/80 dark:bg-slate-800/50">
                        <button
                            onClick={handleDownload}
                            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-soft hover:shadow-soft-md transition-all duration-300 flex items-center gap-2 btn-lift"
                        >
                            <Download size={18} />
                            Download PDF
                        </button>
                        <button
                            onClick={handleShare}
                            className="px-6 py-3 rounded-xl font-semibold bg-slate-600 hover:bg-slate-500 text-white transition-all duration-300 flex items-center gap-2"
                        >
                            <Share2 size={18} />
                            Share
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CertificateView;
