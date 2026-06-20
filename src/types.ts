export interface DogProfile {
  name: string;
  breed: string;
  handlingTool: 'harness' | 'collar' | 'head_halter';
  triggers: string[];
  fixationIntensity: number; // 1 to 5
}

export interface WalkSession {
  id: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  distanceMeters: number;
  paceMinPerKm: number;
  pathCoordinates: { lat: number; lng: number; simulated?: boolean }[];
  loggedTriggers: {
    time: string;
    type: 'jalar' | 'contacto_visual' | 'reactividad' | 'normal';
    label: string;
    note: string;
  }[];
  assistantFeedbackCount: number;
  calories: number;
}

export interface HydrationConfig {
  dailyTargetMl: number;
  intervalHours: number;
  notificationsEnabled: boolean;
  loggedMl: number;
}
