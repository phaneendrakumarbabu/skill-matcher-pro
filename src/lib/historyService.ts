import { AnalysisResult } from './resumeData';

export interface AnalysisHistory {
  id: string;
  timestamp: string;
  roleName: string;
  roleId: string;
  resumeName: string;
  results: AnalysisResult;
}

const STORAGE_KEY = 'resumeai_history';

export const historyService = {
  // Save analysis to history
  saveAnalysis(roleName: string, roleId: string, results: AnalysisResult, resumeName: string = 'My Resume'): string {
    const history = this.getHistory();
    const id = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newEntry: AnalysisHistory = {
      id,
      timestamp: new Date().toISOString(),
      roleName,
      roleId,
      resumeName,
      results
    };

    history.unshift(newEntry); // Add to beginning
    
    // Keep only last 50 analyses
    if (history.length > 50) {
      history.splice(50);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return id;
  },

  // Get all history
  getHistory(): AnalysisHistory[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  },

  // Get single analysis by ID
  getAnalysisById(id: string): AnalysisHistory | null {
    const history = this.getHistory();
    return history.find(item => item.id === id) || null;
  },

  // Delete analysis
  deleteAnalysis(id: string): void {
    const history = this.getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Clear all history
  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Get statistics
  getStats() {
    const history = this.getHistory();
    
    if (history.length === 0) {
      return {
        totalAnalyses: 0,
        averageScore: 0,
        averageATS: 0,
        topRole: null,
        improvement: 0
      };
    }

    const totalAnalyses = history.length;
    const averageScore = Math.round(
      history.reduce((sum, item) => sum + item.results.matchPercentage, 0) / totalAnalyses
    );
    const averageATS = Math.round(
      history.reduce((sum, item) => sum + item.results.atsScore, 0) / totalAnalyses
    );

    // Find most analyzed role
    const roleCounts: Record<string, number> = {};
    history.forEach(item => {
      roleCounts[item.roleName] = (roleCounts[item.roleName] || 0) + 1;
    });
    const topRole = Object.entries(roleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    // Calculate improvement (compare first vs last 5 analyses)
    let improvement = 0;
    if (history.length >= 2) {
      const recent = history.slice(0, Math.min(5, history.length));
      const old = history.slice(-Math.min(5, history.length));
      
      const recentAvg = recent.reduce((sum, item) => sum + item.results.matchPercentage, 0) / recent.length;
      const oldAvg = old.reduce((sum, item) => sum + item.results.matchPercentage, 0) / old.length;
      
      improvement = Math.round(recentAvg - oldAvg);
    }

    return {
      totalAnalyses,
      averageScore,
      averageATS,
      topRole,
      improvement
    };
  },

  // Get chart data for trends
  getChartData() {
    const history = this.getHistory();
    
    // Reverse to show oldest first
    return history.slice().reverse().map(item => ({
      date: new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: item.timestamp,
      skillMatch: item.results.matchPercentage,
      atsScore: item.results.atsScore,
      roleName: item.roleName
    }));
  }
};
