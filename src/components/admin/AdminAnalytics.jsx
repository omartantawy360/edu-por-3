import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Trophy, Users, FileText, TrendingUp, Download, PieChart as PieChartIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { useTeam } from '../../context/TeamContext';
import { cn } from '../../utils/cn';

const AdminAnalytics = () => {
  const { students, submissions, scores } = useApp();
  const { teams } = useTeam();

  // --- Data Calculations ---
  const stats = useMemo(() => {
    const totalReg = teams.length;
    const subRate = teams.length > 0 ? (submissions.length / teams.length) * 100 : 0;
    const avgScore = scores.length > 0 
      ? scores.reduce((acc, s) => acc + (s.total || 0), 0) / scores.length 
      : 0;
    
    return [
      { title: 'Total Registrations', value: totalReg, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { title: 'Submission Rate', value: `${Math.round(subRate)}%`, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { title: 'Average Score', value: avgScore.toFixed(1), icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
      { title: 'Growth (Monthly)', value: '+12%', icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
    ];
  }, [teams, submissions, scores]);

  // Score Distribution Data
  const scoreDist = useMemo(() => {
    const ranges = { '0-10': 0, '11-20': 0, '21-30': 0, '31-40': 0 };
    scores.forEach(s => {
      const total = s.total || 0;
      if (total <= 10) ranges['0-10']++;
      else if (total <= 20) ranges['11-20']++;
      else if (total <= 30) ranges['21-30']++;
      else ranges['31-40']++;
    });
    return Object.entries(ranges).map(([name, value]) => ({ name, value }));
  }, [scores]);

  // Registration Trend Data (Mock for demo)
  const regTrend = [
    { name: 'Jan', count: 12 },
    { name: 'Feb', count: 18 },
    { name: 'Mar', count: 25 },
    { name: 'Apr', count: 32 },
    { name: 'May', count: 45 },
    { name: 'Jun', count: 64 },
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Live Data
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution Chart */}
        <Card className="rounded-[2rem] border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between px-8 pt-8 pb-4">
            <div>
              <CardTitle className="text-lg font-bold">Score Distribution</CardTitle>
              <p className="text-xs text-slate-500">Breakdown of student performance across competitions</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDist} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#c084fc" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: '#111827',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Registration Trends Chart */}
        <Card className="rounded-[2rem] border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between px-8 pt-8 pb-4">
            <div>
              <CardTitle className="text-lg font-bold">Registration Trends</CardTitle>
              <p className="text-xs text-slate-500">Growth in platform adoption over time</p>
            </div>
            <Badge variant="secondary">2026 Season</Badge>
          </CardHeader>
          <CardContent className="p-8 pt-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={regTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: '#111827',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 rounded-3xl border-0 shadow-sm bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-6">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <PieChartIcon size={20} />
              </div>
              <h3 className="text-lg font-bold mb-1">Export Reports</h3>
              <p className="text-white/70 text-sm mb-6">Generate detailed PDF or CSV reports for school administrators.</p>
              <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20 text-white text-xs rounded-xl h-10">Export PDF</Button>
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20 text-white text-xs rounded-xl h-10">Export CSV</Button>
              </div>
          </Card>
          
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency</span>
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+18%</span>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">94%</h4>
                  <p className="text-xs text-slate-500">Submission validation success rate across all cohorts.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Users</span>
                      <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Steady</span>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">{students.length}</h4>
                  <p className="text-xs text-slate-500">Unique participants currently registered on the platform.</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
