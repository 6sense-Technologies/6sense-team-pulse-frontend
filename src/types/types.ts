export interface ICreateMemberType {
    message: string
    statusCode: number
    users: {
        _id: string
        accountId: string
        displayName: string
        emailAddress: string
        avatarUrls: string
        currentPerformance: number
    }[],
    totalPages: number
    currentPage: number
    totalUsers: number
}

export interface IMemberInformationType {
    user: {
        _id: string
        accountId: string
        displayName: string
        emailAddress: string
        avatarUrls: string
        currentPerformance: number
        issueHistory: IIssueHistory[]
        __v: number
        totalIssueHistory: number
        currentPage: number
        totalPages: number
    }
}

export interface IMemberDetail {
    _id: string
    accountId: string
    displayName: string
    emailAddress: string
    avatarUrls: string
    currentPerformance: number
    issueHistory: IIssueHistory[]
    __v: number
    totalIssueHistory: number
    currentPage: number
    totalPages: number
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
    _id: string;
    __v: number;
}
