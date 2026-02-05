import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Download, Filter } from 'lucide-react';

const CertificateManagement = () => {
    const { certificates, competitions } = useApp();
    const [filterCompetition, setFilterCompetition] = useState('all');

    const filteredCertificates = certificates.filter(cert => {
        if (filterCompetition === 'all') return true;
        return cert.competitionId === filterCompetition;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50">Certificate Management</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage issued certificates</p>
            </div>

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
                    <div key={cert.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Certificate Preview */}
                        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/50 dark:to-primary-800/30 p-6 border-b-4 border-primary-600 dark:border-primary-500">
                            <div className="text-center">
                                <Award className="mx-auto text-primary-600 mb-3" size={40} />
                                <h3 className="font-bold text-slate-800 dark:text-slate-50 text-lg mb-1">{cert.achievement}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{cert.competitionName}</p>
                            </div>
                        </div>

                        {/* Certificate Details */}
                        <div className="p-4 space-y-2">
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Awarded To</p>
                                <p className="font-medium text-slate-800 dark:text-slate-50">{cert.studentName}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400">Date Issued</p>
                                    <p className="font-medium text-slate-700 dark:text-slate-200">{cert.date}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400">Issued By</p>
                                    <p className="font-medium text-slate-700 dark:text-slate-200">{cert.issuedBy}</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button className="w-full px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                                    <Download size={16} />
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCertificates.length === 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
                    <Award className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                    <p className="text-slate-400 dark:text-slate-500">No certificates issued yet</p>
                </div>
            )}
        </div>
    );
};

export default CertificateManagement;
