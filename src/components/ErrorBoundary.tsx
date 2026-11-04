import React from "react";
import { View, Text, Pressable } from "react-native";

/**
 * Catches render-time exceptions anywhere below it and shows a calm "refresh"
 * card instead of a white screen. Pavitra computes astronomy on every minute
 * tick, so a single bad value should never take down the whole app.
 */
type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn("[Pavitra] render error:", error);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#FBF6EE" }}>
        <Text style={{ fontSize: 40, marginBottom: 8 }}>🪔</Text>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#2D1E12", marginBottom: 6 }}>
          Something needs a refresh
        </Text>
        <Text style={{ fontSize: 14, color: "#6B5B4D", textAlign: "center", marginBottom: 18 }}>
          A calculation hiccuped. Tap below to reload this view.
        </Text>
        <Pressable
          onPress={this.reset}
          style={{ backgroundColor: "#E0633B", paddingHorizontal: 22, paddingVertical: 12, borderRadius: 999 }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Refresh</Text>
        </Pressable>
      </View>
    );
  }
}
