"use client";

import { Component, type ReactNode } from "react";

export class ContributionsErrorBoundary extends Component<
  {
    fallback: (args: { error: Error; reset: () => void }) => ReactNode;
    children: ReactNode;
    resetKey?: string | number;
  },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prevProps: Readonly<{ resetKey?: string | number }>) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error)
      return this.props.fallback({
        error: this.state.error,
        reset: () => this.setState({ error: null }),
      });
    return this.props.children;
  }
}
