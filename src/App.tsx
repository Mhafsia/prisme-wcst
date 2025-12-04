import React, { useState } from 'react'
import { SettingsProvider, SettingsModal, useSettings, T } from './Settings'
import ToolSelector from './ToolSelector'
import WCSTApp from './WCSTApp'
import SUS from './SUS'
import './styles.css'

type ActiveTool = 'selector' | 'wcst' | 'sus'

function AppContent() {
    const [activeTool, setActiveTool] = useState<ActiveTool>('selector')
    const [participantId, setParticipantId] = useState('')

    const handleBack = () => {
        setActiveTool('selector')
    }

    if (activeTool === 'wcst') {
        return <WCSTApp participantId={participantId} onBack={handleBack} />
    }

    if (activeTool === 'sus') {
        return (
            <SUS
                participantId={participantId}
                onBack={handleBack}
                onComplete={(score, answers, nps) => {
                    console.log('SUS completed:', score, answers, nps)
                }}
            />
        )
    }

    return (
        <ToolSelector
            participantId={participantId}
            setParticipantId={setParticipantId}
            onSelectWCST={() => setActiveTool('wcst')}
            onSelectSUS={() => setActiveTool('sus')}
        />
    )
}

export default function App() {
    return (
        <SettingsProvider>
            <AppContent />
        </SettingsProvider>
    )
}
