export interface IAllMembersType {
  data: IMemberList[]
  count: number
}
export interface IMemberList {
  _id: string
  score: number
  userData: IUserData
}

export interface IUserData {
  displayName: string
  emailAddress: string
  avatarUrls: string
  designation: string
}

export interface IMemberInformationType {
  user: {
    _id: string;
    accountId: string;
    displayName: string;
    emailAddress: string;
    avatarUrls: string;
    currentPerformance: number;
    designation: string;
    issueHistory: IIssueHistory[];
    __v: number;
    totalIssueHistory: number;
    currentPage: number;
    totalPages: number;
    project: any;
  };
}

export interface IMemberInfo {
  userData: IMemberInfoData
  history: IHistory
  projects?: IProjects[]
}

export interface IMemberInfoData {
  _id: string
  displayName: string
  emailAddress: string
  designation: string
  avatarUrls: string
}

export interface IHistory {
  data: IMemberHistoryDetails[]
  count: number
}

export interface IMemberHistoryDetails {
  doneTaskCount: number
  notDoneTaskCount: number
  doneStoryCount: number
  notDoneStoryCount: number
  doneBugCount: number
  notDoneBugCount: number
  comment: string
  date: string
  taskRatio: number
  storyRatio: number
  bugRatio: number
  score: number
}

export interface IMemberDetail {
  _id: string;
  accountId: string;
  displayName: string;
  emailAddress: string;
  avatarUrls: string;
  designation: string;
  currentPerformance: number;
  issueHistory: IIssueHistory[];
  __v: number;
  totalIssueHistory: number;
  currentPage: number;
  totalPages: number;
  projects?: any[];
}

export interface IIssueHistory {
  issuesCount: {
    notDone: {
      Task: number;
      Bug: number;
      Story: number;
    };
    done: {
      Task: number;
      Bug: number;
      Story: number;
    };
  };
  date: string;
  taskCompletionRate: number;
  userStoryCompletionRate: number;
  overallScore: number;
  comment: string;
  codeToBugRatio: number;
  _id: string;
  __v: number;
}

export interface IDesignation {
  designations: string[];
}
export interface IProjects {
  projects: string[];
  projectDetails: any;
}

export interface IMemberPerformanceIssueHistory {
  userName: string;
  accountId: string;
  noOfBugs: number;
  comment: string;
  comments: {
    comment: string;
    timestamp: string;
  }[];
  issues: {
    serialNumber: number;
    issueType: string;
    issueId: string;
    issueStatus: string;
    planned: boolean;
    issueSummary: string;
    link: string;
  }[];
}

export interface IGitRepo {
    _id: string
    provider: string
    user: string
    organization: string
    repo: string
    createdAt: string
    updatedAt: string
    __v: number
    gitUsername: string
  }
  

export interface IGitContribution {
  _id: string;
  branch: string;
  dateString: string;
  gitRepo: IGitRepo;
  __v: number;
  commitHomeUrl: string;
  createdAt: string;
  date: string;
  totalAdditions: number;
  totalChanges: number;
  totalDeletions: number;
  totalWritten: number;
  updatedAt: string;
  user: string;
}

export interface IProject {
  _id: string
  tool: string
  toolURL: string
  name: string
  createdAt: string
  updatedAt: string
  __v: number
}


export interface IGrowthDetailItems {
  id: string;
  user: string;
  goalItem: string;
  status: string;
  summary: string;
  date: string;
  activites: string[];
}


export interface IGrowthItem {
  count: number
  data: IGrowthItems[]
}

export interface IGrowthItems {
  _id: string
  user: string
  goalItem: string
  status: string
  createdAt: string
  updatedAt: string
  __v: number
}
