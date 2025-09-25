import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, MessageSquare, Calendar } from 'lucide-react';

const Community: React.FC = () => {
  const teamMembers = [
    { name: 'Alex Chen', role: 'Lab Owner', avatar: '👨‍💻', labs: 3, contributions: 12 },
    { name: 'Sam Rivera', role: 'Beta User', avatar: '👩‍🔬', labs: 2, contributions: 8 },
    { name: 'Jordan Kim', role: 'Standard User', avatar: '👨‍🎨', labs: 1, contributions: 5 },
    { name: 'Taylor Smith', role: 'Standard User', avatar: '👩‍💻', labs: 0, contributions: 3 },
  ];

  const discussions = [
    {
      title: 'Best practices for async standups?',
      author: 'Sam Rivera',
      replies: 8,
      time: '2 hours ago',
      category: 'Communication'
    },
    {
      title: 'Measuring code review impact',
      author: 'Alex Chen',
      replies: 5,
      time: '4 hours ago',
      category: 'Productivity'
    },
    {
      title: 'Ideas for innovation time projects',
      author: 'Jordan Kim',
      replies: 12,
      time: '1 day ago',
      category: 'Innovation'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground">
          Connect with your team and share experiment insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Directory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Team Directory
            </CardTitle>
            <CardDescription>Active team members and their contributions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{member.avatar}</div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.role}</div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div>{member.labs} active labs</div>
                  <div className="text-muted-foreground">{member.contributions} contributions</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Discussions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Discussions
            </CardTitle>
            <CardDescription>Recent team conversations and Q&A</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {discussions.map((discussion, index) => (
              <div key={index} className="p-3 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{discussion.title}</h4>
                  <Badge variant="outline" className="text-xs">{discussion.category}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>by {discussion.author}</span>
                  <div className="flex items-center space-x-3">
                    <span>{discussion.replies} replies</span>
                    <span>{discussion.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;