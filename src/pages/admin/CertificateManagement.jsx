import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Download, Filter, Plus, List, Loader2, ShieldCheck, Sparkles, Printer } from 'lucide-react';
import CertificateBuilder from '../../components/admin/CertificateBuilder';
import html2canvas from 'html2canvas';

const CertificateManagement = () => {
    const { certificates, competitions, students } = useApp();
    const [filterCompetition, setFilterCompetition] = useState('all');
    const [view, setView] = useState('list'); // 'list' or 'builder'
    const [downloading, setDownloading] = useState(null);
    const captureRefs = useRef({});

    const handlePrint = () => {
        window.print();
    };

    const filteredCertificates = certificates.filter(cert => {
        if (filterCompetition === 'all') return true;
        return cert.competitionId === filterCompetition;
    });

    const handleDownload = async (certId) => {
        const element = captureRefs.current[certId];
        if (!element) {
            console.error('Element not found for capture!');
            return;
        }

        setDownloading(certId);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const canvas = await html2canvas(element, {
                scale: 1,
                useCORS: true,
                backgroundColor: '#ffffff',
                width: 1120,
                height: 790,
                logging: true,
                removeContainer: true
            });

            canvas.toBlob((blob) => {
                if (!blob) throw new Error('Blob creation failed');
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `Certificate_${certId}.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                setDownloading(null);
            }, 'image/png');
            
        } catch (err) {
            console.error('Image Export Failure:', err);
            setDownloading(null);
            if (window.confirm('Image generation failed. Try the "Print" method?')) {
                handlePrint();
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Hidden Capture Layer - Forced visibility during capture but moved off-screen */}
            <div className="fixed left-[-2000px] top-0 pointer-events-none print-container" aria-hidden="true">
                {certificates.map(cert => {
                    const student = students.find(s => s.id === cert.studentId) || {};
                    return (
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
                                            {student.name || cert.studentName}
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
                    );
                })}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-50">Certificate Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">View, manage and issue dynamic certificates</p>
                </div>
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                    <button
                        onClick={() => setView('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            view === 'list'
                                ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                    >
                        <List size={18} />
                        Issued
                    </button>
                    <button
                        onClick={() => setView('builder')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            view === 'builder'
                                ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                    >
                        <Plus size={18} />
                        New Certificate
                    </button>
                </div>
            </div>

            {view === 'builder' ? (
                <CertificateBuilder />
            ) : (
                <>
                    {/* Filter */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                        <div className="flex items-center gap-3">
                            <Filter size={20} className="text-slate-400" />
                            <select
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                value={filterCompetition}
                                onChange={(e) => setFilterCompetition(e.target.value)}
                            >
                                <option value="all">All Competitions</option>
                                {competitions.map(comp => (
                                    <option key={comp.id} value={comp.id}>{comp.name}</option>
                                ))}
                            </select>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Showing {filteredCertificates.length} certificate(s)
                            </span>
                        </div>
                    </div>

                    {/* Certificates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCertificates.map((cert) => (
                            <div key={cert.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow group">
                                {/* Certificate Card Header */}
                                <div className={`h-2 bg-primary-600 ${cert.template === 'Modern' ? 'bg-slate-700' : ''}`}></div>
                                
                                <div className="p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                                            <Award size={20} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">ID</p>
                                            <p className="text-xs font-mono font-bold text-slate-500">{cert.id}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-50 line-clamp-1">{cert.certificateTitle || cert.achievement}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cert.competitionName}</p>
                                    </div>

                                    <div className="pt-2 border-t border-slate-50 dark:border-slate-800 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Recipient</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{cert.studentName}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Issued</span>
                                            <span className="text-slate-600 dark:text-slate-400">{cert.date}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Style</span>
                                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                                                {cert.template || 'Classic'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex gap-2">
                                        <button 
                                            onClick={() => handlePrint(cert.id)}
                                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs font-bold flex items-center justify-center gap-2"
                                        >
                                            <Printer size={14} />
                                            Print
                                        </button>
                                        <button 
                                            onClick={() => handleDownload(cert.id)}
                                            disabled={downloading === cert.id}
                                            className="flex-[2] px-3 py-2 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {downloading === cert.id ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                <Download size={14} />
                                            )}
                                            {downloading === cert.id ? 'Generating...' : 'Download Image'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCertificates.length === 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
                            <Award className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                            <p className="text-slate-400 dark:text-slate-500 font-medium">No certificates have been issued yet</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CertificateManagement;
