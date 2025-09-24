import React, { useState } from 'react';

interface DebateHistoryViewerProps {
  onViewSession?: (sessionId: string) => void;
}

export default function DebateHistoryViewer({ onViewSession }: DebateHistoryViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="p-4 border rounded">
        <h1 className="text-2xl font-bold mb-4">Debate History</h1>
        <p>Debug: Component is loading correctly</p>
        <input
          type="text"
          placeholder="Search debates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {searchTerm && <p>Searching for: {searchTerm}</p>}
      </div>
    </div>
  );
}
