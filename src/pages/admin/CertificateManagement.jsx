import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Download, Filter, Plus, List } from 'lucide-react';
import CertificateBuilder from '../../components/admin/CertificateBuilder';

const CertificateManagement = () => {
    const { certificates, competitions } = useApp();
    const [filterCompetition, setFilterCompetition] = useState('all');
    const [view, setView] = useState('list'); // 'list' or 'builder'

    const filteredCertificates = certificates.filter(cert => {
        if (filterCompetition === 'all') return true;
        return cert.competitionId === filterCompetition;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
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

                                    <div className="pt-2">
                                        <button className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2">
                                            <Download size={14} />
                                            Download Preview
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
