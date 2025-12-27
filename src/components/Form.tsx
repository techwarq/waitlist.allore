"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';



interface Question {
    id: string;
    text: string;
    placeholder: string;
    helperText?: string;
    type: 'text' | 'email' | 'url' | 'select' | 'textarea' | 'multiselect';
    options?: string[];
    required?: boolean;
}

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const QUESTIONS: Question[] = [
    {
        id: 'email',
        text: "Share your Email ID?",
        placeholder: "For Ex: support@alloreai.com",
        type: 'email',
        required: true
    },
    {
        id: 'name',
        text: "What’s your Name?",
        placeholder: "For Ex: Himanshu",
        type: 'text',
        required: true
    },
    {
        id: 'brandName',
        text: "What’s your Brand Name?",
        placeholder: "For Ex: ALLORE AI",
        type: 'text',
        required: true
    },
    {
        id: 'website',
        text: "Do you have a website or store link?",
        placeholder: "For Ex: https://alloreai.com",
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
        text: "What’s your Current Need?",
        placeholder: "Choose all that apply",
        type: 'multiselect',
        options: [
            'Research & planning',
            'Brand theme',
            'Custom AI Model',
            'Product Try-On',
            'Photoshoots & Export Assests',
            'Launch strategy',
            'Something Else'
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

            const response = await fetch(`${API_URL}api/waitlist`, {
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

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
            setError('');
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
        if (e.key === 'Enter' && currentQuestion.type !== 'textarea') {
            e.preventDefault();
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
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
    } as const;

    return (
        <div className="w-full px-4 flex flex-col items-center justify-center relative z-20">
            <motion.div
                className="bg-[#F8F6F3] shadow-2xl relative flex flex-col w-full max-w-[560px]"
                style={{
                    minHeight: '373.878px',
                    borderRadius: '17.959px'
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Progress Bar */}
                {step < QUESTIONS.length && (
                    <div className="flex items-center justify-between mb-8 px-6 md:px-12 pt-10 relative w-full">
                        {/* Connecting Line Container */}
                        <div className="absolute left-6 md:left-12 right-6 md:right-12 top-[calc(2.5rem+7.5px)] -translate-y-1/2 h-[3px] z-0 mx-2">
                            {/* Background Line */}
                            <div className="absolute inset-0 bg-gray-200" />

                            {/* Progress Line */}
                            <div
                                className="absolute left-0 top-0 bottom-0 bg-[#0F1C2D] transition-all duration-500 ease-out"
                                style={{
                                    width: `${(step / (QUESTIONS.length - 1)) * 100}%`
                                }}
                            />
                        </div>

                        {QUESTIONS.map((_, index) => {
                            const isCompleted = index < step;
                            const isCurrent = index === step;

                            return (
                                <div key={index} className="relative z-10 flex items-center justify-center bg-[#F8F6F3]">
                                    {isCompleted ? (
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="transition-all duration-300">
                                            <circle cx="7.5" cy="7.5" r="7.5" fill="#0F1C2D" />
                                            <path d="M10.4475 4.1358C10.3241 4.06702 10.1884 4.02328 10.0481 4.00708C9.90782 3.99088 9.76574 4.00254 9.62997 4.0414C9.4942 4.08025 9.36741 4.14554 9.25685 4.23352C9.14628 4.3215 9.05412 4.43045 8.98562 4.55414L6.9901 8.15181L5.84803 7.00768C5.74888 6.90484 5.63027 6.8228 5.49913 6.76637C5.36799 6.70993 5.22695 6.68023 5.08422 6.67898C4.9415 6.67774 4.79996 6.70499 4.66786 6.75913C4.53576 6.81327 4.41575 6.89323 4.31483 6.99434C4.2139 7.09544 4.13409 7.21567 4.08004 7.34801C4.026 7.48035 3.9988 7.62214 4.00004 7.76512C4.00128 7.9081 4.03093 8.0494 4.08727 8.18078C4.1436 8.31215 4.22549 8.43098 4.32815 8.53031L6.47791 10.684C6.68107 10.888 6.95516 11 7.23786 11L7.38673 10.9892C7.55148 10.9661 7.70864 10.9051 7.84582 10.8108C7.98301 10.7165 8.09648 10.5916 8.1773 10.446L10.8645 5.60028C10.9331 5.47669 10.9768 5.34077 10.9929 5.20028C11.0091 5.05979 10.9975 4.91749 10.9588 4.7815C10.92 4.64551 10.8549 4.5185 10.7672 4.40771C10.6795 4.29691 10.5708 4.20452 10.4475 4.1358Z" fill="#F8F6F3" />
                                        </svg>
                                    ) : isCurrent ? (
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="transition-all duration-300 scale-125">
                                            <circle cx="7.5" cy="7.5" r="7.5" fill="#0F1C2D" />
                                            <circle cx="7.5" cy="7.5" r="3.5" fill="#F8F6F3" />
                                        </svg>
                                    ) : (
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="transition-all duration-300">
                                            <circle cx="7.5" cy="7.5" r="7.5" fill="#D9D9D9" />
                                        </svg>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step < QUESTIONS.length ? (
                        <motion.div
                            key={currentQuestion.id}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full text-left px-6 md:px-12 pb-10 flex flex-col justify-between flex-1"
                        >
                            <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-medium text-[#0F1C2D] mb-4 font-sans tracking-tight leading-tight">
                                {currentQuestion.text}
                            </motion.h2>

                            <motion.div variants={itemVariants} className="relative group mb-8 mt-2 flex-grow flex flex-col justify-center">
                                {currentQuestion.type === 'select' ? (
                                    <div className="flex flex-wrap gap-2">
                                        {currentQuestion.options?.map((option) => {
                                            const isSelected = answers[currentQuestion.id] === option;
                                            return (
                                                <button
                                                    key={option}
                                                    onClick={() => handleInputChange(option)}
                                                    className={`
                                                        px-5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium
                                                        ${isSelected
                                                            ? 'bg-[#0F1C2D] text-white shadow-lg'
                                                            : 'bg-[#E5E5E5] text-[#0F1C2D]/70 hover:bg-[#D4D4D4] hover:text-[#0F1C2D]'
                                                        }
                                                    `}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : currentQuestion.type === 'multiselect' ? (
                                    <div className="flex flex-wrap gap-2">
                                        {currentQuestion.options?.map((option) => {
                                            const currentAnswers = answers[currentQuestion.id] as string[] || [];
                                            const isSelected = currentAnswers.includes(option);
                                            return (
                                                <button
                                                    key={option}
                                                    onClick={() => handleMultiSelectChange(option)}
                                                    className={`
                                                        px-5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium border
                                                        ${isSelected
                                                            ? 'bg-[#0F1C2D] text-white border-[#0F1C2D] shadow-lg'
                                                            : 'bg-[#E5E5E5] text-[#0F1C2D]/70 border-transparent hover:bg-[#D4D4D4] hover:text-[#0F1C2D]'
                                                        }
                                                    `}
                                                >
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
                                        className="w-full bg-transparent border-b border-gray-300 text-[#0F1C2D] text-xl px-0 py-2 focus:outline-none focus:border-[#0F1C2D] transition-colors placeholder:text-gray-300 resize-none font-light"
                                        autoFocus
                                    />
                                ) : (
                                    <input
                                        type={currentQuestion.type}
                                        value={answers[currentQuestion.id] || ''}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={currentQuestion.placeholder}
                                        className="w-full bg-transparent border-b border-gray-300 text-[#0F1C2D] text-xl px-0 py-2 focus:outline-none focus:border-[#0F1C2D] transition-colors placeholder:text-gray-300 font-light"
                                        autoFocus
                                    />
                                )}
                            </motion.div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-red-500 text-sm mb-4 font-medium"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <motion.div variants={itemVariants} className="flex items-center gap-4 mt-auto">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleBack}
                                    disabled={step === 0 || isSubmitting}
                                    className={`
                                        px-8 py-3 rounded-xl bg-[#E5E5E5] text-[#0F1C2D] font-medium text-lg flex items-center justify-center gap-2 transition-colors
                                        hover:bg-[#D4D4D4]
                                        disabled:opacity-30 disabled:cursor-not-allowed
                                     `}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Back
                                </motion.button>

                                <motion.button
                                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                    className={`
                                        px-10 py-3 rounded-xl bg-[#0F1C2D] text-white font-medium text-lg flex items-center justify-center gap-2 ml-auto
                                        hover:bg-[#0F1C2D]/90 transition-colors shadow-lg
                                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                                    `}
                                    style={{
                                        fontFamily: 'var(--font-instrument), sans-serif',
                                    }}
                                >
                                    {isSubmitting ? 'Sending...' : (isLastQuestion ? 'Submit' : 'Next')}
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
                            className="w-full text-center text-[#0F1C2D] p-12"
                        >
                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-sm">
                                    <Check className="w-10 h-10" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-medium text-[#0F1C2D] mb-4 tracking-tight">
                                You're on the list!
                            </h2>
                            <p className="opacity-70 mb-8 text-lg font-light text-[#0F1C2D]">
                                We'll notify you when <span className="text-[#C69C6D] font-medium">{answers['brandName']}</span> is ready.
                            </p>
                            <button
                                onClick={() => {
                                    setStep(0);
                                    setAnswers({});
                                }}
                                className="text-sm text-[#0F1C2D]/50 hover:text-[#0F1C2D] transition-colors uppercase tracking-widest font-medium"
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
