/**
 * Skills configuration.
 * Defines all skills assessed by the diagnostic engine.
 * Skills are grouped by category and weighted by importance.
 */

import { Skill } from '@/lib/types';

export const skills: Skill[] = [
  // Placeholder skills - replace with actual skill definitions
  {
    id: 'placeholder-skill-1',
    name: 'Placeholder Skill A',
    category: 'Technical',
    weight: 1.0,
  },
  {
    id: 'placeholder-skill-2',
    name: 'Placeholder Skill B',
    category: 'Interpersonal',
    weight: 1.0,
  },
];

export function getSkillById(id: string): Skill | undefined {
  return skills.find(skill => skill.id === id);
}

export function getSkillsByCategory(category: string): Skill[] {
  return skills.filter(skill => skill.category === category);
}
