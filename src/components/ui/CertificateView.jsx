import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Award, Download, Share2, ShieldCheck, Sparkles, Loader2, Users, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';

const CertificateView = () => {
    const { getStudentCertificates, students } = useApp();
    const { user } = useAuth();
    const [downloading, setDownloading] = useState(null);
    const certificateRefs = useRef({});
    const captureRefs = useRef({});

    // Use logged-in student ID from auth context
    const currentStudentId = user?.id || 'ST-001';
    const currentStudent = students.find(s => s.id === currentStudentId) || {};
    const certificates = getStudentCertificates(currentStudentId);

    const handlePrint = () => {
        // Triggering the browser's native print dialog is the most reliable way to "save as PDF"
        // We'll use a print-specific CSS class to optimize the layout
        window.print();
    };

    const handleDownload = async (certId) => {
        const element = captureRefs.current[certId];
        if (!element) {
            console.error('Element not found for capture!');
            return;
        }

        setDownloading(certId);

        try {
            // Wait for full rendering
            await new Promise(resolve => setTimeout(resolve, 1000));

            const canvas = await html2canvas(element, {
                scale: 1, // Minimum scale for maximum reliability
                useCORS: true,
                backgroundColor: '#ffffff',
                width: 1120,
                height: 790,
                logging: true,
                removeContainer: true
            });

            // Using Blob for memory efficiency instead of large Data URL strings
            canvas.toBlob((blob) => {
                if (!blob) throw new Error('Blob creation failed');
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `Certificate_${certId}.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                setDownloading(null);
            }, 'image/png', 1.0);
            
        } catch (err) {
            console.error('Image Export Failure:', err);
            setDownloading(null);
            
            if (window.confirm('Image generation failed. Try the "Print" method instead? (Select "Save as PDF" in the destination)')) {
                handlePrint();
            }
        }
    };

    const handleShare = () => {
        alert('Sharing is not implemented in this demo');
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
            {/* Capture Layer - For Print/Image Export */}
            <div className="print-container" style={{ position: 'fixed', left: '-5000px', top: 0, opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                {certificates.map(cert => (
                    <div 
                        key={`capture-${cert.id}`} 
                        ref={el => captureRefs.current[cert.id] = el}
                        className="certificate-capture-area bg-white text-slate-900 flex flex-col items-center justify-between"
                        style={{ 
                            width: '1120px', 
                            height: '790px', 
                            padding: '60px', 
                            boxSizing: 'border-box',
                            border: '4px solid #f1f5f9' 
                        }}
                    >
                        <div className="w-full h-full border-2 border-slate-100 p-12 flex flex-col items-center justify-between relative bg-white">
                            {/* Simple CSS-based watermark (No SVG) */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                                <span style={{ fontSize: '400px', fontWeight: '900' }}>★</span>
                            </div>

                            <div className="z-10 w-full text-center">
                                <p style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.5em', color: '#94a3b8', fontWeight: '700', marginBottom: '24px' }}>
                                    Certificate of Achievement
                                </p>
                                <h1 style={{ fontSize: '72px', fontWeight: '900', color: '#0f172a', margin: '0 0 40px 0', lineHeight: '1.1' }}>
                                    {cert.certificateTitle || cert.achievement}
                                </h1>
                                
                                <p style={{ fontSize: '24px', fontStyle: 'italic', color: '#64748b', marginBottom: '16px', fontFamily: 'serif' }}>
                                    is hereby proudly presented to
                                </p>
                                <div style={{ borderBottom: '3px solid #0f172a', paddingBottom: '12px', marginBottom: '40px', display: 'inline-block' }}>
                                    <h2 style={{ fontSize: '56px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'capitalize', padding: '0 40px' }}>
                                        {currentStudent.name || cert.studentName}
                                    </h2>
                                </div>
                                
                                <p style={{ fontSize: '28px', color: '#334155', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                                    For demonstrating exceptional skills and dedication in the <strong style={{ color: '#0f172a' }}>{cert.competitionName}</strong>.
                                </p>

                                {cert.customMessage && (
                                    <p style={{ marginTop: '30px', fontSize: '20px', fontStyle: 'italic', color: '#64748b', maxWidth: '700px', margin: '30px auto 0' }}>
                                        "{cert.customMessage}"
                                    </p>
                                )}
                            </div>

                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 60px 40px', boxSizing: 'border-box' }}>
                                <div style={{ textAlign: 'center', width: '280px', borderTop: '2px solid #0f172a', paddingTop: '16px' }}>
                                    <p style={{ fontSize: '24px', fontStyle: 'italic', margin: '0 0 4px 0' }}>{cert.signatureName || cert.issuedBy}</p>
                                    <p style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Director Signature</p>
                                </div>
                                
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px double #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                        <span style={{ fontSize: '40px', color: '#7c3aed' }}>★</span>
                                    </div>
                                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8' }}>ID: {cert.id}</p>
                                </div>

                                <div style={{ textAlign: 'center', width: '280px', borderTop: '2px solid #0f172a', paddingTop: '16px' }}>
                                    <p style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 4px 0' }}>{cert.date}</p>
                                    <p style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Date Issued</p>
                                </div>
                            </div>

                            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: '0.4', marginTop: '20px' }}>
                                This is a digitally verified credential from the National Education Portal
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Display Layer (What the user sees) */}
            <div className="grid grid-cols-1 gap-8">
                {certificates.map((cert) => (
                    <div key={cert.id} className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
                        {/* Certificate Design Container for UI display only */}
                        <div 
                            ref={el => certificateRefs.current[cert.id] = el}
                            className={`relative w-full overflow-hidden flex flex-col items-center justify-center text-center ${
                                cert.template === 'Modern' ? 'bg-slate-900 text-slate-50' : 'bg-[#fdfbf7] text-slate-800'
                            }`}
                            style={{ minHeight: '620px', padding: '60px 40px' }}
                        >
                            <div className={`absolute inset-0 pointer-events-none ${cert.template === 'Modern' ? 'bg-slate-900' : 'bg-[#fdfbf7]'}`}></div>
                            <div className={`absolute inset-8 border-2 pointer-events-none rounded-lg z-0 ${cert.template === 'Modern' ? 'border-slate-800' : 'border-slate-200'}`}></div>
                            <div className={`absolute inset-10 border pointer-events-none rounded opacity-40 z-0 ${cert.template === 'Modern' ? 'border-slate-800' : 'border-slate-100'}`}></div>

                            <div className={`absolute top-12 left-12 w-16 h-16 border-t-[3px] border-l-[3px] rounded-tl-xl ${cert.template === 'Modern' ? 'border-primary-500/20' : 'border-violet-800/10'}`}></div>
                            <div className={`absolute top-12 right-12 w-16 h-16 border-t-[3px] border-r-[3px] rounded-tr-xl ${cert.template === 'Modern' ? 'border-primary-500/20' : 'border-violet-800/10'}`}></div>
                            <div className={`absolute bottom-12 left-12 w-16 h-16 border-b-[3px] border-l-[3px] rounded-bl-xl ${cert.template === 'Modern' ? 'border-primary-500/20' : 'border-violet-800/10'}`}></div>
                            <div className={`absolute bottom-12 right-12 w-16 h-16 border-b-[3px] border-r-[3px] rounded-br-xl ${cert.template === 'Modern' ? 'border-primary-500/20' : 'border-violet-800/10'}`}></div>

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
                                                        <span key={idx} className="font-medium font-serif text-lg text-slate-600 dark:text-slate-300">
                                                            {member.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="font-medium font-serif text-lg text-slate-600 dark:text-slate-300">
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
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <Sparkles size={14} className="text-amber-500" />
                                <span>High-Resolution Digital Credential</span>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => handlePrint(cert.id)}
                                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <Printer size={16} />
                                    Print
                                </button>
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
                                            Generating Image...
                                        </>
                                    ) : (
                                        <>
                                            <Download size={16} />
                                            Download Image
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
