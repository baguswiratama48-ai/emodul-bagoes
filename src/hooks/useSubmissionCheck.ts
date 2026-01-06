import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SubmissionStatus {
  pemantik: boolean;
  lkpd: boolean;
  kuis: boolean;
  refleksi: boolean;
}

export function useSubmissionCheck(userId: string | undefined, moduleId: string | undefined) {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>({
    pemantik: false,
    lkpd: false,
    kuis: false,
    refleksi: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && moduleId) {
      checkSubmissions();
    }
  }, [userId, moduleId]);

  const checkSubmissions = async () => {
    if (!userId || !moduleId) return;
    setLoading(true);

    // Check pemantik
    const { data: triggerData } = await supabase
      .from('trigger_answers')
      .select('id')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .limit(1);

    // Check LKPD
    const { data: lkpdData } = await supabase
      .from('lkpd_answers')
      .select('id')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .limit(1);

    // Check Kuis
    const { data: quizData } = await supabase
      .from('quiz_answers')
      .select('id')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .limit(1);

    // Check Refleksi
    const { data: reflectionData } = await supabase
      .from('trigger_answers')
      .select('id')
      .eq('user_id', userId)
      .eq('module_id', `${moduleId}-refleksi`)
      .limit(1);

    setSubmissionStatus({
      pemantik: (triggerData?.length ?? 0) > 0,
      lkpd: (lkpdData?.length ?? 0) > 0,
      kuis: (quizData?.length ?? 0) > 0,
      refleksi: (reflectionData?.length ?? 0) > 0,
    });

    setLoading(false);
  };

  const refresh = () => {
    checkSubmissions();
  };

  return { submissionStatus, loading, refresh };
}
