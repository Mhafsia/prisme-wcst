import React, { useState } from 'react'
import ToolSelector from './ToolSelector'
import WCSTApp from './WCSTApp'
import SUS from './SUS'
import './styles.css'

type ActiveTool = 'selector' | 'wcst' | 'sus'

export default function App() {
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
                onComplete={(score, answers) => {
                    console.log('SUS completed:', score, answers)
                    // Stay on the SUS page to show score and download
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
