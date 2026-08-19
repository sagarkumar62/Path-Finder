import Link from 'next/link';
import { Compass, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <Compass className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
              CAREER PATHFINDER
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 border border-indigo-200/60">
                <Sparkles className="mr-0.5 h-2.5 w-2.5" /> AI
              </span>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</Link>
          <Link href="#career-discovery" className="hover:text-indigo-600 transition-colors">Career Discovery</Link>
          <Link href="#skill-gap" className="hover:text-indigo-600 transition-colors">Skill Gap AI</Link>
          <Link href="#roadmap" className="hover:text-indigo-600 transition-colors">Roadmaps</Link>
          <Link href="#assistant" className="hover:text-indigo-600 transition-colors">AI Mentor</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/onboarding">
            <Button variant="primary" size="sm" className="gap-1.5">
              Find My Path <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
