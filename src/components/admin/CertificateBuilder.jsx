import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
    Award, 
    User, 
    Users, 
    Calendar, 
    Type, 
    FileText, 
    Send, 
    CheckCircle2, 
    Plus,
    Minus,
    Layout,
    Signature,
    PenTool
} from 'lucide-react';

const CertificateBuilder = () => {
    const { students, competitions, issueCertificate } = useApp();
    const [success, setSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        recipientType: 'Individual',
        recipientId: '',
        competitionId: '',
        certificateTitle: 'Certificate of Excellence',
        reason: 'Outstanding Performance',
        customMessage: 'In recognition of your exceptional dedication and significant contributions to this competition.',
        date: new Date().toISOString().split('T')[0],
        signatureName: 'Dr. Sarah Mitchell',
        template: 'Classic'
    });

    const activeRecipient = useMemo(() => {
        if (!formData.recipientId) return null;
        return students.find(s => s.id === formData.recipientId);
    }, [formData.recipientId, students]);

    const activeCompetition = useMemo(() => {
        if (!formData.competitionId) return null;
        return competitions.find(c => c.id === formData.competitionId);
    }, [formData.competitionId, competitions]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleIssue = () => {
        if (!formData.recipientId || !formData.competitionId) {
            alert('Please select a recipient and a competition.');
            return;
        }

        const certData = {
            ...formData,
            studentId: activeRecipient.id,
            studentName: activeRecipient.name,
            competitionName: activeCompetition.name,
        };

        issueCertificate(certData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fade-in">
            {/* Form Section */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-soft border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                            <PenTool size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50">Certificate Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Recipient Type */}
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recipient Type</label>
                            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                {['Individual', 'Team'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData(prev => ({ ...prev, recipientType: type, recipientId: '' }))}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                                            formData.recipientType === type
                                                ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                        }`}
                                    >
                                        {type === 'Individual' ? <User size={16} /> : <Users size={16} />}
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recipient Selection */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select {formData.recipientType}</label>
                            <div className="relative">
                                <select
                                    name="recipientId"
                                    value={formData.recipientId}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-slate-800 dark:text-slate-200"
                                >
                                    <option value="">Select recipient...</option>
                                    {students
                                        .filter(s => s.type === formData.recipientType)
                                        .map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                                        ))
                                    }
                                </select>
                                <div className="absolute left-3 top-3 text-slate-400">
                                    <User size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Competition Selection */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Competition</label>
                            <div className="relative">
                                <select
                                    name="competitionId"
                                    value={formData.competitionId}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-slate-800 dark:text-slate-200"
                                >
                                    <option value="">Select competition...</option>
                                    {competitions.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <div className="absolute left-3 top-3 text-slate-400">
                                    <Award size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Certificate Title */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Certificate Title</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="certificateTitle"
                                    value={formData.certificateTitle}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Winner, Participation"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-slate-800 dark:text-slate-200"
                                />
                                <div className="absolute left-3 top-3 text-slate-400">
                                    <Type size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Achievement Reason */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Reason / Achievement</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Outstanding Performance"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-slate-800 dark:text-slate-200"
                                />
                                <div className="absolute left-3 top-3 text-slate-400">
                                    <FileText size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Custom Message */}
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Custom Message</label>
                            <textarea
                                name="customMessage"
                                value={formData.customMessage}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-slate-800 dark:text-slate-200 resize-none font-serif italic"
                            ></textarea>
                        </div>

                        {/* Date */}
                        <div className="space-y-2 md:col-span-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Issue Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-slate-800 dark:text-slate-200"
                                />
                                <div className="absolute left-3 top-3 text-slate-400">
                                    <Calendar size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Signature */}
                        <div className="space-y-2 md:col-span-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Authority Name (Signature)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="signatureName"
                                    value={formData.signatureName}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-slate-800 dark:text-slate-200"
                                />
                                <div className="absolute left-3 top-3 text-slate-400">
                                    <Signature size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleIssue}
                            disabled={success}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md group ${
                                success 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                            }`}
                        >
                            {success ? (
                                <>
                                    <CheckCircle2 size={22} className="animate-bounce" />
                                    Certificate Issued Successfully!
                                </>
                            ) : (
                                <>
                                    <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Issue Dynamic Certificate
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Templates Selector */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-soft border border-slate-200 dark:border-slate-800">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
                            <Layout size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50">Select Template</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {['Classic', 'Modern'].map((template) => (
                            <button
                                key={template}
                                onClick={() => setFormData(prev => ({ ...prev, template }))}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                                    formData.template === template
                                        ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 grayscale opacity-60'
                                }`}
                            >
                                <div className={`w-12 h-16 border-2 border-slate-300 rounded-sm relative overflow-hidden ${template === 'Classic' ? 'bg-[#fdfbf7]' : 'bg-slate-900'}`}>
                                     <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>
                                     <div className="w-4 h-4 rounded-full border border-slate-200 absolute top-2 left-1/2 -translate-x-1/2"></div>
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{template} Style</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="relative">
                <div className="sticky top-6">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Layout size={16} /> Live Preview
                        </span>
                        <span className="text-xs font-medium text-slate-400 py-1 px-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                            Draft Mode
                        </span>
                    </div>

                    <div className="certificate-preview-container bg-white dark:bg-slate-800 rounded-[2.5rem] p-4 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform-gpu transition-all duration-700">
                        {/* THE CERTIFICATE DESIGN */}
                        <div className={`relative aspect-[1.414/1] w-full shadow-inner overflow-hidden rounded-[1.5rem] p-6 text-center flex flex-col items-center justify-center transition-colors duration-500 ${
                            formData.template === 'Classic' ? 'bg-[#fdfbf7] text-slate-800' : 'bg-slate-900 text-slate-50'
                        }`}>
                            {/* Decorative Background for Preview */}
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
                            
                            {/* Border */}
                            <div className={`absolute inset-4 border-2 pointer-events-none rounded-lg z-0 ${formData.template === 'Classic' ? 'border-primary-200/50' : 'border-slate-700'}`}></div>
                            <div className={`absolute inset-5 border pointer-events-none rounded opacity-30 z-0 ${formData.template === 'Classic' ? 'border-primary-100' : 'border-slate-800'}`}></div>

                            {/* Header */}
                            <div className="mb-4 relative z-10 scale-75 lg:scale-100">
                                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center border-2 border-double shadow-sm ${
                                    formData.template === 'Classic' ? 'bg-white border-primary-200 text-primary-600' : 'bg-slate-800 border-primary-500 text-primary-400'
                                }`}>
                                    <Award size={32} strokeWidth={1.5} />
                                </div>
                                <p className={`text-[10px] uppercase tracking-[0.4em] font-bold mt-4 ${formData.template === 'Classic' ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Official Credential
                                </p>
                            </div>

                            <div className="space-y-3 z-10 px-4">
                                <h1 className={`text-2xl lg:text-3xl font-serif font-bold tracking-tight leading-tight ${formData.template === 'Modern' ? 'text-primary-400' : 'text-slate-800'}`}>
                                    {formData.certificateTitle || "Certificate Title"}
                                </h1>
                                
                                <p className="text-slate-500 text-sm font-serif italic">is hereby presented to</p>
                                
                                <h2 className="text-xl lg:text-2xl font-black pb-2 inline-block px-8 min-w-[200px] font-serif capitalize" style={{ borderBottom: `2px solid ${formData.template === 'Classic' ? '#e2e8f0' : '#334155'}` }}>
                                    {activeRecipient?.name || "Recipient Name"}
                                </h2>

                                <p className={`text-xs lg:text-sm leading-relaxed max-w-sm mx-auto font-serif ${formData.template === 'Classic' ? 'text-slate-600' : 'text-slate-400'}`}>
                                    {formData.reason || "For your achievement"} in the <span className="font-bold">{activeCompetition?.name || "Competition Name"}</span>.
                                </p>

                                <p className={`mt-4 text-[10px] lg:text-xs leading-relaxed max-w-sm mx-auto italic font-serif opacity-70 ${formData.template === 'Classic' ? 'text-slate-500' : 'text-slate-500'}`}>
                                    "{formData.customMessage}"
                                </p>
                            </div>

                            {/* Signatures for Preview */}
                            <div className="flex items-end justify-between w-full mt-6 px-4 lg:px-12 scale-90">
                                <div className="text-center">
                                    <div className="h-8 flex items-end justify-center">
                                        <p className="font-serif italic text-sm opacity-60">{formData.signatureName}</p>
                                    </div>
                                    <div className={`w-32 border-t mt-1 ${formData.template === 'Classic' ? 'border-slate-300' : 'border-slate-700'}`}></div>
                                    <p className="text-[8px] uppercase font-bold tracking-wider mt-1 opacity-50">Director Signature</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-serif font-black">{formData.date}</p>
                                    <div className={`w-32 border-t mt-1 ${formData.template === 'Classic' ? 'border-slate-300' : 'border-slate-700'}`}></div>
                                    <p className="text-[8px] uppercase font-bold tracking-wider mt-1 opacity-50">Date Issued</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/30">
                        <p className="text-xs text-primary-700 dark:text-primary-400 flex items-center gap-2">
                             <CheckCircle2 size={14} />
                             Dynamic fields will automatically resize to fit the certificate layout.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateBuilder;
