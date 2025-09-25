import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  FlaskConical,
  Users,
  Clock,
  TrendingUp,
  Plus,
  Search
} from 'lucide-react';

const mockLabs = [
  {
    id: 1,
    name: 'Coffee Chat Code Reviews',
    description: 'Informal code review sessions over coffee to improve team collaboration',
    category: 'Productivity',
    participants: 12,
    duration: '2 weeks',
    status: 'active',
    progress: 75,
    creator: 'Alex Chen'
  },
  {
    id: 2,
    name: 'Silent Standup Experiment',
    description: 'Written async standups instead of verbal meetings',
    category: 'Communication',
    participants: 8,
    duration: '3 weeks',
    status: 'active',
    progress: 50,
    creator: 'Sam Rivera'
  },
  {
    id: 3,
    name: 'Bug Hunt Fridays',
    description: 'Dedicated time for fixing technical debt and small bugs',
    category: 'Productivity',
    participants: 15,
    duration: '4 weeks',
    status: 'completed',
    progress: 100,
    creator: 'Jordan Kim'
  },
  {
    id: 4,
    name: 'No-Meeting Wednesdays',
    description: 'Deep focus day experiment with zero meetings',
    category: 'Communication',
    participants: 10,
    duration: '6 weeks',
    status: 'active',
    progress: 33,
    creator: 'Alex Chen'
  },
  {
    id: 5,
    name: 'Emoji-Driven Status Updates',
    description: 'Visual communication for team availability and mood',
    category: 'Communication',
    participants: 18,
    duration: '2 weeks',
    status: 'recruiting',
    progress: 0,
    creator: 'Sam Rivera'
  },
  {
    id: 6,
    name: 'Cross-Team Pair Programming',
    description: 'Developers from different teams collaborate on projects',
    category: 'Collaboration',
    participants: 6,
    duration: '8 weeks',
    status: 'active',
    progress: 25,
    creator: 'Jordan Kim'
  },
  {
    id: 7,
    name: '20% Time Innovation Projects',
    description: 'Google-style passion projects for creative exploration',
    category: 'Innovation',
    participants: 20,
    duration: '12 weeks',
    status: 'recruiting',
    progress: 0,
    creator: 'Alex Chen'
  },
  {
    id: 8,
    name: 'Tech Talk Tuesdays',
    description: 'Regular internal presentations on new technologies',
    category: 'Learning',
    participants: 22,
    duration: 'ongoing',
    status: 'active',
    progress: 80,
    creator: 'Sam Rivera'
  },
  {
    id: 9,
    name: 'Reverse Mentoring Program',
    description: 'Junior devs teach seniors new tools and trends',
    category: 'Learning',
    participants: 14,
    duration: '6 weeks',
    status: 'recruiting',
    progress: 0,
    creator: 'Jordan Kim'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'completed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'recruiting': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const Labs: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Labs Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and join developer experience experiments
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Lab
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search labs..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm"
          />
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline">All Categories</Badge>
          <Badge variant="outline">Active</Badge>
          <Badge variant="outline">Recruiting</Badge>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLabs.map((lab) => (
          <Card key={lab.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{lab.name}</CardTitle>
                <Badge className={getStatusColor(lab.status)}>
                  {lab.status}
                </Badge>
              </div>
              <CardDescription>{lab.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{lab.participants} participants</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{lab.duration}</span>
                </div>
              </div>

              {lab.status === 'active' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{lab.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all"
                      style={{ width: `${lab.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  by {lab.creator}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {lab.category}
                </Badge>
              </div>

              <div className="flex space-x-2">
                {lab.status === 'recruiting' ? (
                  <Button size="sm" className="flex-1">
                    Join Lab
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                )}
                {lab.status === 'completed' && (
                  <Button size="sm" variant="ghost">
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Labs;