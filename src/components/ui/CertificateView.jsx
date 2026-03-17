import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Award, Download, Share2, Calendar, ShieldCheck, Sparkles, Loader2, Users } from 'lucide-react';

const CertificateView = () => {
    const { getStudentCertificates, students } = useApp();
    const { user } = useAuth();
    const [downloading, setDownloading] = useState(null);

    // Use logged-in student ID from auth context
    const currentStudentId = user?.id || 'ST-001';
    const currentStudent = students.find(s => s.id === currentStudentId) || {};
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

    const handleDownload = (certId) => {
        setDownloading(certId);
        setTimeout(() => {
            setDownloading(null);
            // In a real app, this would use html2canvas or jsPDF
        }, 1500);
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
        <div className="space-y-8 animate-fade-in">
            <style>{certificateStyles}</style>

            <div className="grid grid-cols-1 gap-8">
                {certificates.map((cert) => (
                    <div key={cert.id} className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-800">
                        {/* Certificate Design - always light (paper-like) for readability */}
                        <div className="relative bg-[#fdfbf7] p-8 md:p-12 certificate-content min-h-[500px] flex flex-col items-center justify-center text-center border-b border-slate-200">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
                            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-violet-700"></div>
                            
                            {/* Inner border for diploma look */}
                            <div className="absolute inset-4 border-2 border-slate-200 pointer-events-none rounded-lg z-0"></div>
                            <div className="absolute inset-5 border border-slate-100 pointer-events-none rounded opacity-50 z-0"></div>

                            {/* Decorative Corners */}
                            <div className="absolute top-6 left-6 w-16 h-16 border-t-[3px] border-l-[3px] border-violet-800/20 rounded-tl-2xl"></div>
                            <div className="absolute top-6 right-6 w-16 h-16 border-t-[3px] border-r-[3px] border-violet-800/20 rounded-tr-2xl"></div>
                            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-[3px] border-l-[3px] border-violet-800/20 rounded-bl-2xl"></div>
                            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-[3px] border-r-[3px] border-violet-800/20 rounded-br-2xl"></div>

                            {/* Header Logo/Seal Area */}
                            <div className="mb-6 relative z-10 w-full flex justify-center">
                                <div className="absolute left-8 top-0 hidden md:block opacity-80">
                                    <div className="w-20 h-20 rounded-full border border-slate-200 flex items-center justify-center p-2">
                                        <div className="w-full h-full rounded-full border border-dashed border-slate-300 flex items-center justify-center">
                                            <span className="font-serif font-black text-2xl text-slate-300">EC</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-50 to-white flex items-center justify-center border-4 border-double border-violet-200 shadow-sm relative">
                                    <Award className="text-violet-600" size={56} strokeWidth={1.5} />
                                    <div className="absolute -bottom-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 text-[10px] font-black px-4 py-1.5 rounded-full shadow-md uppercase tracking-[0.2em]">
                                        Verified
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 max-w-4xl relative z-10 px-4 md:px-12 mt-2 w-full">
                                <div>
                                    <p className="text-sm md:text-base uppercase tracking-[0.4em] text-slate-400 font-bold mb-3">Certificate of Achievement</p>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                                        {cert.achievement}
                                    </h1>
                                </div>

                                <div className="py-6 my-4 w-full flex flex-col items-center">
                                    <p className="text-slate-500 text-lg font-serif italic mb-2 tracking-wide">is hereby proudly presented to</p>
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 pb-3 inline-block px-12 min-w-[350px] font-serif capitalize" style={{ borderBottom: '2px solid #e2e8f0' }}>
                                        {currentStudent.type === 'Team' 
                                            ? (Array.isArray(currentStudent.members) 
                                                ? currentStudent.members[0]?.name 
                                                : (typeof currentStudent.members === 'string' ? currentStudent.members.split(',')[0] : currentStudent.name))
                                            : cert.studentName}
                                    </h2>
                                    
                                    {/* Team Details Block */}
                                    {currentStudent.type === 'Team' && currentStudent.members && currentStudent.members.length > 0 && (
                                        <div className="mt-6 flex flex-col items-center max-w-2xl bg-slate-50 border border-slate-100 px-8 py-4 rounded-2xl mx-auto shadow-sm">
                                            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-3 flex items-center gap-2">
                                                <Users size={14} /> Team Members - {currentStudent.teamName || 'Team'}
                                            </h4>
                                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                                                {Array.isArray(currentStudent.members) ? (
                                                    currentStudent.members.map((member, idx) => (
                                                        <span key={idx} className="font-medium text-slate-700 font-serif text-lg">
                                                            {member.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="font-medium text-slate-700 font-serif text-lg">
                                                        {currentStudent.members}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-slate-600 md:text-xl leading-relaxed max-w-3xl mx-auto font-serif tracking-wide">
                                        For outstanding performance, dedication, and demonstrating exceptional problem-solving skills in the <span className="font-bold text-slate-900">{cert.competitionName}</span>.
                                    </p>
                                </div>

                                <div className="flex flex-col md:flex-row items-end justify-between gap-12 pt-16 px-4 md:px-16 w-full mx-auto">
                                    {/* Issued By Signature */}
                                    <div className="flex-1 text-center flex flex-col items-center">
                                        <div className="h-16 flex items-end justify-center w-64">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png"
                                                alt="Signature" className="h-12 opacity-80" style={{ filter: 'grayscale(100%) contrast(200%)' }}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                        <div className="w-64 border-t-2 border-slate-800 mt-2 mb-2"></div>
                                        <p className="text-sm font-bold text-slate-800 uppercase tracking-widest">Director Signature</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{cert.issuedBy}</p>
                                    </div>

                                    {/* Date Seal */}
                                    <div className="flex-1 text-center flex flex-col items-center">
                                        <div className="h-16 flex items-end justify-center w-64 pb-2">
                                            <span className="text-slate-800 font-serif text-2xl font-black">{cert.date}</span>
                                        </div>
                                        <div className="w-64 border-t-2 border-slate-800 mt-2 mb-2"></div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm font-bold text-slate-800 uppercase tracking-widest">Date Issued</p>
                                            <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1 justify-center uppercase font-bold tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                                                <ShieldCheck size={12} className="text-violet-600" /> ID: {cert.id}
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
                                    disabled={downloading === cert.id}
                                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <Share2 size={16} />
                                    Share
                                </button>
                                <button
                                    onClick={() => handleDownload(cert.id)}
                                    disabled={downloading === cert.id}
                                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-violet-600 min-w-[160px] hover:bg-violet-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
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
