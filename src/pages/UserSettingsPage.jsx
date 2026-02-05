import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const UserSettingsPage = () => {
  const { user } = useAuth();
  const { students } = useApp();

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  // Simple derived data for admin user list
  const usersList = isAdmin ? students : students.filter((s) => s.name === user.name);

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">Account & Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your profile information and view users related to your account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Name</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Role</p>
              <Badge className="mt-1 capitalize">{user.role}</Badge>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              This is a demo profile. In a real system you could edit your email, password, and other
              personal details here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700 dark:text-slate-200">
            <div className="flex items-center justify-between">
              <span>Notifications</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Always on in this demo</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Language</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">English (static)</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Add real toggle switches and settings here when connecting to a backend.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {isAdmin ? 'Users List' : 'My Registrations'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {usersList.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No users to display.</p>
          ) : (
            <div className="space-y-2">
              {usersList.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-50">{u.name}</p>
                    {u.school && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {u.school} {u.grade && `• Grade ${u.grade}`}
                      </p>
                    )}
                  </div>
                  {u.status && (
                    <Badge
                      variant={
                        u.status === 'Approved'
                          ? 'success'
                          : u.status === 'Rejected'
                          ? 'destructive'
                          : 'warning'
                      }
                    >
                      {u.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettingsPage;

