import { ekonomiModules, demandModule, Module } from './moduleContent';
import { pkwuModules } from './pkwuModuleContent';

// All modules combined
export const allModules: Module[] = [...ekonomiModules, ...pkwuModules];

// Get module by ID
export function getModuleById(moduleId: string | undefined): Module | undefined {
  if (!moduleId) return undefined;
  return allModules.find(m => m.id === moduleId);
}

// Check if module is PKWU
export function isPKWUModule(moduleId: string | undefined): boolean {
  if (!moduleId) return false;
  return moduleId.startsWith('pkwu-') || moduleId === 'kerajinan-limbah';
}

// Get class type from kelas string
export function getKelasType(kelas: string | null): 'X' | 'XI' | null {
  if (!kelas) return null;
  if (kelas.startsWith('X.')) return 'X';
  if (kelas.startsWith('XI.')) return 'XI';
  return null;
}
