"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';



interface Question {
    id: string;
    text: string;
    placeholder: string;
    type: 'text' | 'email' | 'url' | 'select' | 'textarea' | 'multiselect';
    options?: string[];
    required?: boolean;
}

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const QUESTIONS: Question[] = [
    {
        id: 'email',
        text: "Where should we reach you?",
        placeholder: "you@brand.com",
        type: 'email',
        required: true
    },
    {
        id: 'name',
        text: "What should we call you?",
        placeholder: "Your name",
        type: 'text',
        required: true
    },
    {
        id: 'brandName',
        text: "What’s your brand called?",
        placeholder: "Brand name",
        type: 'text',
        required: true
    },
    {
        id: 'website',
        text: "Do you have a website or store link?",
        placeholder: "https://yourbrand.com",
        type: 'url',
        required: true
    },
    {
        id: 'teamSize',
        text: "How big is your team right now?",
        placeholder: "Select team size",
        type: 'select',
        options: ['Just me', '2–5 people', '6–20 people', '20+ people'],
        required: true
    },
    {
        id: 'brandStage',
        text: "Where is your brand today?",
        placeholder: "Select brand stage",
        type: 'select',
        options: ['Just an idea', 'Getting ready to launch', 'Already live'],
        required: true
    },
    {
        id: 'needs',
        text: "What do you want help with?",
        placeholder: "Choose all that apply",
        type: 'multiselect',
        options: [
            'Research & planning',
            'Brand look & theme',
            'Custom AI setup',
            'Product try-ons',
            'Photoshoots',
            'Exports for marketplaces or social',
            'Launch & growth strategy'
        ],
        required: true
    },
    {
        id: 'notes',
        text: "Anything else you’d like to share?",
        placeholder: "Optional — context, goals, or ideas",
        type: 'textarea',
        required: false
    }
];


