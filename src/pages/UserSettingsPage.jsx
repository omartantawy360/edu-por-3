import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Shield, User, Bell, Globe, Moon, Sun, Monitor, Camera, Lock, Mail, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const UserSettingsPage = () => {
  const { user } = useAuth();
  const { students, submissions } = useApp();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  // Derived data
  const usersList = isAdmin
    ? students
    : (submissions || []).map((reg) => ({
        id: reg.id,
        name: user.name,
        role: 'student',
        school: user.school,
        status: reg.status ? reg.status.charAt(0).toUpperCase() + reg.status.slice(1) : 'Pending',
      }));

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            Settings & Account
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your profile, preferences, and security settings</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          <Shield size={14} />
          {isAdmin ? 'Admin Access' : 'Student Account'}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3 transition-all ${activeTab === 'profile'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
          >
            <User size={18} />
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3 transition-all ${activeTab === 'preferences'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
          >
            <div className="relative">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3 transition-all ${activeTab === 'registrations'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
          >
            <Shield size={18} />
            {isAdmin ? 'User Management' : 'My Registrations'}
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-violet-600 to-indigo-600"></div>
                <div className="relative flex flex-col md:flex-row items-end md:items-end gap-6 mb-8 pt-10 px-2">
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-800 p-1 shadow-xl">
                      <div className="h-full w-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                        <User size={40} className="text-slate-400" />
                        {/* <img src={user.avatar} className="w-full h-full object-cover" /> */}
                      </div>
                    </div>
                    <button className="absolute bottom-1 right-1 p-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 shadow-lg transition-transform hover:scale-105">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div className="flex-1 mb-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{user.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">@{user.username || user.name.toLowerCase().replace(' ', '')}</p>
                  </div>
                  <div className="mb-2">
                    <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 uppercase tracking-wider px-3 py-1">
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium">
                      {user.name}
                    </div>
                  </div>
                    <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium flex items-center gap-2">
                      <Mail size={16} className="text-slate-400" />
                      {user.email}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Bio</label>
                    <textarea disabled className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium resize-none" rows="3" defaultValue={user.bio || "Passionate learner and tech enthusiast. Always ready for a new challenge!"}></textarea>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <Lock size={20} className="text-violet-600" />
                  Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Password</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Last changed 3 months ago</p>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600">Change</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Not enabled</p>
                    </div>
                    <button className="px-4 py-2 bg-violet-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-violet-700">Enable</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">App Preferences</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Appearance</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-violet-500 cursor-pointer transition-all flex flex-col items-center gap-2">
                      <div className="w-full h-12 bg-slate-100 rounded-lg mb-1"></div>
                      <span className="text-xs font-semibold flex items-center gap-1"><Sun size={12} /> Light</span>
                    </div>
                    <div className="p-4 rounded-xl border-2 border-violet-500 bg-violet-50 dark:bg-violet-900/10 cursor-pointer transition-all flex flex-col items-center gap-2">
                      <div className="w-full h-12 bg-slate-800 rounded-lg mb-1"></div>
                      <span className="text-xs font-semibold flex items-center gap-1 text-violet-700 dark:text-violet-300"><Moon size={12} /> Dark</span>
                    </div>
                    <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-violet-500 cursor-pointer transition-all flex flex-col items-center gap-2">
                      <div className="w-full h-12 bg-gradient-to-r from-slate-100 to-slate-800 rounded-lg mb-1"></div>
                      <span className="text-xs font-semibold flex items-center gap-1"><Monitor size={12} /> System</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                <div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Notifications</h4>
                  <div className="space-y-3">
                    {['Email Notifications', 'Push Notifications', 'Competition Alerts', 'Team Messages'].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item}</span>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-violet-600 cursor-pointer">
                          <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                <div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Language & Region</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-slate-400" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Language</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">English (United States)</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600">Change</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Registrations Tab */}
          {activeTab === 'registrations' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{isAdmin ? 'All Users' : 'Your Registrations'}</h3>
                <div className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold rounded-full">
                  {usersList.length} Active
                </div>
              </div>

              {usersList.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>No records found.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">School</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{u.name}</td>
                          <td className="px-6 py-4 capitalize text-slate-600 dark:text-slate-400">{u.role}</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{u.school || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                u.status === 'Approved'
                                  ? 'success'
                                  : u.status === 'Rejected'
                                    ? 'destructive'
                                    : 'warning'
                              }
                              className="capitalize"
                            >
                              {u.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
