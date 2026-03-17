import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Award, Download, Share2, ShieldCheck, Sparkles, Loader2, Users } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const CertificateView = () => {
    const { getStudentCertificates, students } = useApp();
    const { user } = useAuth();
    const [downloading, setDownloading] = useState(null);
    const certificateRefs = useRef({});

    // Use logged-in student ID from auth context
    const currentStudentId = user?.id || 'ST-001';
    const currentStudent = students.find(s => s.id === currentStudentId) || {};
    const certificates = getStudentCertificates(currentStudentId);

    const handleDownload = async (certId) => {
        const element = certificateRefs.current[certId];
        if (!element) return;

        setDownloading(certId);

        try {
            // Give React time to ensure no hover states or transitions are active
            await new Promise(resolve => setTimeout(resolve, 300));

            const opt = {
                margin: 0,
                filename: `Certificate_${certId}.pdf`,
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: { 
                    scale: 1,
                    useCORS: true, 
                    logging: false,
                    letterRendering: true,
                    // Critical: ignore elements that cause hangs
                    ignoreElements: (el) => {
                        // Ignore buttons and other non-certificate UI
                        return el.classList.contains('no-print');
                    }
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape', compress: true }
            };

            // Modern html2pdf usage pattern
            const worker = html2pdf().set(opt).from(element);
            await worker.save();
            
            setDownloading(null);
        } catch (err) {
            console.error('PDF Generation Error:', err);
            setDownloading(null);
            alert('Failed to generate PDF. Try a different browser or check your connection.');
        }
    };

    const handleShare = () => {
        alert('Certificate sharing feature - In production, this would share via social media or email');
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
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="grid grid-cols-1 gap-8">
                {certificates.map((cert) => (
                    <div key={cert.id} className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
                        {/* Certificate Design Container for PDF generation */}
                        <div 
                            ref={el => certificateRefs.current[cert.id] = el}
                            className={`relative w-full overflow-hidden flex flex-col items-center justify-center text-center ${
                                cert.template === 'Modern' ? 'bg-slate-900 text-slate-50' : 'bg-[#fdfbf7] text-slate-800'
                            }`}
                            style={{ minHeight: '620px', padding: '60px 40px' }}
                        >
                            {/* Static Background (No gradients/patterns that might cause canvas issues) */}
                            <div className={`absolute inset-0 pointer-events-none ${cert.template === 'Modern' ? 'bg-slate-900' : 'bg-[#fdfbf7]'}`}></div>
                            
                            {/* Decorative Borders - Using outline/border instead of pseudo-elements for better capture */}
                            <div className={`absolute inset-8 border-2 pointer-events-none rounded-lg z-0 ${cert.template === 'Modern' ? 'border-slate-800' : 'border-slate-200'}`}></div>
                            <div className={`absolute inset-10 border pointer-events-none rounded opacity-40 z-0 ${cert.template === 'Modern' ? 'border-slate-800' : 'border-slate-100'}`}></div>

                            {/* Corners - Simplified for capture */}
                            <div className={`absolute top-12 left-12 w-16 h-16 border-t-[3px] border-l-[3px] rounded-tl-xl ${cert.template === 'Modern' ? 'border-primary-500/20' : 'border-violet-800/10'}`}></div>
                            <div className={`absolute top-12 right-12 w-16 h-16 border-t-[3px] border-r-[3px] rounded-tr-xl ${cert.template === 'Modern' ? 'border-primary-500/20' : 'border-violet-800/10'}`}></div>
                            <div className={`absolute bottom-12 left-12 w-16 h-16 border-b-[3px] border-l-[3px] rounded-bl-xl ${cert.template === 'Modern' ? 'border-primary-500/20' : 'border-violet-800/10'}`}></div>
                            <div className={`absolute bottom-12 right-12 w-16 h-16 border-b-[3px] border-r-[3px] rounded-br-xl ${cert.template === 'Modern' ? 'border-primary-500/20' : 'border-violet-800/10'}`}></div>

                            {/* Header Logo/Seal */}
                            <div className="mb-6 relative z-10 w-full flex justify-center">
                                <div className={`w-28 h-28 rounded-full flex items-center justify-center border-4 border-double shadow-sm relative ${
                                    cert.template === 'Modern' ? 'bg-slate-800 border-primary-500/50' : 'bg-gradient-to-br from-violet-50 to-white border-violet-200'
                                }`}>
                                    <Award className={cert.template === 'Modern' ? 'text-primary-400' : 'text-violet-600'} size={56} strokeWidth={1.5} />
                                    <div className="absolute -bottom-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 text-[10px] font-black px-4 py-1.5 rounded-full shadow-md uppercase tracking-[0.2em]">
                                        Verified
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 max-w-4xl relative z-10 px-4 md:px-12 mt-2 w-full">
                                <div>
                                    <p className={`text-sm md:text-base uppercase tracking-[0.4em] font-bold mb-3 ${cert.template === 'Modern' ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Certificate of Achievement
                                    </p>
                                    <h1 className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight ${
                                        cert.template === 'Modern' ? 'text-primary-400' : 'text-slate-900'
                                    }`}>
                                        {cert.certificateTitle || cert.achievement}
                                    </h1>
                                </div>

                                <div className="py-6 my-4 w-full flex flex-col items-center">
                                    <p className="text-slate-500 text-lg font-serif italic mb-2 tracking-wide">is hereby proudly presented to</p>
                                    <h2 className={`text-3xl md:text-4xl font-black pb-3 inline-block px-12 min-w-[350px] font-serif capitalize`} style={{ borderBottom: `2px solid ${cert.template === 'Modern' ? '#334155' : '#e2e8f0'}` }}>
                                        {currentStudent.name || cert.studentName}
                                    </h2>
                                    
                                    {/* Team Details Block */}
                                    {cert.recipientType === 'Team' && currentStudent.members && (
                                        <div className={`mt-6 flex flex-col items-center max-w-2xl px-8 py-4 rounded-2xl mx-auto shadow-sm border ${
                                            cert.template === 'Modern' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'
                                        }`}>
                                            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-3 flex items-center gap-2">
                                                <Users size={14} /> Team Members
                                            </h4>
                                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                                                {Array.isArray(currentStudent.members) ? (
                                                    currentStudent.members.map((member, idx) => (
                                                        <span key={idx} className="font-medium font-serif text-lg">
                                                            {member.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="font-medium font-serif text-lg">
                                                        {currentStudent.members}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className={`md:text-xl leading-relaxed max-w-3xl mx-auto font-serif tracking-wide ${cert.template === 'Modern' ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {cert.reason || "For demonstrating exceptional skills"} in the <span className="font-bold">{cert.competitionName}</span>.
                                    </p>
                                    {cert.customMessage && (
                                        <p className="mt-4 text-sm md:text-base italic font-serif opacity-80 max-w-2xl mx-auto">
                                            "{cert.customMessage}"
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col md:flex-row items-end justify-between gap-12 pt-16 px-4 md:px-16 w-full mx-auto">
                                    {/* Authority Signature */}
                                    <div className="flex-1 text-center flex flex-col items-center">
                                        <div className="h-16 flex items-end justify-center w-64 pb-2">
                                            <p className={`font-serif italic text-2xl ${cert.template === 'Modern' ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {cert.signatureName || cert.issuedBy}
                                            </p>
                                        </div>
                                        <div className={`w-64 border-t-2 mt-2 mb-2 ${cert.template === 'Modern' ? 'border-slate-700' : 'border-slate-800'}`}></div>
                                        <p className="text-sm font-bold uppercase tracking-widest">Director Signature</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{cert.issuedBy}</p>
                                    </div>

                                    {/* Date Seal */}
                                    <div className="flex-1 text-center flex flex-col items-center">
                                        <div className="h-16 flex items-end justify-center w-64 pb-2">
                                            <span className="font-serif text-2xl font-black">{cert.date}</span>
                                        </div>
                                        <div className={`w-64 border-t-2 mt-2 mb-2 ${cert.template === 'Modern' ? 'border-slate-700' : 'border-slate-800'}`}></div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm font-bold uppercase tracking-widest">Date Issued</p>
                                            <p className={`text-[10px] mt-2 flex items-center gap-1 justify-center uppercase font-bold tracking-widest px-3 py-1 rounded-full ${
                                                cert.template === 'Modern' ? 'bg-slate-800 text-primary-400' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                <ShieldCheck size={12} /> ID: {cert.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 opacity-40 text-[8px] uppercase tracking-[0.3em]">
                                    This certificate is digitally generated and verified by the National Education Portal
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <Sparkles size={14} className="text-amber-500" />
                                <span>High-Resolution Digital Credential</span>
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
                                    onClick={() => handleDownload(cert.id)}
                                    disabled={downloading === cert.id}
                                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-primary-600 min-w-[160px] hover:bg-primary-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {downloading === cert.id ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Generating PDF...
                                        </>
                                    ) : (
                                        <>
                                            <Download size={16} />
                                            Download PDF
                                        </>
                                    )}
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
