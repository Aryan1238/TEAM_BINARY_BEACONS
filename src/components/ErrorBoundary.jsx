import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught render error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const label = this.props.label || 'This section';
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8 bg-slate-50">
        <div className="max-w-xl w-full bg-white rounded-2xl border border-amber-200 shadow-md p-8 space-y-4 text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{label} encountered a temporary issue</h2>
            <p className="text-xs text-slate-500 mt-1">Click retry below to reload this section cleanly.</p>
          </div>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Section</span>
          </button>
        </div>
      </div>
    );
  }
}
