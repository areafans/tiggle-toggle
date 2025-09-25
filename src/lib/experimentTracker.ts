export class SimpleExperimentTracker {
  constructor(private ldClient: any, private user: any) {}

  // Track response time for the experiment
  trackResponseTime(latencyMs: number) {
    if (this.ldClient && this.user) {
      // Send to LaunchDarkly experiment - matches 'latency' metric in experiment
      this.ldClient.track('latency', this.user, {
        timestamp: Date.now(),
        userRole: this.user.role,
        sessionId: this.getSessionId(),
        value: latencyMs
      });

      console.log(`📊 Tracked latency: ${latencyMs}ms to LaunchDarkly experiment`);
    }
  }

  // Generate realistic data based on actual AI flag state
  simulateResponseTime(): number {
    const aiEnabled = this.ldClient?.variation('f2AiChatbot', this.user, false);

    if (aiEnabled) {
      // With AI: 400-700ms (slower) - matches high latency mode
      return Math.floor(Math.random() * 300) + 400;
    } else {
      // Without AI: 80-200ms (faster) - matches normal mode
      return Math.floor(Math.random() * 120) + 80;
    }
  }

  private getSessionId(): string {
    return sessionStorage.getItem('session-id') || 'session-' + Date.now();
  }
}