export interface IProjectList {
    total: number
    page: number
    limit: number
    data: Projects[]
  }
  
  export interface Projects {
    _id: string
    name: string
    tools: Tool[]
    createdBy: string
    createdAt: string
    updatedAt: string
    teamSize: number
  }
  
  export interface Tool {
    _id: string
    toolName: string
    toolUrl: string
    projects: any[]
    __v: number
    createdAt: string
    updatedAt: string
  }