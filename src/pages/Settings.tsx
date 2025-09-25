import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { FEATURE_FLAGS, DEFAULT_FLAGS } from '../lib/launchdarkly';
import { Settings as SettingsIcon, Slack, Bell, User } from 'lucide-react';

const Settings: React.FC = () => {
  const flags = useFlags();
  const slackIntegrationEnabled = flags[FEATURE_FLAGS.SLACK_INTEGRATION] ?? DEFAULT_FLAGS[FEATURE_FLAGS.SLACK_INTEGRATION];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, notifications, and integrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <input 
                type="text" 
                defaultValue="Alex Chen"
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                defaultValue="alex.chen@togglelab.com"
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Lab Updates</div>
                <div className="text-xs text-muted-foreground">New participants, progress updates</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Weekly Reports</div>
                <div className="text-xs text-muted-foreground">Summary of team metrics</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">New Lab Invitations</div>
                <div className="text-xs text-muted-foreground">When someone invites you to join</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>Connect ToggleLab with your favorite tools</CardDescription>
        </CardHeader>
        <CardContent>
          {slackIntegrationEnabled ? (
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Slack className="h-8 w-8 text-green-500" />
                <div>
                  <div className="font-medium">Slack</div>
                  <div className="text-sm text-muted-foreground">Get lab updates in your channels</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500 text-white">Connected</Badge>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center space-x-3">
                <Slack className="h-8 w-8 text-muted-foreground" />
                <div>
                  <div className="font-medium">Slack</div>
                  <div className="text-sm text-muted-foreground">Connect to get lab updates</div>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;