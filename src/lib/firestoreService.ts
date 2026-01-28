import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { AnalysisResult } from './resumeData';

export interface FirestoreAnalysis {
  id?: string;
  userId: string;
  timestamp: Timestamp;
  roleName: string;
  roleId: string;
  resumeName: string;
  results: AnalysisResult;
}

const COLLECTION_NAME = 'analyses';

export const firestoreService = {
  // Save analysis to Firestore
  async saveAnalysis(
    userId: string,
    roleName: string,
    roleId: string,
    results: AnalysisResult,
    resumeName: string = 'My Resume'
  ): Promise<string> {
    try {
      const analysisData: Omit<FirestoreAnalysis, 'id'> = {
        userId,
        timestamp: Timestamp.now(),
        roleName,
        roleId,
        resumeName,
        results
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), analysisData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw error;
    }
  },

  // Get all analyses for a user
  async getUserAnalyses(userId: string): Promise<FirestoreAnalysis[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      const analyses: FirestoreAnalysis[] = [];

      querySnapshot.forEach((doc) => {
        analyses.push({
          id: doc.id,
          ...doc.data()
        } as FirestoreAnalysis);
      });

      return analyses;
    } catch (error) {
      console.error('Error fetching analyses:', error);
      throw error;
    }
  },

  // Delete an analysis
  async deleteAnalysis(analysisId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, analysisId));
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error;
    }
  },

  // Get statistics for a user
  async getUserStats(userId: string) {
    try {
      const analyses = await this.getUserAnalyses(userId);

      if (analyses.length === 0) {
        return {
          totalAnalyses: 0,
          averageScore: 0,
          averageATS: 0,
          topRole: null,
          improvement: 0
        };
      }

      const totalAnalyses = analyses.length;
      const averageScore = Math.round(
        analyses.reduce((sum, item) => sum + item.results.matchPercentage, 0) / totalAnalyses
      );
      const averageATS = Math.round(
        analyses.reduce((sum, item) => sum + item.results.atsScore, 0) / totalAnalyses
      );

      // Find most analyzed role
      const roleCounts: Record<string, number> = {};
      analyses.forEach(item => {
        roleCounts[item.roleName] = (roleCounts[item.roleName] || 0) + 1;
      });
      const topRole = Object.entries(roleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

      // Calculate improvement
      let improvement = 0;
      if (analyses.length >= 2) {
        const recent = analyses.slice(0, Math.min(5, analyses.length));
        const old = analyses.slice(-Math.min(5, analyses.length));

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
    } catch (error) {
      console.error('Error calculating stats:', error);
      throw error;
    }
  },

  // Get chart data for trends
  getChartData(analyses: FirestoreAnalysis[]) {
    return analyses.slice().reverse().map(item => ({
      date: item.timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: item.timestamp.toDate().toISOString(),
      skillMatch: item.results.matchPercentage,
      atsScore: item.results.atsScore,
      roleName: item.roleName
    }));
  }
};
