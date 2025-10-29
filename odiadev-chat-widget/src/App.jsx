import React, { useState } from 'react';
import ChatWidget from './ChatWidget';
import FloatingButton from './FloatingButton';

function App() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  
  const toggleWidget = () => {
    setIsWidgetOpen(!isWidgetOpen);
  };
  
  const closeWidget = () => {
    setIsWidgetOpen(false);
  };

  return (
    <div className="relative">
      {/* Main content - this would be the website content */}
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Our Website</h1>
        <p className="text-gray-600 mb-6">
          This is a demonstration of how the ODIADEV Voice AI chat widget can be embedded on any website.
          Click the chat button in the bottom right corner to open the voice-enabled chat widget.
        </p>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">How It Works</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Click the floating chat button to open the widget</li>
            <li>Use the microphone button to speak in Nigerian English</li>
            <li>Get voice responses from the AI assistant</li>
            <li>Works on all modern browsers with microphone support</li>
          </ul>
        </div>
      </div>
      
      {/* Floating chat button */}
      <FloatingButton onClick={toggleWidget} />
      
      {/* Chat widget */}
      <ChatWidget 
        isOpen={isWidgetOpen} 
        onClose={closeWidget} 
        onToggle={toggleWidget} 
      />
    </div>
  );
}

export default App;
