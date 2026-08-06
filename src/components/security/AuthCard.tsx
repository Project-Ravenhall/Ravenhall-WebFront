import { Link } from 'react-router-dom';

interface AuthCardProps {
  title: string;
  username: string;
  password: string;
  passwordConfirm?: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPasswordConfirmChange?: (value: string) => void;
  isSignup: boolean;
  errorMessage?: string;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
}

const AuthBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* this is subtle ambient glows */}
    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
    <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[800px] h-[800px] bg-violet-500/10 rounded-full blur-[120px]" />
  </div>
);

// this is shared input styles, it's defined once and applied to all three inputs
const inputClassName =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] ' +
  'placeholder:text-slate-500 outline-none transition-all duration-200 ' +
  'focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20';

export const AuthCard = ({
  title,
  username,
  password,
  passwordConfirm,
  onUsernameChange,
  onPasswordChange,
  onPasswordConfirmChange,
  isSignup,
  errorMessage,
  onSubmit,
}: AuthCardProps) => {
  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden">
      <AuthBackground />

      {/* card */}
      <div className="relative z-10 w-full max-w-md mx-4 py-12 px-10 rounded-3xl backdrop-blur-xl bg-slate-950/70 border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)_inset]">

        {/* logo / brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-indigo-500 to-violet-500 shadow-[0_8px_24px_rgba(99,102,241,0.4)]">
            {/* Raven / feather icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C9 2 4 5 4 10C4 13 6 15.5 9 17L8 22H16L15 17C18 15.5 20 13 20 10C20 5 15 2 12 2Z" fill="white" fillOpacity="0.9"/>
              <path d="M12 2C14 4 16 6 15 10C14 12 12 13 10 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-white">Ravenhall</h1>
          <p className="text-sm mt-1 text-slate-400/80">{title}</p>
        </div>

        {errorMessage && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/30 text-red-300">
            {errorMessage}
          </div>
        )}

        {/* form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide text-slate-400/70">USERNAME</label>
            <input
              id="auth-username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              autoComplete="username"
              required
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide text-slate-400/70">PASSWORD</label>
            <input
              id="auth-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              required
              className={inputClassName}
            />
          </div>

          {/* isSignup && basically means a compact if-condition, if isSignup is true we continue to look on the right side and render the field */}
          {isSignup && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium tracking-wide text-slate-400/70">CONFIRM PASSWORD</label>
              <input
                id="auth-password-confirm"
                type="password"
                placeholder="Confirm your password"
                value={passwordConfirm}
                onChange={(e) => onPasswordConfirmChange?.(e.target.value)}
                autoComplete="new-password"
                required
                className={inputClassName}
              />
            </div>
          )}

          <button
            id="auth-submit"
            type="submit"
            className="mt-2 w-full py-3 rounded-xl font-semibold text-white text-sm tracking-wide cursor-pointer
              bg-gradient-to-br from-indigo-500 to-violet-500 transition-opacity duration-200 hover:opacity-90"
          >
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>

        </form>

        {/* footer link */}
        <p className="text-center text-sm mt-6 text-slate-400/60">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <Link
            to={isSignup ? '/login' : '/signup'}
            className="font-medium text-indigo-400 no-underline hover:text-indigo-300 transition-colors duration-150"
          >
            {isSignup ? 'Sign in' : 'Create one'}
          </Link>
        </p>

      </div>
    </div>
  );
};