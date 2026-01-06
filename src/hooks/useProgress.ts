import { useState, useEffect, useCallback } from 'react';

export interface ModuleProgress {
  moduleId: string;
  completedSections: string[];
  quizScores: Record<string, number>;
  watchedVideos: string[];
  lastVisited: string;
  isCompleted: boolean;
}

interface ProgressState {
  modules: Record<string, ModuleProgress>;
  darkMode: boolean;
}

const STORAGE_KEY = 'emodul-bagoes-progress';

const defaultProgress: ProgressState = {
  modules: {},
  darkMode: false,
};

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => {
    if (typeof window === 'undefined') return defaultProgress;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (progress.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [progress.darkMode]);

  const toggleDarkMode = useCallback(() => {
    setProgress(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const getModuleProgress = useCallback((moduleId: string): ModuleProgress => {
    return progress.modules[moduleId] || {
      moduleId,
      completedSections: [],
      quizScores: {},
      watchedVideos: [],
      lastVisited: '',
      isCompleted: false,
    };
  }, [progress.modules]);

  const markSectionComplete = useCallback((moduleId: string, sectionId: string) => {
    setProgress(prev => {
      const moduleProgress = prev.modules[moduleId] || {
        moduleId,
        completedSections: [],
        quizScores: {},
        watchedVideos: [],
        lastVisited: '',
        isCompleted: false,
      };
      
      if (!moduleProgress.completedSections.includes(sectionId)) {
        moduleProgress.completedSections = [...moduleProgress.completedSections, sectionId];
      }
      moduleProgress.lastVisited = new Date().toISOString();
      
      return {
        ...prev,
        modules: { ...prev.modules, [moduleId]: moduleProgress },
      };
    });
  }, []);

  const markVideoWatched = useCallback((moduleId: string, videoId: string) => {
    setProgress(prev => {
      const moduleProgress = prev.modules[moduleId] || {
        moduleId,
        completedSections: [],
        quizScores: {},
        watchedVideos: [],
        lastVisited: '',
        isCompleted: false,
      };
      
      if (!moduleProgress.watchedVideos.includes(videoId)) {
        moduleProgress.watchedVideos = [...moduleProgress.watchedVideos, videoId];
      }
      
      return {
        ...prev,
        modules: { ...prev.modules, [moduleId]: moduleProgress },
      };
    });
  }, []);

  const saveQuizScore = useCallback((moduleId: string, quizId: string, score: number) => {
    setProgress(prev => {
      const moduleProgress = prev.modules[moduleId] || {
        moduleId,
        completedSections: [],
        quizScores: {},
        watchedVideos: [],
        lastVisited: '',
        isCompleted: false,
      };
      
      moduleProgress.quizScores = { ...moduleProgress.quizScores, [quizId]: score };
      
      return {
        ...prev,
        modules: { ...prev.modules, [moduleId]: moduleProgress },
      };
    });
  }, []);

  const markModuleComplete = useCallback((moduleId: string) => {
    setProgress(prev => {
      const moduleProgress = prev.modules[moduleId] || {
        moduleId,
        completedSections: [],
        quizScores: {},
        watchedVideos: [],
        lastVisited: '',
        isCompleted: false,
      };
      
      moduleProgress.isCompleted = true;
      
      return {
        ...prev,
        modules: { ...prev.modules, [moduleId]: moduleProgress },
      };
    });
  }, []);

  const calculateProgress = useCallback((moduleId: string, totalSections: number): number => {
    const moduleProgress = getModuleProgress(moduleId);
    if (totalSections === 0) return 0;
    return Math.round((moduleProgress.completedSections.length / totalSections) * 100);
  }, [getModuleProgress]);

  const resetProgress = useCallback(() => {
    setProgress({ ...defaultProgress, darkMode: progress.darkMode });
  }, [progress.darkMode]);

  return {
    progress,
    darkMode: progress.darkMode,
    toggleDarkMode,
    getModuleProgress,
    markSectionComplete,
    markVideoWatched,
    saveQuizScore,
    markModuleComplete,
    calculateProgress,
    resetProgress,
  };
}
