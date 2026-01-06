import { ekonomiModules, demandModule, Module } from './moduleContent';
import { pkwuModule } from './pkwuModuleContent';

// All modules combined
export const allModules: Module[] = [...ekonomiModules, pkwuModule];

// Get module by ID
export function getModuleById(moduleId: string | undefined): Module | undefined {
  if (!moduleId) return undefined;
  return allModules.find(m => m.id === moduleId);
}

// Check if module is PKWU
export function isPKWUModule(moduleId: string | undefined): boolean {
  return moduleId === 'kerajinan-limbah';
}

// Get class type from kelas string
export function getKelasType(kelas: string | null): 'X' | 'XI' | null {
  if (!kelas) return null;
  if (kelas.startsWith('X.')) return 'X';
  if (kelas.startsWith('XI.')) return 'XI';
  return null;
}