export const Form = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = QUESTIONS[step];
    const isLastQuestion = step === QUESTIONS.length - 1;

    const submitForm = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            const payload = {
                email: answers.email,
                name: answers.name,
                company_name: answers.brandName,
                website: answers.website,
                team_size: answers.teamSize as string,
                brand_stage: answers.brandStage as string,
                primary_need: Array.isArray(answers.needs) ? answers.needs : [answers.needs as string].filter(Boolean),
                additional_info: answers.notes as string,
            };



            const response = await fetch(`${API_URL}/api/waitlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });


            if (!response.ok) {
                throw new Error('Failed to submit');
            }

            setStep(step + 1); // Move to success state

        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        const currentAnswer = answers[currentQuestion.id];

        if (currentQuestion.required) {
            if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0) || (typeof currentAnswer === 'string' && !currentAnswer.trim())) {
                setError('This field is required to proceed.');
                return;
            }
        }

        setError('');

        if (isLastQuestion) {
            submitForm();
        } else {
            setStep(step + 1);
        }
    };

    const handleInputChange = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value
        }));
        if (error) setError('');
    };

    const handleMultiSelectChange = (value: string) => {
        setAnswers(prev => {
            const current = prev[currentQuestion.id];
            const currentArray = Array.isArray(current) ? current : [];
            if (currentArray.includes(value)) {
                return { ...prev, [currentQuestion.id]: currentArray.filter(item => item !== value) };
            } else {
                return { ...prev, [currentQuestion.id]: [...currentArray, value] };
            }
        });
        if (error) setError('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNext();
        }
    };




    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    } as const;

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } }
    } as const;

    return (
        <div className="w-full px-4 flex flex-col items-center justify-center relative z-20">
            <motion.div
                className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Logo and Beta Badge Header */}
                <motion.div
                    className="flex flex-col items-center justify-center mb-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 218 29" fill="none" className="h-6 md:h-8 w-auto">
                            <path d="M0.91259 27.2335L11.1881 0.824195H14.3962L24.6717 27.2335H20.9056L17.9299 19.7478H7.60792L4.67871 27.2335H0.91259ZM8.86329 16.5396H16.721L12.7689 6.17116L8.86329 16.5396Z" fill="#F8F6F3" />
                            <path d="M35.6704 19.7943C35.6704 22.5375 37.0652 23.8859 39.8085 23.8859H47.7592V27.2335H39.576C34.601 27.2335 32.1367 24.8158 32.1367 19.8408V0.824195H35.6704V19.7943Z" fill="#F8F6F3" />
                            <path d="M60.0132 19.7943C60.0132 22.5375 61.4081 23.8859 64.1513 23.8859H72.102V27.2335H63.9188C58.9438 27.2335 56.4796 24.8158 56.4796 19.8408V0.824195H60.0132V19.7943Z" fill="#F8F6F3" />
                            <path d="M90.9824 27.7915C83.4036 27.7915 78.8936 21.9796 78.8936 14.1219C78.8936 6.21765 83.4036 0.312745 90.9824 0.312745C98.4681 0.312745 103.025 6.21765 103.025 14.1219C103.025 21.9796 98.4681 27.7915 90.9824 27.7915ZM90.9824 24.4438C96.3758 24.4438 99.4445 19.9803 99.4445 14.1219C99.4445 8.17045 96.4688 3.66041 90.9824 3.66041C85.4029 3.66041 82.4272 8.17045 82.4272 14.1219C82.4272 19.9803 85.5424 24.4438 90.9824 24.4438Z" fill="#F8F6F3" />
                            <path d="M112.249 0.824195H121.734C126.616 0.824195 130.01 3.98588 130.01 8.6819C130.01 12.2155 128.243 14.9123 125.035 16.0747C125.732 16.7256 126.29 17.8415 126.895 19.2828L130.149 27.2335H126.011L123.175 20.3987C122.292 18.2134 121.408 16.9116 119.362 16.9116H115.782V27.2335H112.249V0.824195ZM115.782 13.5639H121.641C124.57 13.5639 126.43 11.4251 126.43 8.7284C126.43 6.03167 124.663 4.21835 121.734 4.21835H115.782V13.5639Z" fill="#F8F6F3" />
                            <path d="M143.299 8.26344V12.355H155.295V15.7492H143.299V20.3987C143.299 22.863 144.368 23.8859 146.786 23.8859H157.294V27.2335H147.344C142.276 27.2335 139.765 24.7693 139.765 19.7013V8.40293C139.765 3.33494 142.276 0.824195 147.344 0.824195H157.294V4.21835H147.158C144.787 4.21835 143.299 5.65971 143.299 8.26344Z" fill="#F8F6F3" />
                            <path d="M180.984 27.2335L191.259 0.824195H194.467L204.743 27.2335H200.977L198.001 19.7478H187.679L184.75 27.2335H180.984ZM188.935 16.5396H196.792L192.84 6.17116L188.935 16.5396Z" fill="#F8F6F3" />
                            <path d="M213.843 27.2335V0.824195H217.376V27.2335H213.843Z" fill="#F8F6F3" />
                        </svg>
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-medium text-white/50 bg-white/5 rounded-full border border-white/5">
                            beta
                        </span>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {step < QUESTIONS.length ? (
                        <motion.div
                            key={currentQuestion.id}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full text-center "
                        >
                            <motion.h2 variants={itemVariants} className="text-3xl italic md:text-4xl font-medium text-[#F8F6F3] mb-8 font-sans tracking-tight">
                                {currentQuestion.text}
                            </motion.h2>

                            <motion.div variants={itemVariants} className="relative group mb-2">
                                {currentQuestion.type === 'select' ? (
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {currentQuestion.options?.map((option) => {
                                            const isSelected = answers[currentQuestion.id] === option;
                                            return (
                                                <button
                                                    key={option}
                                                    onClick={() => handleInputChange(option)}
                                                    className={`
                                                        px-6 py-3 rounded-full border transition-all duration-300 flex items-center gap-2 text-sm md:text-base font-medium
                                                        ${isSelected
                                                            ? 'bg-[#C69C6D]/20 border-[#C69C6D] text-[#C69C6D]'
                                                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : currentQuestion.type === 'multiselect' ? (
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {currentQuestion.options?.map((option) => {
                                            const currentAnswers = answers[currentQuestion.id] as string[] || [];
                                            const isSelected = currentAnswers.includes(option);
                                            return (
                                                <button
                                                    key={option}
                                                    onClick={() => handleMultiSelectChange(option)}
                                                    className={`
                                                        px-6 py-3 rounded-full border transition-all duration-300 flex items-center gap-2 text-sm md:text-base font-medium
                                                        ${isSelected
                                                            ? 'bg-[#C69C6D]/20 border-[#C69C6D] text-[#C69C6D]'
                                                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    {isSelected && (
                                                        <div className="w-5 h-5 bg-[#C69C6D] rounded-full flex items-center justify-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : currentQuestion.type === 'textarea' ? (
                                    <textarea
                                        value={answers[currentQuestion.id] || ''}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={currentQuestion.placeholder}
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 text-[#F8F6F3] text-lg md:text-xl px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C69C6D]/50 focus:border-[#C69C6D]/30 focus:bg-white/10 transition-all placeholder:text-white/30 resize-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                                        autoFocus
                                    />
                                ) : (
                                    <input
                                        type={currentQuestion.type}
                                        value={answers[currentQuestion.id] || ''}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={currentQuestion.placeholder}
                                        className="w-full bg-white/5 border border-white/10 text-[#F8F6F3] text-lg md:text-xl px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C69C6D]/50 focus:border-[#C69C6D]/30 focus:bg-white/10 transition-all placeholder:text-white/30"
                                        autoFocus
                                    />
                                )}
                            </motion.div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-red-400 text-sm mb-6 text-left pl-2"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <motion.div variants={itemVariants} className="mt-8">
                                <motion.button
                                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                    className={`w-full h-[47.189px] rounded-[10.762px]
    bg-[#0F1C2D] text-[#F8F6F3]
    flex items-center justify-center gap-2
    font-medium text-[16.161px]
    hover:opacity-90 transition-opacity
    ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
  `}
                                    style={{
                                        fontFamily: 'var(--font-instrument), sans-serif',
                                    }}
                                >
                                    {isSubmitting ? 'Submitting...' : (isLastQuestion ? 'Submit' : 'Next')}
                                    {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                                </motion.button>

                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full text-center text-white"
                        >
                            <div className="mb-6 flex justify-center">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 shadow-inner ring-1 ring-green-500/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-3xl font-medium text-[#F8F6F3] mb-4 tracking-tight">
                                You're on the list!
                            </h2>
                            <p className="opacity-70 mb-8 text-lg font-light">
                                We'll notify you when <span className="text-[#C69C6D] font-normal">{answers['brandName']}</span> is ready.
                            </p>
                            <button
                                onClick={() => {
                                    setStep(0);
                                    setAnswers({});
                                }}
                                className="text-sm text-white/40 hover:text-white transition-colors uppercase tracking-widest text-[10px]"
                            >
                                Start over
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
