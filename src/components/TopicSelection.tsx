
// @ts-nocheck
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shuffle, ArrowLeft, Search, Filter, Lightbulb, Trophy, Target } from 'lucide-react';
import { allTopics, Topic } from '@/data/topics';
import TopicCard from '@/components/TopicCard';
import ArgumentsDisplay from '@/components/ArgumentsDisplay';
import TopicSuggestDialog from '@/components/TopicSuggestDialog';

interface TopicSelectionProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  theme: string;
  onTopicSelect: (topic: Topic) => void;
  onBack: () => void;
}

const TopicSelection = ({ difficulty, theme, onTopicSelect, onBack }: TopicSelectionProps) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showArguments, setShowArguments] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Filter topics by theme and difficulty
  const filteredTopics = allTopics.filter(topic => 
    topic.theme === theme && topic.difficulty === difficulty
  );

  // If no topics match exactly, show all topics from the theme
  let topics = filteredTopics.length > 0 ? filteredTopics : allTopics.filter(topic => topic.theme === theme);

  // Apply search filter if provided
  if (searchFilter.trim()) {
    topics = topics.filter(topic => 
      topic.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }

  // Pre-filled topics for each theme
  const preFilledTopics: Record<string, string[]> = {
    'Politics': ["Should voting be mandatory?", "Is democracy still the best?", "Should politicians be allowed on social media?"],
    'Technology': ["Is AI a threat to jobs?", "Should social media be regulated?", "Is tech addiction real?"],
    'Environment': ["Should plastic be banned?", "Can individuals fight climate change?", "Should countries be penalized for pollution?"],
    'Education': ["Should exams be scrapped?", "Online vs Traditional Learning", "Should students grade teachers?"],
    'Health': ["Is mental health equal to physical health?", "Should healthcare be free?", "Are fitness influencers misleading?"],
    'Cinema': ["Should movies be censored?", "Do biopics need to be accurate?", "Are awards shows outdated?"],
    'Sports': ["Are esports real sports?", "Should athletes be role models?", "Should PEDs be legal?"],
    'Food': ["Should junk food ads be banned?", "Is veganism the future?", "Should lab-grown meat be promoted?"],
    'Society': ["Is cancel culture needed?", "Should marriages have expiry?", "Do social media likes define worth?"],
    'Economics': ["Should billionaires exist?", "Is UBI realistic?", "Should crypto be banned?"]
  };

  const handleRandomTopic = () => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    setSelectedTopic(randomTopic);
    setShowArguments(true);
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowArguments(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Modern Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Title and Context */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Choose Your Debate Topic
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Badge variant="secondary" className="text-xs">{theme}</Badge>
                    <Badge variant={difficulty === 'Easy' ? 'default' : difficulty === 'Medium' ? 'secondary' : 'destructive'} className="text-xs">
                      {difficulty}
                    </Badge>
                    <span className="text-xs">• AI-powered insights included</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Actions */}
            <div className="flex items-center space-x-3">
              <TopicSuggestDialog />
              <Button variant="outline" size="sm" onClick={handleRandomTopic} className="flex items-center space-x-2">
                <Shuffle className="h-4 w-4" />
                <span>Random</span>
              </Button>
              <Button variant="outline" size="sm" onClick={onBack} className="flex items-center space-x-1">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {!selectedTopic ? (
          <div className="space-y-6">
            {/* Search and Filter Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {topics.length} topics found
                </div>
              </div>
            </div>

            {/* Popular Topics Suggestions */}
            {preFilledTopics[theme] && !searchFilter && (
              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg text-purple-900 dark:text-purple-100">
                      Popular {theme} Topics
                    </CardTitle>
                  </div>
                  <CardDescription className="text-purple-700 dark:text-purple-300">
                    Quick-start options to get your debate going
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {preFilledTopics[theme].map((topic, index) => (
                      <button
                        key={index}
                        className="group p-3 text-left bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 hover:shadow-md"
                        onClick={() => {
                          // For now, just show the topic - we'll wire this up later
                          console.log('Selected pre-filled topic:', topic);
                        }}
                      >
                        <div className="text-sm font-medium text-purple-900 dark:text-purple-100 group-hover:text-purple-700 dark:group-hover:text-purple-200">
                          {topic}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Topics Grid */}
            {topics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    onSelect={handleTopicSelect}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <CardTitle className="text-xl text-gray-600 dark:text-gray-400 mb-2">No topics found</CardTitle>
                  <CardDescription>
                    Try adjusting your search terms or browse all {theme} topics
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchFilter('')}
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Selected Topic Display */}
            <Card className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-gray-900 dark:text-white">
                        {selectedTopic.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                      {selectedTopic.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Badge className={getDifficultyColor(selectedTopic.difficulty)} variant="secondary">
                      {selectedTopic.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-center">
                      {selectedTopic.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Arguments Display */}
            {showArguments && (
              <ArgumentsDisplay topic={selectedTopic} />
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedTopic(null);
                  setShowArguments(false);
                }}
                className="px-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Choose Different Topic
              </Button>
              <Button 
                size="lg" 
                onClick={() => onTopicSelect(selectedTopic)}
                className="px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Start Debate
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicSelection;
