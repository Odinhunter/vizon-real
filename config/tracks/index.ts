/**
 * Career tracks configuration.
 * Defines career tracks and their required skill profiles.
 * Tracks are matched against diagnostic results.
 */

import { CareerTrack } from '@/lib/types';

export const careerTracks: CareerTrack[] = [
  // Placeholder track - replace with actual track definitions
  {
    id: 'placeholder-track-1',
    name: 'Placeholder Career Track',
    requiredSkills: ['placeholder-skill-1', 'placeholder-skill-2'],
  },
];

export function getTrackById(id: string): CareerTrack | undefined {
  return careerTracks.find(track => track.id === id);
}

export function getAllTracks(): CareerTrack[] {
  return careerTracks;
}
