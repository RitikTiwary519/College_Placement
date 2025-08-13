export interface Company {
  company_name: string;
  type: string;
  category: string;
  criteria: string[];
  placement_open: string | null;
  registration_date: string | null;
  start_date: string | null;
  end_date: string | null;
}

export enum Difficulty {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard",
    VeryHard = "Very Hard"
}

export interface Comment {
    user: string;
    text: string;
    date: string;
}

export interface InterviewExperience {
  id: number;
  student_name?: string;
  company_name: string;
  role: string;
  interview_date: string;
  rounds: { type: string; description: string }[];
  questions: string;
  tips: string;
  difficulty: Difficulty;
  popularity: number;
  likes: number;
  comments: Comment[];
}

export enum View {
  Auth = 'AUTH',
  Companies = 'COMPANIES',
  Experiences = 'EXPERIENCES',
  Login = 'LOGIN',
  SubmitExperience = 'SUBMIT_EXPERIENCE',
  AdminDashboard = 'ADMIN_DASHBOARD',
  CompanyDetail = 'COMPANY_DETAIL'
}