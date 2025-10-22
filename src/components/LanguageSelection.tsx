
// @ts-nocheck

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Globe } from 'lucide-react';

interface LanguageSelectionProps {
  onLanguageSelect: (language: string) => void;
  onBack: () => void;
}

const LanguageSelection = ({ onLanguageSelect, onBack }: LanguageSelectionProps) => {
  const universalLanguages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'it', name: 'Italian', native: 'Italiano' },
    { code: 'pt', name: 'Portuguese', native: 'Português' },
    { code: 'ru', name: 'Russian', native: 'Русский' },
    { code: 'ja', name: 'Japanese', native: '日本語' },
    { code: 'ko', name: 'Korean', native: '한국어' },
    { code: 'zh', name: 'Chinese', native: '中文' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
  ];

  const indianLanguages = [
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
    { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
    { code: 'ne', name: 'Nepali', native: 'नेपाली' },
    { code: 'ks', name: 'Kashmiri', native: 'کٲشُر' },
  ];

  const renderLanguageSection = (title: string, languages: typeof universalLanguages, isIndian = false) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-50 font-orbitron mb-6 flex items-center gap-3">
        <div className={`w-2 h-8 ${isIndian ? 'gradient-neon-secondary' : 'gradient-neon-primary'} rounded-full`}></div>
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {languages.map((language) => (
          <div 
            key={language.code} 
            className="card-neon group hover:shadow-neon cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => onLanguageSelect(language.code)}
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`relative w-12 h-12 ${isIndian ? 'bg-fuchsia-400/20' : 'bg-cyan-400/20'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Globe className={`h-6 w-6 ${isIndian ? 'text-fuchsia-400' : 'text-cyan-400'}`} />
                  <div className={`absolute inset-0 ${isIndian ? 'bg-fuchsia-400/10' : 'bg-cyan-400/10'} rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-50 font-orbitron group-hover:text-cyan-300 transition-colors">
                    {language.name}
                  </h3>
                  <p className="text-sm text-gray-300 font-inter">{language.native}</p>
                </div>
              </div>
              <Button 
                className={`w-full ${isIndian ? 'btn-neon-secondary' : 'btn-neon-primary'} text-sm font-orbitron`}
                onClick={(e) => {
                  e.stopPropagation();
                  onLanguageSelect(language.code);
                }}
              >
                Select Language
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5"></div>
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold font-orbitron neon-text mb-3">
              Select Your Debate Language
            </h1>
            <p className="text-gray-300 text-lg font-inter">
              Choose the language you want to debate in and connect with global opponents
            </p>
          </div>
          <Button 
            onClick={onBack}
            className="btn-neon-secondary flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Format
          </Button>
        </div>

        {/* Language Sections */}
        {renderLanguageSection("Universal Languages", universalLanguages, false)}
        {renderLanguageSection("Indian Languages", indianLanguages, true)}

        {/* Additional Info Card */}
        <div className="card-neon mt-12">
          <div className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="h-8 w-8 text-cyan-400" />
              <h3 className="text-2xl font-bold text-gray-50 font-orbitron">Multilingual AI Support</h3>
            </div>
            <p className="text-gray-300 text-lg font-inter mb-6">
              Our advanced AI moderator supports all languages with real-time translation and cultural context awareness
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="badge-neon bg-emerald-400/20 text-emerald-300 border-emerald-400/30 px-4 py-2">
                Real-time Translation
              </div>
              <div className="badge-neon bg-cyan-400/20 text-cyan-300 border-cyan-400/30 px-4 py-2">
                Cultural Context AI
              </div>
              <div className="badge-neon bg-fuchsia-400/20 text-fuchsia-300 border-fuchsia-400/30 px-4 py-2">
                Native Speaker Matching
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
