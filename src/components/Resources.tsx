// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Video, Users, Mic, Globe } from 'lucide-react';

interface ResourcesProps {
  onBack: () => void;
}

const Resources = ({ onBack }: ResourcesProps) => {
  const [activeTab, setActiveTab] = useState<'speeches' | 'blogs' | 'videos' | 'rules' | 'foreign-policy' | 'speech-feedback'>('speeches');

  const speeches = [
    {
      id: 'obama-yes-we-can',
      speaker: 'Barack Obama',
      title: 'Yes We Can',
      year: '2008',
      category: 'Political',
      duration: '18 min',
      description: 'Presidential campaign victory speech',
      tags: ['Hope', 'Unity', 'Change']
    },
    {
      id: 'greta-un',
      speaker: 'Greta Thunberg',
      title: 'How Dare You',
      year: '2019',
      category: 'Environmental',
      duration: '4 min',
      description: 'UN Climate Action Summit speech',
      tags: ['Climate', 'Youth', 'Activism']
    },
    {
      id: 'kalam-youth',
      speaker: 'Dr. APJ Abdul Kalam',
      title: 'Dreams & Dedication',
      year: '2011',
      category: 'Inspirational',
      duration: '25 min',
      description: 'Address to students on vision and perseverance',
      tags: ['Dreams', 'Science', 'Youth']
    }
  ];

  const blogs = [
    {
      id: 'rhetoric-analysis',
      title: 'The Art of Political Rhetoric',
      author: 'MUN Academy',
      category: 'Analysis',
      readTime: '8 min read',
      description: 'Breaking down persuasive techniques used in famous political speeches'
    },
    {
      id: 'climate-discourse',
      title: 'Climate Change Discourse Evolution',
      author: 'Policy Experts',
      category: 'Current Events',
      readTime: '12 min read',
      description: 'How climate change rhetoric has evolved from scientific to moral arguments'
    }
  ];

  const videos = [
    {
      id: 'debate-techniques',
      title: 'Advanced Debate Techniques',
      creator: 'Debate Masters',
      duration: '45 min',
      category: 'Educational',
      description: 'Masterclass on argumentation and rebuttal strategies'
    },
    {
      id: 'mun-best-practices',
      title: 'MUN Best Practices',
      creator: 'Harvard MUN',
      duration: '30 min',
      category: 'MUN Training',
      description: 'Professional tips for Model UN participation'
    }
  ];

  const renderSpeechFeedback = () => (
    <div className="card-neon">
      <div className="mb-6">
        <h2 className="flex items-center space-x-2 text-xl font-orbitron text-cyan-400">
          <Mic className="h-5 w-5 text-fuchsia-400" />
          <span>MUN Speech Feedback</span>
        </h2>
      </div>
      <div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2 font-inter">
              Select Country
            </label>
            <select className="input-neon w-full">
              <option>United States</option>
              <option>China</option>
              <option>India</option>
              <option>Russia</option>
              <option>United Kingdom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2 font-inter">
              Your Speech
            </label>
            <textarea 
              className="input-neon w-full h-32"
              placeholder="Paste your MUN speech here to get feedback based on your country's stance..."
            />
          </div>
          <button className="btn-neon-primary">
            Get AI Feedback
          </button>
        </div>
      </div>
    </div>
  );

  const renderRules = () => (
    <div className="card-neon">
      <div className="mb-6">
        <h2 className="flex items-center space-x-2 text-xl font-orbitron text-cyan-400">
          <BookOpen className="h-5 w-5 text-cyan-400" />
          <span>Rules & Procedures</span>
        </h2>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-neon">
            <div>
              <h3 className="text-lg font-orbitron text-gray-200">UNA-USA Procedures</h3>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-3 font-inter">
                United Nations Association procedures and parliamentary rules
              </p>
              <button className="btn-neon-primary">View Rules</button>
            </div>
          </div>
          <div className="card-neon">
            <div>
              <h3 className="text-lg font-orbitron text-gray-200">Indian Parliamentary</h3>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-3 font-inter">
                Indian Parliamentary debate format and procedures
              </p>
              <button className="btn-neon-primary">View Rules</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderForeignPolicy = () => (
    <div className="card-neon">
      <div className="mb-6">
        <h2 className="flex items-center space-x-2 text-xl font-orbitron text-cyan-400">
          <Globe className="h-5 w-5 text-green-400" />
          <span>Foreign Policy Learning</span>
        </h2>
      </div>
      <div>
        <div className="space-y-4">
          <p className="text-gray-300 font-inter">
            Learn about different countries' positions and bloc strategies for effective MUN participation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-cyan-400/20 border border-cyan-400/30 rounded-lg">
              <h4 className="font-semibold text-cyan-400 font-orbitron">Country Positions</h4>
              <p className="text-sm text-gray-300 mt-1 font-inter">
                Understand historical stances and policy priorities
              </p>
            </div>
            <div className="p-4 bg-green-400/20 border border-green-400/30 rounded-lg">
              <h4 className="font-semibold text-green-400 font-orbitron">Bloc Strategies</h4>
              <p className="text-sm text-gray-300 mt-1 font-inter">
                Learn alliance patterns and negotiation tactics
              </p>
            </div>
          </div>
          <button className="btn-neon-primary">
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-orbitron neon-text">📚 Resources</h1>
            <p className="text-gray-300 mt-2 font-inter">Everything you need for debate and MUN success</p>
          </div>
          <button onClick={onBack} className="btn-neon-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-700">
          {[
            { id: 'speeches', label: 'Famous Speeches', icon: Users },
            { id: 'blogs', label: 'Analysis Blogs', icon: BookOpen },
            { id: 'videos', label: 'Educational Videos', icon: Video },
            { id: 'rules', label: 'Rules & Procedures', icon: BookOpen },
            { id: 'foreign-policy', label: 'Foreign Policy', icon: Globe },
            { id: 'speech-feedback', label: 'Speech Feedback', icon: Mic }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`mb-2 flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-inter ${
                activeTab === tab.id 
                  ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30' 
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'speeches' && (
          <div className="card-neon">
            <div className="mb-6">
              <h2 className="flex items-center space-x-2 text-xl font-orbitron text-cyan-400">
                <Users className="h-5 w-5 text-cyan-400" />
                <span>Famous Speeches</span>
              </h2>
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {speeches.map((speech) => (
                  <div key={speech.id} className="card-neon hover:shadow-neon transition-all">
                    <div className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-200 font-orbitron">{speech.speaker}</h4>
                          <p className="text-sm font-medium text-gray-300 font-inter">{speech.title}</p>
                        </div>
                        <div className="badge-neon bg-cyan-400/20 text-cyan-400 border-cyan-400/30">{speech.year}</div>
                      </div>
                    </div>
                    <div className="pt-0">
                      <p className="text-sm text-gray-300 mb-3 font-inter">{speech.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {speech.tags.map((tag) => (
                          <div key={tag} className="badge-neon text-xs bg-fuchsia-400/20 text-fuchsia-400 border-fuchsia-400/30">
                            {tag}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-400 font-inter">
                        <span>{speech.category}</span>
                        <span>{speech.duration}</span>
                      </div>
                    <button className="btn-neon-primary w-full mt-3">
                      Analyze Speech
                    </button>
                  </div>
                </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="card-neon">
            <div className="mb-6">
              <h2 className="flex items-center space-x-2 text-xl font-orbitron text-cyan-400">
                <BookOpen className="h-5 w-5 text-green-400" />
                <span>Analysis Blogs</span>
              </h2>
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogs.map((blog) => (
                  <div key={blog.id} className="card-neon hover:shadow-neon transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-200 font-orbitron">{blog.title}</h4>
                        <div className="badge-neon bg-green-400/20 text-green-400 border-green-400/30">{blog.category}</div>
                      </div>
                      <p className="text-sm text-gray-300 font-inter">by {blog.author}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300 mb-3 font-inter">{blog.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 font-inter">{blog.readTime}</span>
                        <button className="btn-neon-primary">Read Blog</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="card-neon">
            <div className="mb-6">
              <h2 className="flex items-center space-x-2 text-xl font-orbitron text-cyan-400">
                <Video className="h-5 w-5 text-fuchsia-400" />
                <span>Educational Videos</span>
              </h2>
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <div key={video.id} className="card-neon hover:shadow-neon transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-200 font-orbitron">{video.title}</h4>
                        <div className="badge-neon bg-fuchsia-400/20 text-fuchsia-400 border-fuchsia-400/30">{video.category}</div>
                      </div>
                      <p className="text-sm text-gray-300 font-inter">by {video.creator}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300 mb-3 font-inter">{video.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 font-inter">{video.duration}</span>
                        <button className="btn-neon-primary">Watch Video</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      )}

        {activeTab === 'rules' && renderRules()}
        {activeTab === 'foreign-policy' && renderForeignPolicy()}
        {activeTab === 'speech-feedback' && renderSpeechFeedback()}
      </div>
    </div>
  );
};

export default Resources;
