
// @ts-nocheck
import { Button } from '@/components/ui/button';

interface GoogleSignInButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const GoogleSignInButton = ({ onClick, isLoading }: GoogleSignInButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full btn-neon-outline flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400"></div>
      ) : (
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
      )}
      {isLoading ? 'Connecting...' : 'Continue with Google'}
    </Button>
  );
};

export default GoogleSignInButton;
