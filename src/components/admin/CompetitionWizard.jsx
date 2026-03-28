import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useJudge } from '../../context/JudgeContext';
import {
  Trophy, Users, FileText, CheckCircle, XCircle, ChevronRight, ChevronLeft,
  Send, Eye, Star, Gavel, BarChart3, Lock, AlertCircle, Globe, Rocket,
  ThumbsUp, ThumbsDown, Search, Filter, RotateCcw
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { COMPETITION_PHASES, RESULTS_VISIBILITY, LEADERBOARD_STATUS } from '../../context/AppContext';

/* ─────────────────────────────────────────── */
/*  WIZARD STEPPER                             */
/* ─────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Select', icon: Trophy },
  { id: 2, label: 'Registrations', icon: Users },
  { id: 3, label: 'Submissions', icon: Gavel },
  { id: 4, label: 'Publish', icon: Rocket },
];

function WizardStepper({ currentStep }) {
  return (
    <div className="flex items-center gap-0 w-full mb-8">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isComplete = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className={cn(
                'h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm',
                isComplete ? 'bg-violet-600 border-violet-600 text-white shadow-violet-500/30' :
                isCurrent  ? 'bg-white dark:bg-slate-900 border-violet-500 text-violet-600 scale-110 shadow-lg' :
                             'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
              )}>
                {isComplete ? <CheckCircle size={18} /> : <Icon size={16} />}
              </div>
              <span className={cn(
                'text-[10px] font-bold uppercase tracking-widest',
                isCurrent  ? 'text-violet-600 dark:text-violet-400' :
                isComplete ? 'text-slate-600 dark:text-slate-400' :
                             'text-slate-400 dark:text-slate-600'
              )}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 -mt-5 transition-all duration-500',
                currentStep > step.id ? 'bg-violet-500' : 'bg-slate-200 dark:bg-slate-700'
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  STATUS BADGE HELPER                        */
/* ─────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    Approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Pending:  'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400',
    Rejected: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',
    Passed:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Failed:   'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',
  };
  return (
    <span className={cn('px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-flex items-center', map[status] || 'bg-slate-100 text-slate-600')}>
      {status}
    </span>
  );
}

/* ─────────────────────────────────────────── */
/*  STEP 1 — SELECT COMPETITION & STAGE       */
/* ─────────────────────────────────────────── */
function Step1({ competitions, selectedComp, setSelectedComp, selectedStage, setSelectedStage, selectedRubric, onRubricSelect }) {
  const comp = competitions.find(c => c.id === selectedComp);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 pb-4">
        <div className="h-16 w-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto">
          <Trophy size={32} className="text-violet-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Choose a Competition</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Select the competition and the stage you want to manage.</p>
      </div>

      <div className="grid gap-3 max-w-xl mx-auto">
        {competitions.map(c => (
          <button
            key={c.id}
            onClick={() => { setSelectedComp(c.id); setSelectedStage(''); }}
            className={cn(
              'w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 group',
              selectedComp === c.id
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg shadow-violet-500/10'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-900/10'
            )}
          >
            <div className={cn(
              'h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors',
              selectedComp === c.id ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600'
            )}>
              <Trophy size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{c.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-[9px] uppercase font-bold">{c.phase}</Badge>
                <span className="text-xs text-slate-400">{c.stages?.length || 0} stages</span>
              </div>
            </div>
            {selectedComp === c.id && <CheckCircle size={20} className="text-violet-600 shrink-0" />}
          </button>
        ))}
      </div>

      {comp && (
        <div className="max-w-xl mx-auto space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Stage</label>
          <div className="grid gap-2">
            {(comp.stages || []).map(stage => {
              // Defensive: stage might be a string in demo/legacy data
              const sName = typeof stage === 'string' ? stage : (stage.name || 'Unnamed Stage');
              const sStatus = typeof stage === 'string' ? 'Upcoming' : (stage.status || 'Upcoming');
              const sDates = typeof stage === 'string' ? '' : `${stage.startDate || ''} – ${stage.endDate || ''}`;

              return (
                <button
                  key={sName}
                  onClick={() => setSelectedStage(sName)}
                  className={cn(
                    'w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center justify-between',
                    selectedStage === sName
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-violet-300'
                  )}
                >
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{sName}</p>
                    {sDates.trim() !== '–' && (
                      <p className="text-xs text-slate-400 mt-0.5">{sDates}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase',
                      sStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      sStatus === 'Open'      ? 'bg-blue-100 text-blue-700' :
                                               'bg-slate-100 text-slate-500'
                    )}>{sStatus}</span>
                    {selectedStage === sName && <CheckCircle size={16} className="text-violet-600" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Rubric Selection - NEW */}
      {comp && (
        <div className="max-w-xl mx-auto space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Judging Rubric</label>
              <Badge variant="outline" className="text-[10px] font-bold">Step 1b</Badge>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'standard', name: 'Standard', desc: 'Balanced 40pt' },
                { id: 'science',  name: 'Science',  desc: 'Research 40pt' },
                { id: 'coding',   name: 'Coding',   desc: 'Technical 40pt' }
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => onRubricSelect(r.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    selectedRubric === r.id 
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
                      : "border-slate-100 dark:border-slate-800 hover:border-indigo-300 bg-white dark:bg-slate-900"
                  )}
                >
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{r.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{r.desc}</p>
                </button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  STEP 2 — REGISTRATION REVIEW              */
/* ─────────────────────────────────────────── */
function Step2({ compStudents, updateStudentStatus, updateStudentStage, selectedStage }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState([]);

  const filtered = compStudents.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id) => setSelected(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
  const allSelected = filtered.length > 0 && filtered.every(s => selected.includes(s.id));
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map(s => s.id));

  const bulkApprove = () => {
    selected.forEach(id => {
      updateStudentStatus(id, 'Approved');
      if (selectedStage) updateStudentStage(id, selectedStage);
    });
    setSelected([]);
  };

  const counts = {
    all: compStudents.length,
    Pending: compStudents.filter(s => s.status === 'Pending').length,
    Approved: compStudents.filter(s => s.status === 'Approved').length,
    Rejected: compStudents.filter(s => s.status === 'Rejected').length,
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Registration Review</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Approve or reject students for the selected stage.</p>
        </div>
        {selected.length > 0 && (
          <Button onClick={bulkApprove} size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 shrink-0">
            <CheckCircle size={14} /> Bulk Approve ({selected.length})
          </Button>
        )}
      </div>

      {/* Stats pills */}
      <div className="flex flex-wrap gap-2">
        {['all', 'Pending', 'Approved', 'Rejected'].map(f => (
          <button key={f} onClick={() => setFilterStatus(f)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-bold border transition-all',
              filterStatus === f
                ? 'bg-violet-600 border-violet-600 text-white'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-violet-300'
            )}>
            {f === 'all' ? 'All' : f} · {counts[f] ?? counts.all}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search students…"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-slate-400" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={allSelected} onChange={toggleAll}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Student</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Grade</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-slate-400 text-sm">No students found</td></tr>
            ) : filtered.map(s => (
              <tr key={s.id} className={cn('transition-colors', selected.includes(s.id) ? 'bg-violet-50/50 dark:bg-violet-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30')}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)}
                    className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer" />
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.id} · {s.type}</p>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-slate-600 dark:text-slate-400">Grade {s.grade}{s.clazz}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {s.status !== 'Approved' && (
                      <button onClick={() => { updateStudentStatus(s.id, 'Approved'); if (selectedStage) updateStudentStage(s.id, selectedStage); }}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Approve">
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {s.status !== 'Rejected' && (
                      <button onClick={() => updateStudentStatus(s.id, 'Rejected')}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Reject">
                        <XCircle size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 text-center">{filtered.length} student{filtered.length !== 1 ? 's' : ''} shown</p>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  STEP 3 — SUBMISSIONS & SCORING             */
/* ─────────────────────────────────────────── */
function Step3({ compStudents, selectedCompId, setStudentResult, addScore, getCompetitionSubmissions, scores }) {
  const { getAverageScore } = useJudge();
  const approved = compStudents.filter(s => s.status === 'Approved');
  const submissions = getCompetitionSubmissions(selectedCompId);
  const [expandedId, setExpandedId] = useState(null);
  const [localScores, setLocalScores] = useState({});
  const [saved, setSaved] = useState({});

  const getLocal = (sid) => localScores[sid] || { innovation: 0, design: 0, presentation: 0, technical: 0 };
  const setField = (sid, field, val) => {
    let n = parseInt(val) || 0;
    if (n < 0) n = 0; if (n > 10) n = 10;
    setLocalScores(prev => ({ ...prev, [sid]: { ...getLocal(sid), [field]: n } }));
    setSaved(prev => ({ ...prev, [sid]: false }));
  };
  const totalFor = (sid) => { const s = getLocal(sid); return s.innovation + s.design + s.presentation + s.technical; };

  const saveScore = (sid, compId) => {
    const sc = getLocal(sid);
    addScore(sid, compId, { ...sc, total: totalFor(sid) });
    setSaved(prev => ({ ...prev, [sid]: true }));
  };

  const passedCount = approved.filter(s => s.result === 'Passed').length;
  const failedCount = approved.filter(s => s.result === 'Failed').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Submissions & Scoring</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Score each approved student and mark them as Passed or Failed.</p>
        </div>
        <div className="flex gap-2 text-xs font-bold">
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full">{passedCount} Passed</span>
          <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full">{failedCount} Failed</span>
          <span className="px-3 py-1.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-full">{approved.length - passedCount - failedCount} Pending</span>
        </div>
      </div>

      {approved.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <AlertCircle size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500">No approved students yet.</p>
          <p className="text-xs text-slate-400 mt-1">Go back to Step 2 and approve students first.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {approved.map((s, idx) => {
            const sub = submissions.find(sb => sb.studentId === s.id);
            const existingScore = scores.find(sc => sc.studentId === s.id && sc.competitionId === selectedCompId);
            const sc = localScores[s.id] ? getLocal(s.id) : (existingScore || { innovation: 0, design: 0, presentation: 0, technical: 0 });
            const total = sc.innovation + sc.design + sc.presentation + sc.technical;
            const isExpanded = expandedId === s.id;

            return (
              <div key={s.id} className={cn(
                'rounded-2xl border-2 transition-all duration-200 overflow-hidden',
                s.result === 'Passed' ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10' :
                s.result === 'Failed' ? 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10' :
                'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              )}>
                {/* Header row */}
                <div className="flex items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.id} · {sub ? sub.title : 'No submission found'}</p>
                  </div>

                  {/* Score pill */}
                  <div className="text-right shrink-0 flex items-center gap-4">
                    {/* Judge Score Badge */}
                    {(() => {
                      const judgeData = getAverageScore(sub?.id);
                      if (!judgeData) return null;
                      return (
                        <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-center">
                          <p className="text-[8px] font-black text-indigo-500 uppercase tracking-tighter">Judge Avg</p>
                          <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400">{judgeData.averageTotal}</p>
                        </div>
                      );
                    })()}
                    <div>
                      <div className="text-xl font-black text-violet-600 dark:text-violet-400">{total}<span className="text-xs font-normal text-slate-400">/40</span></div>
                      <div className="h-1.5 w-16 rounded-full bg-slate-200 dark:bg-slate-700 mt-1 overflow-hidden">
                        <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${(total / 40) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Result badge */}
                  {s.result && s.result !== '-' ? (
                    <StatusBadge status={s.result} />
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">Pending</span>
                  )}

                  {/* Expand toggle */}
                  <button onClick={() => setExpandedId(isExpanded ? null : s.id)}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400">
                    {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                  </button>
                </div>

                {/* Expandable body */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-5 animate-in fade-in slide-in-from-top-1 duration-200">
                    {/* Submission link */}
                    {sub && (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><FileText size={11} /> Submission</p>
                        <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">{sub.title}</p>
                        {sub.url && (
                          <a href={sub.url} target="_blank" rel="noreferrer"
                            className="text-xs text-violet-600 hover:text-violet-700 underline underline-offset-2 break-all">{sub.url}</a>
                        )}
                        {sub.description && <p className="text-xs text-slate-500 mt-2 line-clamp-3">{sub.description}</p>}
                      </div>
                    )}

                    {/* Rubric scoring */}
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Star size={11} /> Evaluation Rubric</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { key: 'innovation',   label: 'Innovation' },
                          { key: 'design',       label: 'Design' },
                          { key: 'presentation', label: 'Presentation' },
                          { key: 'technical',    label: 'Technical' },
                        ].map(item => (
                          <div key={item.key} className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{item.label} <span className="text-slate-400">(10)</span></label>
                            <input type="number" min="0" max="10"
                              value={sc[item.key]}
                              onChange={e => setField(s.id, item.key, e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 text-center font-bold" />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-sm font-black text-violet-600 dark:text-violet-400">Total: {total} / 40</p>
                        <Button size="sm" variant={saved[s.id] ? 'outline' : 'default'} onClick={() => saveScore(s.id, selectedCompId)} className="gap-1.5">
                          {saved[s.id] ? <><CheckCircle size={13} className="text-emerald-500" /> Saved</> : <><Send size={13} /> Save Score</>}
                        </Button>
                      </div>
                    </div>

                    {/* Pass / Fail */}
                    <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => setStudentResult(s.id, 'Passed')}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all',
                          s.result === 'Passed'
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800'
                        )}>
                        <ThumbsUp size={16} /> Pass
                      </button>
                      <button
                        onClick={() => setStudentResult(s.id, 'Failed')}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all',
                          s.result === 'Failed'
                            ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800'
                        )}>
                        <ThumbsDown size={16} /> Fail
                      </button>
                      {(s.result === 'Passed' || s.result === 'Failed') && (
                        <button onClick={() => setStudentResult(s.id, '-')}
                          className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" title="Reset">
                          <RotateCcw size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  STEP 4 — PREVIEW & PUBLISH                 */
/* ─────────────────────────────────────────── */
function Step4({ compStudents, selectedCompId, selectedComp, selectedStage, updateCompetitionPhase, updateCompetitionVisibility, updateLeaderboardStatus, finalizeCompetitionResults, scores, onPublishDone }) {
  const approved = compStudents.filter(s => s.status === 'Approved');
  const pendingResult = approved.filter(s => !s.result || s.result === '-');
  const canPublish = pendingResult.length === 0 && approved.length > 0;

  const ranked = useMemo(() => {
    return [...approved]
      .map(s => {
        const sc = scores.find(x => x.studentId === s.id && x.competitionId === selectedCompId);
        return { ...s, totalScore: sc?.total || 0 };
      })
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [approved, scores, selectedCompId]);

  const [published, setPublished] = useState(false);

  const handlePublish = () => {
    updateCompetitionPhase(selectedCompId, COMPETITION_PHASES.RESULTS_PUBLISHED);
    updateCompetitionVisibility(selectedCompId, RESULTS_VISIBILITY.PUBLISHED);
    updateLeaderboardStatus(selectedCompId, LEADERBOARD_STATUS.FINAL);
    setPublished(true);
    if (onPublishDone) setTimeout(onPublishDone, 2000);
  };

  if (published) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
          <Rocket size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Results Published!</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Students have been notified and can now see their results on their dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Preview & Publish Results</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Review the final rankings below. Once you publish, students will be notified immediately.</p>
      </div>

      {/* Warning if some students still pending */}
      {pendingResult.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>{pendingResult.length} student{pendingResult.length > 1 ? 's' : ''}</strong> still have no Pass/Fail result. Go back to Step 3 to mark them before publishing.
          </p>
        </div>
      )}

      {/* Competition summary card */}
      {selectedComp && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center gap-4">
          <Trophy size={28} />
          <div>
            <p className="font-bold text-lg">{selectedComp.name}</p>
            <p className="text-white/70 text-sm">Stage: {selectedStage} · {approved.length} participants</p>
          </div>
        </div>
      )}

      {/* Ranked results table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider w-14">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Student</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Score</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {ranked.map((s, idx) => (
              <tr key={s.id} className={cn(
                'transition-colors',
                idx === 0 ? 'bg-amber-50/50 dark:bg-amber-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
              )}>
                <td className="px-4 py-3">
                  <div className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center font-black text-sm',
                    idx === 0 ? 'bg-amber-400 text-white' :
                    idx === 1 ? 'bg-slate-400 text-white' :
                    idx === 2 ? 'bg-orange-700 text-white' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  )}>
                    {idx + 1}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.id}</p>
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  <div className="inline-flex flex-col items-center">
                    <span className="font-black text-violet-600 dark:text-violet-400">{s.totalScore}</span>
                    <span className="text-[10px] text-slate-400">/40</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={s.result} />
                </td>
              </tr>
            ))}
            {ranked.length === 0 && (
              <tr><td colSpan={4} className="text-center py-10 text-slate-400 text-sm">No approved participants yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Finalize Results Action */}
      {!published && !ranked.some(s => s.isWinner) && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 border-dashed text-center space-y-3">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Winning projects have not been identified for this competition yet.</p>
          <Button 
            onClick={() => finalizeCompetitionResults(selectedCompId)}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
          >
            Identify Winners & Finalize
          </Button>
        </div>
      )}

      {/* Publish button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handlePublish}
          disabled={!canPublish}
          className={cn(
            'flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300',
            canPublish
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          )}
        >
          <Globe size={18} />
          Publish Results
          {!canPublish && <Lock size={14} className="ml-1" />}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  MAIN WIZARD EXPORT                         */
/* ─────────────────────────────────────────── */
export default function CompetitionWizard() {
  const {
    competitions,
    scores,
    updateStudentStatus,
    updateStudentStage,
    setStudentResult,
    addScore,
    getCompetitionStudents,
    getCompetitionSubmissions,
    updateCompetitionPhase,
    updateCompetitionVisibility,
    updateLeaderboardStatus,
    finalizeCompetitionResults,
  } = useApp();

  const { saveRubric } = useJudge();

  const [step, setStep] = useState(1);
  const [selectedComp, setSelectedComp] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedRubric, setSelectedRubric] = useState('standard');

  const compObj = competitions.find(c => c.id === selectedComp);
  const compStudents = selectedComp ? getCompetitionStudents(selectedComp) : [];

  const handleRubricChange = (rubricId) => {
    setSelectedRubric(rubricId);
    const criteriaMap = {
      standard: [
        { id: 'innovation',   name: 'Innovation',         maxScore: 10 },
        { id: 'design',       name: 'Design',              maxScore: 10 },
        { id: 'presentation', name: 'Presentation',        maxScore: 10 },
        { id: 'technical',    name: 'Technical Quality',   maxScore: 10 },
      ],
      science: [
        { id: 'research',     name: 'Research Depth',      maxScore: 15 },
        { id: 'methodology',  name: 'Methodology',         maxScore: 15 },
        { id: 'accuracy',     name: 'Scientific Accuracy', maxScore: 10 },
      ],
      coding: [
        { id: 'algorithm',    name: 'Algorithm Efficiency',maxScore: 20 },
        { id: 'docs',         name: 'Code Documentation',  maxScore: 10 },
        { id: 'ui',           name: 'User Interface',      maxScore: 10 },
      ],
    };
    if (selectedComp) saveRubric(selectedComp, criteriaMap[rubricId] || criteriaMap.standard);
  };

  const canGoNext = () => {
    if (step === 1) return !!selectedComp && !!selectedStage;
    if (step === 2) return compStudents.some(s => s.status === 'Approved');
    if (step === 3) return true;
    return false;
  };

  const reset = () => { setStep(1); setSelectedComp(''); setSelectedStage(''); setSelectedRubric('standard'); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Manage Competition</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Follow the steps to review registrations, score submissions, and publish results.</p>
        </div>
        {step > 1 && (
          <button onClick={reset} className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            <RotateCcw size={13} /> Start over
          </button>
        )}
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-8">
        <WizardStepper currentStep={step} />

        <div className="min-h-[400px]">
          {step === 1 && (
            <Step1
              competitions={competitions}
              selectedComp={selectedComp}
              setSelectedComp={setSelectedComp}
              selectedStage={selectedStage}
              setSelectedStage={setSelectedStage}
              selectedRubric={selectedRubric}
              onRubricSelect={handleRubricChange}
            />
          )}
          {step === 2 && (
            <Step2
              compStudents={compStudents}
              updateStudentStatus={updateStudentStatus}
              updateStudentStage={updateStudentStage}
              selectedStage={selectedStage}
            />
          )}
          {step === 3 && (
            <Step3
              compStudents={compStudents}
              selectedCompId={selectedComp}
              setStudentResult={setStudentResult}
              addScore={addScore}
              getCompetitionSubmissions={getCompetitionSubmissions}
              scores={scores}
            />
          )}
          {step === 4 && (
            <Step4
              compStudents={compStudents}
              selectedCompId={selectedComp}
              selectedComp={compObj}
              selectedStage={selectedStage}
              updateCompetitionPhase={updateCompetitionPhase}
              updateCompetitionVisibility={updateCompetitionVisibility}
              updateLeaderboardStatus={updateLeaderboardStatus}
              finalizeCompetitionResults={finalizeCompetitionResults}
              scores={scores}
              onPublishDone={reset}
            />
          )}
        </div>

        {/* Navigation */}
        {step < 4 && (
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all',
                step === 1
                  ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}>
              <ChevronLeft size={16} /> Back
            </button>

            <div className="text-xs text-slate-400">Step {step} of {STEPS.length}</div>

            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canGoNext()}
              className={cn(
                'flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all',
                canGoNext()
                  ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-500/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              )}>
              {step === 3 ? 'Preview Results' : 'Continue'} <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
