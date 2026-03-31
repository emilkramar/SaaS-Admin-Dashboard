export type ProjectLabel = 'NEW' | 'INPROGRESS' | 'FINISHED';

export interface ProjectParticipant {
  id: number;
  name: string;
  role: string;
  email: string;
}

export interface Project {
  id: number;
  name: string;
  created_at: string;
  label: ProjectLabel;
  description?: string;
  participants?: ProjectParticipant[];
}
