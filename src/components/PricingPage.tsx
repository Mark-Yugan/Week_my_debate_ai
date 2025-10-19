
// @ts-nocheck
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Crown, Star, Zap, Users, GraduationCap } from 'lucide-react';

interface PricingPageProps {
  onBack: () => void;
}

const PricingPage = ({ onBack }: PricingPageProps) => {
  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: Star,
      color: 'bg-gray-100 text-gray-600',
      features: [
        'AI debates - unlimited',
        'Live debates with users (5 per month)',
        'Basic AI feedback',
        'Standard progress tracking',
        'Access to all languages for live debates'
      ],
      limitations: [
        'Limited advanced features',
        'Basic AI responses',
        'No 1-on-1 sessions'
      ]
    },
    {
      name: 'Pro',
      price: '50',
      period: 'per year',
      description: 'For serious debaters',
      icon: Zap,
      color: 'bg-indigo-100 text-indigo-600',
      popular: false,
      indianPrice: '₹4,000',
      features: [
        'Everything in Free',
        'Unlimited live debates',
        'Advanced AI feedback & analytics',
        'Voice analysis & speech patterns',
        'Campus interview preparation',
        'Advanced progress tracking',
        'Custom debate topics',
        'Export performance reports',
        'Priority support'
      ]
    },
    {
      name: 'Plus',
      price: '100',
      period: 'per year',
      description: 'For institutions & professionals',
      icon: Crown,
      color: 'bg-indigo-100 text-indigo-600',
      popular: true,
      indianPrice: '₹8,000',
      features: [
        'Everything in Pro',
        '5 personal 1-on-1 training sessions per year',
        'Institution/Corporate features',
        'Full campus recruitment training',
        'Multi-student management',
        'Teacher/HR dashboard',
        'Bulk student accounts',
        'Custom branding',
        'Advanced analytics & insights',
        'MUN simulation access',
        'Dedicated account manager'
      ]
    }
  ];

  const trainingOptions = [
    {
      title: 'Job Fit Program (Campus Interview)',
      description: 'Complete preparation for campus placements and job interviews',
      icon: GraduationCap,
      color: 'bg-blue-100 text-blue-600',
      batchSize: '30 students per batch',
      features: [
        'Mock interview sessions',
        'Technical & HR rounds preparation',
        'Group discussion practice',
        'Presentation skills development',
        'Industry-specific scenarios',
        'Resume building workshops',
        'Body language and communication',
        'Salary negotiation techniques'
      ]
    },
    {
      title: 'Young Leaders Program (School Students)',
      description: 'Comprehensive development program for young minds',
      icon: Users,
      color: 'bg-green-100 text-green-600',
      batchSize: '30 students per batch',
      features: [
        'Life skills development',
        'Financial literacy basics',
        'Civic literacy and citizenship',
        'Age-appropriate sex education',
        'Basic debate fundamentals',
        'Public speaking confidence',
        'Critical thinking development',
        'Leadership and teamwork skills'
      ]
    },
    {
      title: 'College Students Advanced',
      description: 'Professional-level debate and communication',
      icon: Star,
      color: 'bg-purple-100 text-purple-600',
      batchSize: '30 students per batch',
      features: [
        'Advanced argumentation techniques',
        'Research and fact-checking',
        'Professional presentation skills',
        'Industry case studies',
        'Career-focused training',
        'Professional networking skills',
        'Advanced public speaking',
        'Leadership development'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center mx-auto">
            <h1 className="text-4xl font-bold font-orbitron neon-text mb-4">Choose Your Plan</h1>
            <p className="text-xl text-gray-300 font-inter">Unlock your debating potential with our premium features</p>
          </div>
          <button onClick={onBack} className="btn-neon-secondary absolute left-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div 
                key={plan.name} 
                className={`card-neon relative ${plan.popular ? 'ring-2 ring-cyan-400 scale-105 shadow-neon' : ''} hover:shadow-neon transition-all`}
              >
                {plan.popular && (
                  <div className="badge-neon absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-400/20 text-cyan-400 border-cyan-400/30">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center pb-6">
                  <div className={`w-16 h-16 bg-cyan-400/20 border border-cyan-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-200 font-orbitron">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-cyan-400 font-orbitron">${plan.price}</span>
                    <span className="text-gray-300 ml-2 font-inter">{plan.period}</span>
                    {plan.indianPrice && (
                      <div className="text-lg text-fuchsia-400 mt-1 font-inter">
                        {plan.indianPrice}/year
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 mt-2 font-inter">{plan.description}</p>
                </div>

                <div className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 font-inter">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations && (
                    <div className="mt-6 pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400 mb-2 font-inter">Limitations:</p>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="text-sm text-gray-400 font-inter">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button 
                    className={`w-full mt-6 ${plan.popular ? 'btn-neon-primary' : 'btn-neon-secondary'}`}
                  >
                    {plan.price === '0' ? 'Get Started Free' : 'Upgrade Now'}
                  </button>
                </div>
              </div>
          );
          })}
        </div>

        {/* Training Options */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold font-orbitron neon-text mb-8 text-center">Specialized Training Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainingOptions.map((training, index) => {
              const IconComponent = training.icon;
              return (
                <div key={index} className="card-neon hover:shadow-neon transition-all">
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-fuchsia-400/20 border border-fuchsia-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-8 w-8 text-fuchsia-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-200 font-orbitron">{training.title}</h3>
                    <p className="text-gray-300 mt-2 font-inter">{training.description}</p>
                    <div className="badge-neon mt-2 bg-fuchsia-400/20 text-fuchsia-400 border-fuchsia-400/30">{training.batchSize}</div>
                  </div>
                  <div>
                    <ul className="space-y-2">
                      {training.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-gray-300 font-inter">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="btn-neon-primary w-full mt-4">
                      Learn More
                    </button>
                  </div>
                </div>
            );
          })}
        </div>
      </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold font-orbitron neon-text mb-4">Why Choose Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-400/20 border border-cyan-400/30 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-200 mb-2 font-orbitron">Unlimited Practice</h3>
              <p className="text-gray-300 font-inter">Debate as much as you want without restrictions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-fuchsia-400/20 border border-fuchsia-400/30 text-fuchsia-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-200 mb-2 font-orbitron">Personal Training</h3>
              <p className="text-gray-300 font-inter">1-on-1 sessions with expert trainers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-400/20 border border-violet-400/30 text-violet-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-200 mb-2 font-orbitron">Campus Ready</h3>
              <p className="text-gray-300 font-inter">Complete preparation for campus interviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
