import React, { useState, useMemo } from 'react'
import './styles.css'

const SUS_QUESTIONS = [
    "I think that I would like to use this game frequently.",
    "I found the game unnecessarily complex.",
    "I thought the game was easy to use.",
    "I think that I would need the support of a technical person to be able to use this game.",
    "I found the various functions in this game were well integrated.",
    "I thought there was too much inconsistency in this game.",
    "I would imagine that most people would learn to use this game very quickly.",
    "I found the game very cumbersome to use.",
    "I felt very confident using the game.",
    "I needed to learn a lot of things before I could get going with this game."
]

const SCALE_OPTIONS = [
    { value: 1, emoji: '😞', label: 'Strongly Disagree' },
    { value: 2, emoji: '🙁', label: '' },
    { value: 3, emoji: '😐', label: '' },
    { value: 4, emoji: '🙂', label: '' },
    { value: 5, emoji: '😊', label: 'Strongly Agree' },
]

interface SUSProps {
    onComplete: (score: number, answers: number[]) => void
    onBack: () => void
    participantId: string
}

export default function SUS({ onComplete, onBack, participantId }: SUSProps) {
    const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null))
    const [currentQuestion, setCurrentQuestion] = useState(0)

    const handleSelect = (questionIndex: number, value: number) => {
        const newAnswers = [...answers]
        newAnswers[questionIndex] = value
        setAnswers(newAnswers)

        // Auto-advance to next question after a short delay
        if (questionIndex < 9) {
            setTimeout(() => setCurrentQuestion(questionIndex + 1), 300)
        }
    }

    const calculateSUSScore = () => {
        // SUS scoring: 
        // For odd questions (1,3,5,7,9): score = response - 1
        // For even questions (2,4,6,8,10): score = 5 - response
        // Total = sum * 2.5
        let total = 0
        answers.forEach((answer, index) => {
            if (answer === null) return
            if (index % 2 === 0) {
                // Odd questions (0-indexed even)
                total += (answer - 1)
            } else {
                // Even questions (0-indexed odd)
                total += (5 - answer)
            }
        })
        return total * 2.5
    }

    const allAnswered = answers.every(a => a !== null)
    const susScore = useMemo(() => allAnswered ? calculateSUSScore() : null, [answers, allAnswered])

    const handleSubmit = () => {
        if (allAnswered && susScore !== null) {
            onComplete(susScore, answers as number[])
        }
    }

    const downloadCSV = () => {
        const headers = [
            'participant_id',
            'timestamp_utc',
            ...SUS_QUESTIONS.map((_, i) => `q${i + 1}`),
            'sus_score'
        ]

        const row = [
            participantId || 'anon',
            new Date().toISOString(),
            ...answers,
            susScore
        ]

        const csv = '\uFEFF' + headers.join(';') + '\n' + row.join(';')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `prisme-sus-${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button className="secondary" onClick={onBack} style={{ padding: '8px 16px' }}>
                    ← Retour
                </button>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    Question {currentQuestion + 1} / 10
                </div>
            </header>

            <div className="intro-screen" style={{ marginTop: 20 }}>
                <h2 style={{
                    marginBottom: '10px',
                    textAlign: 'center',
                    background: 'linear-gradient(to right, #f97316, #ec4899, #a855f7, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '2rem',
                    letterSpacing: '4px',
                    fontWeight: '900'
                }}>
                    PRISME
                </h2>
                <h3 style={{ marginBottom: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '1rem' }}>
                    System Usability Scale
                </h3>

                {/* Progress bar */}
                <div style={{
                    width: '100%',
                    height: 8,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    marginBottom: 30,
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${(answers.filter(a => a !== null).length / 10) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(to right, #f97316, #ec4899)',
                        borderRadius: 4,
                        transition: 'width 0.3s ease'
                    }} />
                </div>

                {/* Current Question */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: 24,
                    borderRadius: 16,
                    marginBottom: 20
                }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: 24, lineHeight: 1.6 }}>
                        <strong>{currentQuestion + 1}.</strong> {SUS_QUESTIONS[currentQuestion]}
                    </p>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 8,
                        flexWrap: 'wrap'
                    }}>
                        {SCALE_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(currentQuestion, option.value)}
                                style={{
                                    flex: 1,
                                    minWidth: 60,
                                    padding: '16px 8px',
                                    borderRadius: 12,
                                    border: answers[currentQuestion] === option.value
                                        ? '2px solid #ec4899'
                                        : '1px solid rgba(255,255,255,0.1)',
                                    background: answers[currentQuestion] === option.value
                                        ? 'rgba(236, 72, 153, 0.2)'
                                        : 'rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8
                                }}
                            >
                                <span style={{ fontSize: 28 }}>{option.emoji}</span>
                                <span style={{ fontSize: 18, fontWeight: 600 }}>{option.value}</span>
                                {option.label && (
                                    <span style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>
                                        {option.label}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                    <button
                        className="secondary"
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        style={{ flex: 1, padding: 12 }}
                    >
                        ← Précédent
                    </button>

                    {currentQuestion < 9 ? (
                        <button
                            className="primary"
                            onClick={() => setCurrentQuestion(currentQuestion + 1)}
                            disabled={answers[currentQuestion] === null}
                            style={{ flex: 1, padding: 12 }}
                        >
                            Suivant →
                        </button>
                    ) : (
                        <button
                            className="primary"
                            onClick={handleSubmit}
                            disabled={!allAnswered}
                            style={{ flex: 1, padding: 12 }}
                        >
                            Terminer ✓
                        </button>
                    )}
                </div>

                {/* Quick navigation dots */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 20
                }}>
                    {answers.map((answer, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentQuestion(i)}
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                border: 'none',
                                background: answer !== null
                                    ? 'linear-gradient(to right, #f97316, #ec4899)'
                                    : i === currentQuestion
                                        ? 'rgba(255,255,255,0.5)'
                                        : 'rgba(255,255,255,0.2)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        />
                    ))}
                </div>

                {/* Score display when complete */}
                {allAnswered && susScore !== null && (
                    <div style={{
                        marginTop: 30,
                        padding: 24,
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 16,
                        textAlign: 'center'
                    }}>
                        <h3 style={{ marginBottom: 16, color: '#22c55e' }}>✓ Questionnaire complété !</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 16 }}>
                            Score SUS: <span style={{ color: '#ec4899' }}>{susScore.toFixed(1)}</span> / 100
                        </p>
                        <button className="primary" onClick={downloadCSV} style={{ padding: '12px 24px' }}>
                            📥 Télécharger CSV
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
