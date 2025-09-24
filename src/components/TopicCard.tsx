
// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Topic } from '@/data/topics';

interface TopicCardProps {
  topic: Topic;
  onSelect: (topic: Topic) => void;
}

const TopicCard = ({ topic, onSelect }: TopicCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Hard': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '🟢';
      case 'Medium': return '🟡';
      case 'Hard': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <Card 
      className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => onSelect(topic)}
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-indigo-50/0 group-hover:from-purple-50/50 group-hover:to-indigo-50/50 dark:group-hover:from-purple-900/20 dark:group-hover:to-indigo-900/20 transition-all duration-300" />
      
      {/* Content */}
      <div className="relative">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{getDifficultyIcon(topic.difficulty)}</span>
                <Badge className={`${getDifficultyColor(topic.difficulty)} text-xs font-medium`} variant="secondary">
                  {topic.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold leading-tight text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                {topic.title}
              </CardTitle>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transform group-hover:translate-x-1 transition-all duration-300" />
          </div>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {topic.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{topic.category}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{topic.timeEstimate}</span>
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
              <Sparkles className="h-3 w-3" />
              <span>AI Enhanced</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default TopicCard;
