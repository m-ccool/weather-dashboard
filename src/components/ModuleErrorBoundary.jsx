import { Component } from 'react';

export default class ModuleErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || 'Unexpected module error',
    };
  }

  componentDidCatch(error) {
    // Keep diagnostics in console for local debugging without crashing entire app.
    console.error('ModuleErrorBoundary:', this.props.moduleName, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl bg-red-500/20 border border-red-400/40 px-5 py-4 text-red-200 font-sora text-sm">
          <p className="font-semibold">{this.props.moduleName} module failed</p>
          <p className="text-red-100/80 mt-1">{this.state.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
