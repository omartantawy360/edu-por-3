import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy, Users, Shield, Target, Award, Rocket, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import DotGrid from '../components/ui/DotGrid';
import { gsap } from 'gsap';

const Landing = () => {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const cardsRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial animations
            gsap.from('.animate-title', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            });

            gsap.from('.animate-button', {
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                delay: 0.8,
                ease: 'back.out(1.7)'
            });

            gsap.from('.feature-card', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                delay: 1,
                ease: 'power2.out'
            });
        }, [heroRef, cardsRef]);

        return () => ctx.revert();
    }, []);

    const features = [
        {
            title: 'Team Management',
            desc: 'Create, join, and manage teams seamlessly with real-time feedback.',
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            title: 'Real-time Progress',
            desc: 'Track competition stages and submission statuses instantly.',
            icon: Target,
            color: 'text-violet-500',
            bg: 'bg-violet-500/10'
        },
        {
            title: 'Premium Certificates',
            desc: 'Automatically generate and download official competition certificates.',
            icon: Award,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 relative overflow-hidden">
            {/* Navigation Overlay */}
            <nav className="relative z-20 flex items-center justify-between p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
                        <Trophy className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                        EduComp
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/login')} className="hidden sm:flex">
                        Login
                    </Button>
                    <Button onClick={() => navigate('/login')} className="shadow-lg shadow-violet-500/20">
                        Get Started
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="text-center space-y-8" ref={heroRef}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-sm font-semibold mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">
                        <Sparkles className="h-4 w-4" />
                        <span>The Ultimate Competition Experience</span>
                    </div>
                    
                    <h1 className="animate-title text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Empowering the <br />
                        <span className="gradient-text">Next Generation</span> of Innovators
                    </h1>
                    
                    <p className="animate-title text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        A seamless platform for managing school competitions, team collaborations, 
                        and achieving excellence through technology and science.
                    </p>

                    <div className="animate-button flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button 
                            size="lg" 
                            onClick={() => navigate('/login')}
                            className="h-14 px-8 text-lg rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:scale-105 transition-transform shadow-xl shadow-violet-500/25 group"
                        >
                            Start Competing <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button 
                            size="lg" 
                            variant="outline" 
                            className="h-14 px-8 text-lg rounded-2xl bg-white/50 backdrop-blur-sm dark:bg-slate-900/50"
                            onClick={() => {
                                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Explore Features
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                <div id="features" className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8" ref={cardsRef}>
                    {features.map((feature, i) => (
                        <div 
                            key={i}
                            className="feature-card p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 group"
                        >
                            <div className={`${feature.bg} ${feature.color} h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Social Proof Section (Mock) */}
                <div className="mt-40 text-center animate-in fade-in duration-1000 delay-1000">
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-8 flex items-center justify-center gap-4">
                        <div className="h-px w-8 bg-slate-300 dark:bg-slate-700"></div>
                        Trusted by leading schools
                        <div className="h-px w-8 bg-slate-300 dark:bg-slate-700"></div>
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                         {/* Placeholder school logos icons or names */}
                         <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white italic">
                            <Shield className="h-6 w-6 text-violet-500" /> ACADEMY
                         </div>
                         <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white italic">
                            <Rocket className="h-6 w-6 text-indigo-500" /> TECH HIGH
                         </div>
                         <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white italic">
                            <Target className="h-6 w-6 text-blue-500" /> GLOBAL STEM
                         </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-slate-200/50 dark:border-slate-800/50 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-500">
                    © 2026 EduComp. All rights reserved. Created for educational excellence.
                </p>
            </footer>
        </div>
    );
};

export default Landing;
