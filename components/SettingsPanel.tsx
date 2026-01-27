import React, { useState, useEffect } from 'react';
import { Settings, Key, Save, Check, AlertCircle, Sparkles, RefreshCw, Trash2 } from 'lucide-react';

interface SettingsPanelProps {
    onApiKeyChange?: (apiKey: string) => void;
}

// 支持的LLM模型
const LLM_MODELS = [
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onApiKeyChange }) => {
    const [apiKey, setApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
    const [isSaved, setIsSaved] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

    useEffect(() => {
        const savedApiKey = localStorage.getItem('babel_api_key');
        const savedModel = localStorage.getItem('babel_llm_model');
        if (savedApiKey) {
            setApiKey(savedApiKey);
            setIsSaved(true);
        }
        if (savedModel) {
            setSelectedModel(savedModel);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('babel_api_key', apiKey);
        localStorage.setItem('babel_llm_model', selectedModel);
        setIsSaved(true);
        onApiKeyChange?.(apiKey);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleTestConnection = async () => {
        if (!apiKey) {
            setTestStatus('error');
            return;
        }

        setTestStatus('testing');

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            if (response.ok) {
                setTestStatus('success');
            } else {
                setTestStatus('error');
            }
        } catch (error) {
            setTestStatus('error');
        }

        setTimeout(() => setTestStatus('idle'), 3000);
    };

    const handleDelete = () => {
        localStorage.removeItem('babel_api_key');
        localStorage.removeItem('babel_llm_model');
        setApiKey('');
        setSelectedModel('gemini-2.5-flash');
        setIsSaved(false);
        setTestStatus('idle');
        onApiKeyChange?.('');
    };

    const maskedApiKey = apiKey ? `${apiKey.slice(0, 8)}${'*'.repeat(Math.max(0, apiKey.length - 12))}${apiKey.slice(-4)}` : '';

    return (
        <div className="w-full space-y-6">
            {/* Newspaper Masthead */}
            <div className="text-center border-b-3 border-ink pb-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-ink"></div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/60">Administration</span>
                    <div className="flex-1 h-px bg-ink"></div>
                </div>
                <div className="inline-flex items-center gap-3">
                    <Settings className="w-6 h-6 text-ink" />
                    <h1 className="font-headline text-3xl md:text-4xl font-bold text-ink uppercase tracking-wider">
                        Editorial Office
                    </h1>
                </div>
                <p className="text-sm font-serif italic text-ink/60 mt-2">系统设置</p>
            </div>

            {/* API Key Configuration */}
            <div className="bg-paper border-3 border-ink p-6 space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-ink/20 pb-3">
                    <Key className="w-5 h-5 text-ink" />
                    <h3 className="font-headline font-bold uppercase tracking-wide">LLM Interface Configuration</h3>
                </div>

                {/* API Key Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-mono font-bold uppercase text-ink/70">
                        Google Gemini API Key
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <input
                                type={showKey ? 'text' : 'password'}
                                value={apiKey}
                                onChange={(e) => {
                                    setApiKey(e.target.value);
                                    setIsSaved(false);
                                }}
                                placeholder="Enter your API Key..."
                                className="w-full px-4 py-3 border-2 border-ink/30 bg-paper text-ink font-mono text-sm focus:border-ink focus:outline-none transition-colors"
                            />
                            <button
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink text-xs font-mono uppercase"
                            >
                                {showKey ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-ink/50 font-serif italic">
                        Your API Key is stored securely in local browser storage. It is never uploaded to any server.
                    </p>
                </div>

                {/* Model Selection */}
                <div className="space-y-2">
                    <label className="block text-sm font-mono font-bold uppercase text-ink/70">
                        Select Model
                    </label>
                    <select
                        value={selectedModel}
                        onChange={(e) => {
                            setSelectedModel(e.target.value);
                            setIsSaved(false);
                        }}
                        className="w-full px-4 py-3 border-2 border-ink/30 bg-paper text-ink font-mono text-sm focus:border-ink focus:outline-none transition-colors cursor-pointer"
                    >
                        {LLM_MODELS.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.name} ({model.provider})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t-2 border-ink/20">
                    <button
                        onClick={handleTestConnection}
                        disabled={!apiKey || testStatus === 'testing'}
                        className={`flex items-center gap-2 px-4 py-2 border-2 font-mono font-bold text-sm uppercase transition-all
                            ${testStatus === 'testing' ? 'border-ink/30 text-ink/30 cursor-wait'
                                : testStatus === 'success' ? 'border-ink bg-paper-contrast text-ink'
                                    : testStatus === 'error' ? 'border-crimson text-crimson'
                                        : 'border-ink/30 text-ink hover:border-ink'}`}
                    >
                        {testStatus === 'testing' ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : testStatus === 'success' ? (
                            <Check className="w-4 h-4" />
                        ) : testStatus === 'error' ? (
                            <AlertCircle className="w-4 h-4" />
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        {testStatus === 'testing' ? 'Testing...' :
                            testStatus === 'success' ? 'Connected' :
                                testStatus === 'error' ? 'Failed' : 'Test'}
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!apiKey}
                        className={`flex items-center gap-2 px-6 py-2 font-mono font-bold text-sm uppercase transition-all
                            ${isSaved ? 'bg-ink text-paper'
                                : apiKey ? 'bg-ink text-paper hover:bg-crimson'
                                    : 'bg-ink/30 text-paper/50 cursor-not-allowed'}`}
                    >
                        {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {isSaved ? 'Saved' : 'Save'}
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={!apiKey}
                        className={`flex items-center gap-2 px-4 py-2 border-2 font-mono font-bold text-sm uppercase transition-all
                            ${apiKey ? 'border-crimson text-crimson hover:bg-crimson hover:text-paper'
                                : 'border-ink/20 text-ink/30 cursor-not-allowed'}`}
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-paper-contrast border-2 border-ink/30 p-4">
                <h4 className="font-headline font-bold text-sm uppercase mb-2">📖 How to Get an API Key</h4>
                <ol className="text-sm font-serif text-ink/70 space-y-1 list-decimal list-inside">
                    <li>Visit <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-ink underline hover:text-crimson">Google AI Studio</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Click "Create API key" to generate a new key</li>
                    <li>Copy the generated key and paste it above</li>
                </ol>
            </div>

            {/* Current Status */}
            {apiKey && (
                <div className="bg-ink/5 border-2 border-ink/20 p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-mono font-bold uppercase">Current Configuration</p>
                        <p className="text-xs text-ink/60 font-mono mt-1">
                            API Key: {maskedApiKey}
                        </p>
                        <p className="text-xs text-ink/60 font-mono">
                            Model: {LLM_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${apiKey ? 'bg-ink' : 'bg-crimson'}`}></div>
                        <span className="text-xs font-mono uppercase">{apiKey ? 'Configured' : 'Not Set'}</span>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="text-center text-ink/30 text-[10px] font-mono uppercase tracking-widest pt-4 border-t border-ink/20">
                ❖ Babel Configuration System ❖
            </div>
        </div>
    );
};
