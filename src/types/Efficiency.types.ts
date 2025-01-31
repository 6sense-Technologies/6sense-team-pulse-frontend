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

  