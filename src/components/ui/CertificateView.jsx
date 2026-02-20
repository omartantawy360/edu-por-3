import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Award, Download, Share2, Calendar, ShieldCheck, Sparkles } from 'lucide-react';

const CertificateView = () => {
    const { getStudentCertificates, addNotification } = useApp();
    const { user } = useAuth();

    // Use logged-in student ID from auth context
    const currentStudentId = user?.id || 'ST-001';
    const certificates = getStudentCertificates(currentStudentId);

    // Inline styles to force black text in dark mode for certificates (paper look)
    const certificateStyles = `
        .certificate-content {
            color: #1e293b !important;
        }
        .certificate-content h1, .certificate-content h2, .certificate-content h3 {
            color: #0f172a !important;
        }
    `;

    const handleDownload = () => {
        addNotification('Certificate download feature will be available shortly after verification.', 'info');
    };

    const handleShare = () => {
        addNotification('Certificate sharing feature will be available shortly.', 'info');
    };

    if (certificates.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-16 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
                    <Award size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No Certificates Yet</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Complete competitions and achieve high rankings to earn certificates of achievement!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <style>{certificateStyles}</style>

            <div className="grid grid-cols-1 gap-8">
                {certificates.map((cert) => (
                    <div key={cert.id} className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-800">
                        {/* Certificate Design - always light (paper-like) for readability */}
                        <div className="relative bg-[#fdfbf7] p-8 md:p-12 certificate-content min-h-[500px] flex flex-col items-center justify-center text-center border-b border-slate-200">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500"></div>

                            {/* Decorative Corners */}
                            <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-amber-500/30 rounded-tl-xl"></div>
                            <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-amber-500/30 rounded-tr-xl"></div>
                            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-amber-500/30 rounded-bl-xl"></div>
                            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-amber-500/30 rounded-br-xl"></div>

                            {/* Seal */}
                            <div className="mb-6 relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-yellow-50 flex items-center justify-center border-4 border-double border-amber-200 shadow-inner">
                                    <Award className="text-amber-600 drop-shadow-sm" size={48} />
                                </div>
                                <div className="absolute -bottom-2 md:-right-10 md:bottom-2 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider transform md:rotate-12">
                                    Verified
                                </div>
                            </div>

                            <div className="space-y-6 max-w-3xl relative z-10">
                                <div>
                                    <p className="text-sm md:text-base uppercase tracking-[0.3em] text-slate-500 font-bold mb-2">Certificate of</p>
                                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                                        {cert.achievement}
                                    </h1>
                                </div>

                                <div className="py-4">
                                    <p className="text-slate-600 text-lg font-serif italic mb-4">is proudly presented to</p>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 inline-block px-10 min-w-[300px]">
                                        {cert.studentName}
                                    </h2>
                                </div>

                                <div>
                                    <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
                                        For outstanding performance and demonstrating exceptional skills in the <span className="font-bold text-slate-900">{cert.competitionName}</span>.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-12 pt-12 mt-4 px-8 w-full max-w-2xl mx-auto">
                                    <div className="text-center">
                                        <div className="h-12 flex items-end justify-center pb-2">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png"
                                                alt="Signature" className="h-10 opacity-60 grayscale"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                        <div className="w-full border-t border-slate-400 mb-2"></div>
                                        <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Director Signature</p>
                                        <p className="text-xs text-slate-500 mt-1">{cert.issuedBy}</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="h-12 flex items-end justify-center pb-2">
                                            <span className="text-slate-800 font-serif text-lg">{cert.date}</span>
                                        </div>
                                        <div className="w-full border-t border-slate-400 mb-2"></div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Date Issued</p>
                                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 justify-center">
                                                <ShieldCheck size={10} /> Official Record
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <Sparkles size={14} className="text-amber-500" />
                                <span>Digital Verified Credential</span>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={handleShare}
                                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <Share2 size={16} />
                                    Share
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={16} />
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CertificateView;
