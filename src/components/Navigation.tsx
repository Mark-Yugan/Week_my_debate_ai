
// @ts-nocheck
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Coins, Crown, User, LogOut, Settings } from 'lucide-react';

interface NavigationProps {
  userTokens: number;
  userRole: 'student' | 'teacher';
  onRoleSwitch: (role: 'student' | 'teacher') => void;
  onGetPremium: () => void;
  onSignOut: () => void;
  user: any;
  isAuthenticated: boolean;
}

const Navigation = ({ 
  userTokens, 
  userRole, 
  onRoleSwitch, 
  onGetPremium, 
  onSignOut,
  user,
  isAuthenticated 
}: NavigationProps) => {
  return (
    <nav className="relative bg-white/95 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 shadow-sm">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#009]/2 via-white to-[#009]/2 opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group hover:scale-[1.02] transition-all duration-300">
          <div className="relative">
            <div className="absolute inset-0 bg-[#009]/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 ring-2 ring-[#009]/10 group-hover:ring-[#009]/20">
              <img 
                src="/lovable-uploads/80a86b55-ac06-4e1e-905b-e5574803f537.png" 
                alt="MyDebate.ai Logo" 
                className="h-8 w-8 object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-light bg-gradient-to-r from-[#009] via-[#0066cc] to-[#004499] bg-clip-text text-transparent tracking-wide">
            MyDebate.ai
          </h1>
        </Link>



        {/* Right Side */}
        <div className="flex items-center space-x-6">
          {/* Show login button if not authenticated */}
          {!isAuthenticated ? (
            <Link to="/login">
              <Button className="bg-gradient-to-r from-[#009] to-[#0066cc] hover:from-[#0066cc] hover:to-[#004499] text-white px-8 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Sign In
              </Button>
            </Link>
          ) : (
            <>
              {/* Tokens - only show when authenticated */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-[#009]/5 to-[#0066cc]/5 px-4 py-2 rounded-xl border border-[#009]/10 backdrop-blur-sm">
                <div className="relative">
                  <Coins className="h-5 w-5 text-[#009]" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#0066cc] rounded-full animate-pulse"></div>
                </div>
                <Badge variant="secondary" className="bg-gradient-to-r from-[#009] to-[#0066cc] text-white border-0 px-3 py-1 font-medium shadow-sm">
                  {userTokens} tokens
                </Badge>
              </div>

              {/* Premium Button */}
              <Button 
                size="sm" 
                onClick={onGetPremium}
                className="bg-gradient-to-r from-[#009] via-[#0066cc] to-[#004499] hover:from-[#0066cc] hover:via-[#004499] hover:to-[#009] text-white px-6 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Crown className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">Get Premium</span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-[#009]/5 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#009] to-[#0066cc] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <Avatar className="h-10 w-10 ring-2 ring-[#009]/10 group-hover:ring-[#009]/20 transition-all duration-300">
                      <AvatarImage src={user?.avatar_url} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-[#009] to-[#0066cc] text-white font-medium">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-xl rounded-xl p-2" align="end" forceMount>
                  <div className="px-3 py-2 bg-gradient-to-r from-[#009]/5 to-[#0066cc]/5 rounded-lg mb-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-[#009] to-[#0066cc] text-white text-sm">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.full_name || 'Demo User'}</p>
                        <p className="text-xs text-gray-600">{user?.email || 'demo@example.com'}</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuItem className="rounded-lg hover:bg-[#009]/5 transition-colors duration-200">
                    <User className="mr-3 h-4 w-4 text-[#009]" />
                    <span className="text-gray-700">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg hover:bg-[#009]/5 transition-colors duration-200">
                    <Settings className="mr-3 h-4 w-4 text-[#009]" />
                    <span className="text-gray-700">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2 bg-gray-200/50" />
                  <DropdownMenuItem onClick={onSignOut} className="rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-200">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
