export interface AppState {
  selectedActivity: string | null;
  selectedDuration: string;
  startMode: 'now' | 'later' | 'best';
}

export const initialState: AppState = {
  selectedActivity: null,
  selectedDuration: 'h1',
  startMode: 'now',
};
