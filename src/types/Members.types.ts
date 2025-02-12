export interface TeamList {
    data: Teams[]
    count: number
  }
  
  export interface Teams {
    _id: string
    performance: number
    displayName: string
    emailAddress: string
    designation: string
    avatarUrls: string
    role: string
  }

  export interface Designations {
    designations: string[]
  }

  export interface Projects
  {
    projects: string[]
  }

  export interface InviteMemberForm {
    displayName: string;
    emailAddress: string;
    designation: string;
    role: string;
    projects: string[];
    jiraId: string;
    trelloId: string;
    githubUserName: string;
    profilePicture: File | null;
  }

  export interface Roles {
    _id: string
    roleName: string
  }