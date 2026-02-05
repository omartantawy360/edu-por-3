import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Award, Eye, Filter, Sparkles } from 'lucide-react';
import AddAchievementModal from '../../components/ui/AddAchievementModal';

const StudentManagement = () => {
    const { students, competitions, getStudentSubmissions, getStudentCertificates, issueCertificate } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [showAchievementModal, setShowAchievementModal] = useState(false);
    const [certificateForm, setCertificateForm] = useState({
        competitionId: '',
        achievement: 'Participation'
    });

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleIssueCertificate = () => {
        if (!selectedStudent || !certificateForm.competitionId) return;
        
        const competition = competitions.find(c => c.id === certificateForm.competitionId);
        
        issueCertificate({
            studentId: selectedStudent.id,
            studentName: selectedStudent.name,
            competitionId: certificateForm.competitionId,
            competitionName: competition?.name || '',
            achievement: certificateForm.achievement
        });
        
        setShowCertificateModal(false);
        setCertificateForm({ competitionId: '', achievement: 'Participation' });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50">Student Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage student information</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search students by name or ID..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Competition</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Result</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredStudents.map((student) => {
                                const submissions = getStudentSubmissions(student.id);
                                const certificates = getStudentCertificates(student.id);
                                
                                return (
                                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-slate-50">{student.name}</div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">{student.id} • {student.school}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-900 dark:text-slate-50">{student.competition}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{student.type}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                student.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                student.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-medium ${
                                                student.result === 'Passed' ? 'text-green-600' :
                                                student.result === 'Failed' ? 'text-red-600' :
                                                'text-slate-400'
                                            }`}>
                                                {student.result}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setShowCertificateModal(true);
                                                    }}
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                    title="Issue Certificate"
                                                >
                                                    <Award size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setShowAchievementModal(true);
                                                    }}
                                                    className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                                                    title="Add Achievement"
                                                >
                                                    <Sparkles size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Student Details Modal */}
            {selectedStudent && !showCertificateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50">{selectedStudent.name}</h3>
                                <p className="text-slate-500 dark:text-slate-400">{selectedStudent.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">School</p>
                                    <p className="font-medium">{selectedStudent.school}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Grade & Class</p>
                                    <p className="font-medium">Grade {selectedStudent.grade}, Class {selectedStudent.clazz}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Competition</p>
                                    <p className="font-medium">{selectedStudent.competition}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Type</p>
                                    <p className="font-medium">{selectedStudent.type}</p>
                                </div>
                            </div>

                            {selectedStudent.projectTitle && (
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Project</p>
                                    <p className="font-medium">{selectedStudent.projectTitle}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{selectedStudent.abstract}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Submissions</p>
                                {getStudentSubmissions(selectedStudent.id).length > 0 ? (
                                    <div className="space-y-2">
                                        {getStudentSubmissions(selectedStudent.id).map(sub => (
                                            <div key={sub.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                <p className="font-medium text-sm">{sub.title}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{sub.status} • {sub.date}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 dark:text-slate-500">No submissions yet</p>
                                )}
                            </div>

                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Certificates</p>
                                {getStudentCertificates(selectedStudent.id).length > 0 ? (
                                    <div className="space-y-2">
                                        {getStudentCertificates(selectedStudent.id).map(cert => (
                                            <div key={cert.id} className="p-3 bg-green-50 dark:bg-emerald-950/40 rounded-lg border border-green-200 dark:border-emerald-800">
                                                <p className="font-medium text-sm">{cert.competitionName}</p>
                                                <p className="text-xs text-green-700">{cert.achievement} • {cert.date}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 dark:text-slate-500">No certificates issued</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Issue Certificate Modal */}
            {showCertificateModal && selectedStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50 mb-4">Issue Certificate</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Student</label>
                                <input
                                    type="text"
                                    value={selectedStudent.name}
                                    disabled
                                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Competition</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                    value={certificateForm.competitionId}
                                    onChange={e => setCertificateForm({...certificateForm, competitionId: e.target.value})}
                                >
                                    <option value="">Select Competition</option>
                                    {competitions.map(comp => (
                                        <option key={comp.id} value={comp.id}>{comp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Achievement</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                    value={certificateForm.achievement}
                                    onChange={e => setCertificateForm({...certificateForm, achievement: e.target.value})}
                                >
                                    <option value="First Place">First Place</option>
                                    <option value="Second Place">Second Place</option>
                                    <option value="Third Place">Third Place</option>
                                    <option value="Honorable Mention">Honorable Mention</option>
                                    <option value="Participation">Participation</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={() => {
                                        setShowCertificateModal(false);
                                        setCertificateForm({ competitionId: '', achievement: 'Participation' });
                                    }}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleIssueCertificate}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    Issue Certificate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Achievement Modal */}
            {showAchievementModal && selectedStudent && (
                <AddAchievementModal
                    student={selectedStudent}
                    onClose={() => {
                        setShowAchievementModal(false);
                        setSelectedStudent(null);
                    }}
                />
            )}
        </div>
    );
};

export default StudentManagement;
