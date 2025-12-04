import React from 'react'
import './styles.css'

interface ToolSelectorProps {
    onSelectWCST: () => void
    onSelectSUS: () => void
    participantId: string
    setParticipantId: (id: string) => void
}

export default function ToolSelector({ onSelectWCST, onSelectSUS, participantId, setParticipantId }: ToolSelectorProps) {
    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    PRISME Toolkit v1.0
                </div>
            </header>

            <div className="intro-screen" style={{ marginTop: 40 }}>
                <h1 style={{
                    marginBottom: '10px',
                    textAlign: 'center',
                    background: 'linear-gradient(to right, #f97316, #ec4899, #a855f7, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '3.5rem',
                    letterSpacing: '6px',
                    fontWeight: '900'
                }}>
                    PRISME
                </h1>
                <h2 style={{ marginBottom: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '1.2rem', fontWeight: '400' }}>
                    Toolkit
                </h2>

                {/* Participant ID */}
                <div style={{ maxWidth: 300, margin: '0 auto 40px' }}>
                    <div className="form-group">
                        <label>ID Participant:</label>
                        <input
                            type="text"
                            value={participantId}
                            onChange={e => setParticipantId(e.target.value)}
                            placeholder="Ex: P001"
                        />
                    </div>
                </div>

                {/* Tool Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 24,
                    maxWidth: 600,
                    margin: '0 auto'
                }}>
                    {/* WCST Card */}
                    <button
                        onClick={onSelectWCST}
                        disabled={!participantId.trim()}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 20,
                            padding: 32,
                            cursor: participantId.trim() ? 'pointer' : 'not-allowed',
                            transition: 'all 0.3s',
                            opacity: participantId.trim() ? 1 : 0.5
                        }}
                        onMouseEnter={e => {
                            if (participantId.trim()) {
                                e.currentTarget.style.transform = 'translateY(-5px)'
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                                e.currentTarget.style.borderColor = '#818cf8'
                            }
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                        }}
                    >
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🃏</div>
                        <h3 style={{ marginBottom: 8, color: '#e2e8f0', fontSize: '1.3rem' }}>WCST</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            Wisconsin Card Sorting Test
                        </p>
                    </button>

                    {/* SUS Card */}
                    <button
                        onClick={onSelectSUS}
                        disabled={!participantId.trim()}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 20,
                            padding: 32,
                            cursor: participantId.trim() ? 'pointer' : 'not-allowed',
                            transition: 'all 0.3s',
                            opacity: participantId.trim() ? 1 : 0.5
                        }}
                        onMouseEnter={e => {
                            if (participantId.trim()) {
                                e.currentTarget.style.transform = 'translateY(-5px)'
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                                e.currentTarget.style.borderColor = '#ec4899'
                            }
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                        }}
                    >
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                        <h3 style={{ marginBottom: 8, color: '#e2e8f0', fontSize: '1.3rem' }}>SUS</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            System Usability Scale
                        </p>
                    </button>
                </div>

                {!participantId.trim() && (
                    <p style={{ textAlign: 'center', color: '#f97316', marginTop: 24, fontSize: '0.9rem' }}>
                        ⚠️ Veuillez entrer un ID participant pour continuer
                    </p>
                )}
            </div>
        </div>
    )
}
