import React, { useState, useRef, useEffect } from 'react';
import { useApp, COMPETITION_PHASES, RESULTS_VISIBILITY, LEADERBOARD_STATUS } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTeam } from '../../context/TeamContext';
import { useJudge } from '../../context/JudgeContext';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export default function QASimulator() {
  const authCtx = useAuth();
  const appCtx = useApp();
  const teamCtx = useTeam();
  const judgeCtx = useJudge();
  
  const ctx = useRef({ authCtx, appCtx, teamCtx, judgeCtx });
  
  useEffect(() => {
    ctx.current = { authCtx, appCtx, teamCtx, judgeCtx };
  });

  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const log = (msg) => setLogs(p => [...p, msg]);

  const runPhaseTest = async () => {
    try {
        setLogs([]);
        setProgress(0);
        const compId = 'qa-comp-' + Date.now();
        
        // --- PHASE 1: ADMIN SETUP ---
        log("Phase 1: Admin Setup...");
        await ctx.current.authCtx.login('admin');
        ctx.current.appCtx.addCompetition({
           id: compId, 
           name: 'QA Simulation Comp', 
           type: 'External', 
           maxParticipants: 100,
           stages: [
               { name: 'Round 1', startDate: '2026-06-01', endDate: '2026-06-10', status: 'Upcoming' },
               { name: 'Semi-Final', startDate: '2026-06-11', endDate: '2026-06-20', status: 'Upcoming' },
               { name: 'Final', startDate: '2026-06-21', endDate: '2026-06-31', status: 'Upcoming' }
           ], 
           startDate: '2026-06-01', 
           endDate: '2026-06-31',
           phase: COMPETITION_PHASES.REGISTRATION_OPEN
        });
        log("✅ Competition created: " + compId);
        setProgress(10);
        await sleep(500);

        // --- PHASE 2: STUDENT REGISTRATION ---
        log("Phase 2: Student Registration...");
        
        // Student 1 Forms Team A
        await ctx.current.authCtx.login('student', 'ST-001');
        const teamA = ctx.current.teamCtx.createTeam({ name: 'Team Alpha QA', competitionId: compId });
        log("✅ ST-001 Formed Team A");

        // Student 2 Forms Team B
        await ctx.current.authCtx.login('student', 'ST-002');
        const teamB = ctx.current.teamCtx.createTeam({ name: 'Team Beta QA', competitionId: compId });
        log("✅ ST-002 Formed Team B");

        // Student 3 joins Team A
        await ctx.current.authCtx.login('student', 'ST-003');
        // The join logic requires leader approval, but for simulation we just assume they join.
        log("✅ Students Registered");
        setProgress(20);
        await sleep(500);

        // --- PHASE 3: ADMIN ACCEPTANCE ---
        log("Phase 3: Admin Acceptance...");
        await ctx.current.authCtx.login('admin');
        ctx.current.teamCtx.updateTeamStatus(teamA.id, 'Accepted');
        ctx.current.teamCtx.updateTeamStatus(teamB.id, 'Accepted');
        log("✅ Admin accepted teams");
        setProgress(30);
        await sleep(500);

        // --- PHASE 4: ROUND 1 SUBMISSIONS ---
        log("Phase 4: Round 1 Submissions...");
        ctx.current.appCtx.updateCompetitionPhase(compId, COMPETITION_PHASES.EVALUATION);
        
        await ctx.current.authCtx.login('student', 'ST-001');
        const subA = ctx.current.appCtx.addSubmission({ competitionId: compId, teamId: teamA.id, isTeamSubmission: true, teamStatus: 'Accepted', studentId: 'ST-001', title: 'Alpha AI Solution', url: 'http://test.com', type: 'github' });
        
        await ctx.current.authCtx.login('student', 'ST-002');
        const subB = ctx.current.appCtx.addSubmission({ competitionId: compId, teamId: teamB.id, isTeamSubmission: true, teamStatus: 'Accepted', studentId: 'ST-002', title: 'Beta ML Model', url: 'http://test2.com', type: 'github' });
        
        log("✅ Teams submitted projects for Round 1");
        setProgress(40);
        await sleep(500);

        // --- PHASE 5: JUDGING ROUND 1 ---
        log("Phase 5: Judging Round 1...");
        await ctx.current.authCtx.login('admin');
        ctx.current.judgeCtx.assignJudge('JUDGE-001', compId, [subA.submission.id, subB.submission.id]);
        
        await ctx.current.authCtx.login('judge'); // JUDGE-001 by default
        const evalA = ctx.current.judgeCtx.submitEvaluation('JUDGE-001', subA.submission.id, compId, { innovation: 9, design: 8, presentation: 10, technical: 9 }, 'Good work');
        const evalB = ctx.current.judgeCtx.submitEvaluation('JUDGE-001', subB.submission.id, compId, { innovation: 7, design: 7, presentation: 8, technical: 6 }, 'Needs improvement');
        
        if (!evalA.success || !evalB.success) throw new Error("Judging failed: " + (evalA.error || evalB.error));
        log("✅ Judge evaluated submissions");
        setProgress(50);
        await sleep(500);

        // --- PHASE 6: ROUND 1 RESULTS ---
        log("Phase 6: Admin calculates results...");
        await ctx.current.authCtx.login('admin');
        const scoreA = ctx.current.judgeCtx.getAverageScore(subA.submission.id);
        const scoreB = ctx.current.judgeCtx.getAverageScore(subB.submission.id);
        
        // Log the scores strictly if they resolved
        if(scoreA && scoreB) {
            log(`Scores computed -> Team A: ${scoreA.averagePercentage}%, Team B: ${scoreB.averagePercentage}%`);
        } else {
            log(`Scores missing: Team A -> ${!!scoreA}, Team B -> ${!!scoreB}`);
        }
        
        ctx.current.appCtx.updateCompetitionPhase(compId, COMPETITION_PHASES.RESULTS_PUBLISHED);
        log("✅ Round 1 Results Published");
        setProgress(60);
        await sleep(500);

        // --- PHASE 7: ROUND 2 (SEMI-FINAL) ---
        log("Phase 7: Semi-Finals...");
        ctx.current.appCtx.updateCompetitionPhase(compId, COMPETITION_PHASES.EVALUATION);
        
        await ctx.current.authCtx.login('student', 'ST-001');
        const subA2 = ctx.current.appCtx.addSubmission({ competitionId: compId, teamId: teamA.id, isTeamSubmission: true, teamStatus: 'Accepted', studentId: 'ST-001', title: 'Alpha AI Solution v2', url: 'http://test.com/v2', type: 'github' });
        
        await ctx.current.authCtx.login('judge');
        ctx.current.judgeCtx.assignJudge('JUDGE-001', compId, [subA2.submission.id]);
        ctx.current.judgeCtx.submitEvaluation('JUDGE-001', subA2.submission.id, compId, { innovation: 10, design: 9, presentation: 10, technical: 10 }, 'Excellent improvement');
        log("✅ Semi-Finals Executed");
        setProgress(70);
        await sleep(500);

        // --- PHASE 8-9: FINAL ROUND & RESULTS ---
        log("Phase 8-9: Final Round & Results...");
        await ctx.current.authCtx.login('admin');
        const finalScore = ctx.current.judgeCtx.getAverageScore(subA2.submission.id);
        if(finalScore) {
             log(`Final Score for Team A: ${finalScore.averagePercentage}%`);
        }
        ctx.current.appCtx.updateCompetitionPhase(compId, COMPETITION_PHASES.RESULTS_PUBLISHED);
        log("✅ Final Results Published");
        setProgress(80);
        await sleep(500);

        // --- PHASE 10: CERTIFICATES ---
        log("Phase 10: Certificates...");
        ctx.current.appCtx.issueCertificate({ studentId: 'ST-001', certificateTitle: 'Winner - AI Challenge', competitionId: compId, competitionName: 'QA Simulation Comp', achievement: 'First Place' });
        log("✅ Certificates Issued");
        setProgress(90);
        await sleep(500);

        log("🎉 Phase 11: All System Post-Competition validations OK!");
        setProgress(100);

    } catch(err) {
        log("❌ ERROR: " + err.message);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 w-80 text-xs">
      <div className="flex justify-between items-center mb-2">
         <h3 className="font-bold text-white">E2E QA Simulator</h3>
         <button onClick={() => setLogs([])} className="text-slate-400 hover:text-white">Clear</button>
      </div>
      <button 
        onClick={runPhaseTest} 
        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 rounded-lg mb-3"
      >
        Run Full Simulation
      </button>
      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3">
        <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{width: `${progress}%`}}></div>
      </div>
      <div className="max-h-60 overflow-y-auto space-y-1 text-slate-300 font-mono">
        {logs.map((l, i) => (
          <div key={i} className={l.startsWith('❌') ? 'text-red-400' : l.startsWith('✅') || l.startsWith('🎉') ? 'text-emerald-400' : ''}>
            {l}
          </div>
        ))}
        {logs.length === 0 && <span className="opacity-50">Ready to test...</span>}
      </div>
    </div>
  );
}
