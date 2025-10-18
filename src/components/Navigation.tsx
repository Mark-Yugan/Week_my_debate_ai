
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
    <nav className="bg-white border-b border-neutral-200 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group hover:opacity-80 transition-all duration-200">
          <div className="bg-neutral-100 p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200 border border-neutral-200">
            <img 
              src="/lovable-uploads/80a86b55-ac06-4e1e-905b-e5574803f537.png" 
              alt="MyDebate.ai Logo" 
              className="h-8 w-8 object-contain"
            />
          </div>
          <h1 className="text-2xl font-medium text-azul tracking-wide">
            MyDebate.ai
          </h1>
        </Link>



        {/* Right Side */}
        <div className="flex items-center space-x-6">
          {/* Show login button if not authenticated */}
          {!isAuthenticated ? (
            <Link to="/login">
              <Button className="bg-azul hover:bg-steel-blue text-white px-8 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200">
                Sign In
              </Button>
            </Link>
          ) : (
            <>
              {/* Tokens - only show when authenticated */}
              <div className="flex items-center space-x-3 bg-neutral-100 px-4 py-2 rounded-xl border border-neutral-200">
                <Coins className="h-5 w-5 text-azul" />
                <Badge variant="secondary" className="bg-azul text-white border-0 px-3 py-1 font-medium">
                  {userTokens} tokens
                </Badge>
              </div>

              {/* Premium Button */}
              <Button 
                size="sm" 
                onClick={onGetPremium}
                className="bg-steel-blue hover:bg-indigo-dye text-white px-6 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Crown className="h-4 w-4 mr-2" />
                <span>Get Premium</span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-neutral-100 transition-all duration-200">
                    <Avatar className="h-10 w-10 ring-2 ring-neutral-200">
                      <AvatarImage src={user?.avatar_url} className="object-cover" />
                      <AvatarFallback className="bg-azul text-white font-medium">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white border border-neutral-200 shadow-lg rounded-xl p-2" align="end" forceMount>
                  <div className="px-3 py-2 bg-neutral-100 rounded-lg mb-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar_url} />
                        <AvatarFallback className="bg-azul text-white text-sm">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gunmetal">{user?.full_name || 'Demo User'}</p>
                        <p className="text-xs text-neutral-600">{user?.email || 'demo@example.com'}</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuItem className="rounded-lg hover:bg-neutral-50 transition-colors duration-200">
                    <User className="mr-3 h-4 w-4 text-azul" />
                    <span className="text-neutral-700">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg hover:bg-neutral-50 transition-colors duration-200">
                    <Settings className="mr-3 h-4 w-4 text-azul" />
                    <span className="text-neutral-700">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2 bg-neutral-200" />
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
