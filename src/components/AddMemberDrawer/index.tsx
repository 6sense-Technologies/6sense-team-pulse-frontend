// "use client";
// import { Button } from "@/components/UI/ButtonComponent";
// import { BACKEND_URI } from "@/app/utils/constants/constants";
// import { cn } from "@/app/utils/tailwindMerge";
// import { IDesignation, IProjects } from "@/types/types";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Warning, X } from "@phosphor-icons/react";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import axios, { AxiosError, AxiosResponse } from "axios";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { Toaster } from 'react-hot-toast';
// import { z } from 'zod';

// interface IProps {
//   isOpen: boolean;
//   onClose: () => void;
//   refetch: () => void;
// }

// interface IFormData {
//   jiraOrTrello: string;
//   jiraId: string;
//   trelloId: string;
//   designation: string;
//   project: string;
// }

// const MemberSchema = z.object({
//   jiraOrTrello: z.string().min(1, "Jira/Trello is required"),
//   designation: z.string().min(1, "Designation is required"),
//   project: z.string().min(1, "Project is required"),
//   jiraId: z.string().optional(),
//   trelloId: z.string().optional()
// }).superRefine((data, ctx) => {
//   // Check if 'jiraOrTrello' is 'jira' and 'jiraId' is not provided
//   if (data.jiraOrTrello === 'jira' && !data.jiraId) {
//     ctx.addIssue({
//       path: ['jiraId'],
//       message: "Jira ID is required!",
//       code: z.ZodIssueCode.custom
//     });
//   }

//   // Check if 'jiraOrTrello' is 'trello' and 'trelloId' is not provided
//   if (data.jiraOrTrello === 'trello' && !data.trelloId) {
//     ctx.addIssue({
//       path: ['trelloId'],
//       message: "Trello ID is required!",
//       code: z.ZodIssueCode.custom
//     });
//   }
// });

// const AddMemberDrawer = ({ isOpen, onClose, refetch }: IProps): JSX.Element => {
//   const [jiraOrTrello, setJiraOrTrello] = useState("");
//   const [userExistError, setUserExistError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();
//   const drawerRef = useRef<HTMLDivElement>(null);

//   const { data: designationData } = useQuery({
//     queryKey: ["getDesignationList"],
//     queryFn: async () => {
//       const res: AxiosResponse<IDesignation> = await axios.get(`${BACKEND_URI}/users/designations/list`);
//       return res.data;
//     },
//     refetchOnWindowFocus: false
//   });

//   const designations = designationData?.designations ?? [];

//   const { data: projectData } = useQuery({
//     queryKey: ["getProjectList"],
//     queryFn: async () => {
//       const res: AxiosResponse<IProjects> = await axios.get(`${BACKEND_URI}/users/projects/list`);
//       return res.data;
//     },
//     refetchOnWindowFocus: false
//   });
//   const projects = projectData?.projects ?? [];

//   useEffect(() => {
//     const handleEscKey = (event: KeyboardEvent): void => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };

//     const handleClickOutside = (event: MouseEvent): void => {
//       if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };

//     document.addEventListener("keydown", handleEscKey);
//     document.addEventListener("mousedown", handleClickOutside);

//     return (): void => {
//       document.removeEventListener("keydown", handleEscKey);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

//   const { handleSubmit, register, formState: { errors }, clearErrors } = useForm<IFormData>({
//     resolver: zodResolver(MemberSchema)
//   });

// const addMemberMutation = useMutation({
//   mutationKey: ["addMemberMutation", jiraOrTrello],
//   mutationFn: async (newMember: IFormData) => {
//     // Jira
//     if (newMember.jiraOrTrello && newMember.jiraOrTrello === "jira") {
//       const res = await axios.post(`${BACKEND_URI}/jira/users/create`, { accountId: newMember.jiraId, designation: newMember.designation, project: newMember.project, userFrom: newMember?.jiraOrTrello });
//       return res.data;
//     }

//     // Trello:
//     if (newMember.jiraOrTrello && newMember.jiraOrTrello === "trello") {
//       const res = await axios.post(`${BACKEND_URI}/trello/users/create`, { accountId: newMember.trelloId, designation: newMember.designation, project: newMember.project, userFrom: newMember?.jiraOrTrello });
//       return res.data;
//     }
//   },
// });

//   const onsubmit = (data: IFormData): void => {
//     setIsLoading(true);
//     addMemberMutation.mutate(data, {
//       onSuccess: (data) => {
//
//         onClose();
//         router.push("/member-list?page=1");
//         refetch();
//       },
//       onError: (error) => {
//         const axiosError = error as AxiosError;

//         if (axiosError && axiosError?.response?.status === 409) {
//           setUserExistError("User already exist!");
//         }
//         if (axiosError && axiosError?.response?.status === 404) {
//           setUserExistError("Invalid credentials!");
//         }
//         if (axiosError && axiosError?.response?.status === 500) {
//           setUserExistError("Error creating user!");
//         }
//       },
//       onSettled: () => {
//         setIsLoading(false);
//       }
//     })
//   };

//

//   return (
//     <div
//       className={cn(
//         "fixed inset-0 bg-black/10 z-50 transform transition-transform duration-300 ease-in-out translate-x-full",
//         {
//           "translate-x-0": isOpen,
//         }
//       )}
//     >
//       <div
//         ref={drawerRef}
//         className="bg-white fixed right-0 top-0 bottom-0 max-w-lg w-full md:max-w-lg rounded-lg overflow-hidden shadow-xl"
//       >
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="bg-slate-50 p-5 flex justify-between">
//             <div>
//               <h1 className="text-2xl font-bold">Add Member</h1>
//               <p className="text-slate-400">
//                 Get started by filling in the information to add a new team member
//               </p>
//             </div>
//             <X onClick={onClose} size={28} className="cursor-pointer" />
//           </div>

//           {/* Main Content */}
//           <div className="flex-grow bg-white px-5 md:px-10 py-4 overflow-auto">
//             <h2 className="text-xl font-bold">Member Information</h2>
//             <form id="member-form" onSubmit={handleSubmit(onsubmit)} className="mt-4">
//               <div className="space-y-4">
//                 <div>
//                   <div className="flex items-start">
//                     <label className="w-[200px] text-nowrap">
//                       Jira/Trello <span className="text-red-500">*</span>
//                     </label>
//                     <div className="w-full">
//                       <select role="combobox" {...register("jiraOrTrello")} onChange={(e) => { setJiraOrTrello(e.target.value); clearErrors("jiraOrTrello"); }} className={cn("w-full border outline-none px-4 py-2 rounded-md", { "border border-red-400": errors.jiraOrTrello })}>
//                         <option value="">Select</option>
//                         <option value="jira">Jira</option>
//                         <option value="trello">Trello</option>
//                       </select>
//                       {
//                         errors && errors.jiraOrTrello && <p className="text-red-400 flex md:items-center gap-1 text-xs"><Warning className="mt-1 md:mt-0" /> {errors?.jiraOrTrello?.message}</p>
//                       }
//                     </div>
//                   </div>
//                 </div>
//                 {jiraOrTrello === "jira" && (
//                   <div>
//                     <div className="flex items-start">
//                       <label className="w-[200px] text-nowrap">
//                         Jira ID <span className="text-red-500">*</span>
//                       </label>
//                       <div className="w-full">
//                         <input {...register("jiraId")} onChange={(e) => { register("jiraId").onChange(e); setUserExistError(""); }} placeholder="Enter Jira ID" className={cn("w-full border outline-none px-4 py-2 rounded-md", { "border border-red-400": errors.jiraId })} />
//                         {
//                           errors && errors.jiraId && <p className="text-red-400 flex items-center gap-1 text-xs"><Warning /> {errors?.jiraId?.message}</p>
//                         }
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 {jiraOrTrello === "trello" && (
//                   <div>
//                     <div className="flex items-start">
//                       <label className="w-[200px] text-nowrap">
//                         Trello ID <span className="text-red-500">*</span>
//                       </label>
//                       <div className="w-full">
//                         <input {...register("trelloId")} onChange={(e) => { register("trelloId").onChange(e); setUserExistError(""); }} placeholder="Enter Trello ID" className={cn("w-full border outline-none px-4 py-2 rounded-md", { "border border-red-400": errors.trelloId })} />
//                         {
//                           errors && errors.trelloId && <p className="text-red-400 flex items-center gap-1 text-xs"><Warning /> {errors?.trelloId?.message}</p>
//                         }
//                         {/* {
//                           userExistError && <p className="text-red-400 flex items-center gap-1 text-xs"><Warning /> {userExistError}</p>
//                         } */}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <div>
//                   <div className="flex items-start">
//                     <label className="w-[200px] text-nowrap">
//                       Designation <span className="text-red-500">*</span>
//                     </label>
//                     <div className="w-full">
//                       <select role="combobox" {...register("designation")} className={cn("w-full border outline-none px-4 py-2 rounded-md", { "border border-red-400": errors.designation })}>
//                         <option value="">Select</option>
//                         {
//                           designations.map((designation, index) => {
//                             return (
//                               <option value={designation} key={index}>{designation}</option>
//                             )
//                           })
//                         }
//                       </select>
//                       {
//                         errors && errors.designation && <p className="text-red-400 flex items-center gap-1 text-xs"><Warning /> {errors?.designation?.message}</p>
//                       }
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex items-start">
//                     <label className="w-[200px] text-nowrap">
//                       Project <span className="text-red-500">*</span>
//                     </label>
//                     <div className="w-full">
//                       <select role="combobox" {...register("project")} className={cn("w-full border outline-none px-4 py-2 rounded-md", { "border border-red-400": errors.designation })}>
//                         <option value="">Select</option>
//                         {
//                           projects.map((project, index) => {
//                             return (
//                               <option value={project} key={index}>{project}</option>
//                             )
//                           })
//                         }
//                       </select>
//                       {
//                         errors && errors.project && <p className="text-red-400 flex items-center gap-1 text-xs"><Warning /> {errors?.project?.message}</p>
//                       }
//                       {
//                         userExistError && <p className="text-red-400 flex items-center gap-1 text-xs"><Warning /> {userExistError}</p>
//                       }
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </div>

//           {/* Button Section */}
//           <div className="bg-slate-50 flex justify-end gap-5 p-5">
//             <Button variant={"secondary"} type="button" onClick={onClose} className="w-full">
//               Cancel
//             </Button>
//             <Button
//               aria-label="create"
//               prefixIcon="PlusCircle"
//               type="submit"
//               className="w-[90px] hover:opacity-90"
//               prefixIconClassName="plusIcon"
//               form="member-form"
//               loading={isLoading}
//             >
//               {!isLoading && "Create"}
//             </Button>
//           </div>
//         </div>
//       </div>
//       <Toaster />
//     </div>
//   );
// };

// export default AddMemberDrawer;

"use client";

import { cn } from "@/app/utils/tailwindMerge";
import { IDesignation, IProject } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "@phosphor-icons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../ButtonComponent";
import { MemberSchema } from "../../../Zodschema/memberSchema";
import { z } from "zod";
import { TEMP_BACKEND_URI } from "../../../globalConstants";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

interface IFormData {
  projects: IProject[];
  jiraId: string;
  trelloId: string;
  designation: string;
}

const AddMemberDrawer = ({ isOpen, onClose, refetch }: IProps): JSX.Element => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm({
    resolver: zodResolver(MemberSchema),
  });

  const [isLoading, setIsLoading] = useState(false); // State for loader
  const selectedProjects = watch("projects", []);

  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  const { data: designationData } = useQuery({
    queryKey: ["getDesignationList"],
    queryFn: async () => {
      const res: AxiosResponse<IDesignation> = await axios.get(`${TEMP_BACKEND_URI}/users/designations/list`);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
  const designations = designationData?.designations ?? [];

  const { data: projectData } = useQuery({
    queryKey: ["getProjectList"],
    queryFn: async () => {
      const res: AxiosResponse<{ projects: IProject[] }> = await axios.get(`${TEMP_BACKEND_URI}/users/projects/list`);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
  const projects = projectData ?? [];

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    const handleClickOutside = (event: MouseEvent): void => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscKey);
    document.addEventListener("mousedown", handleClickOutside);

    return (): void => {
      document.removeEventListener("keydown", handleEscKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  interface AddMemberVariables extends z.infer<typeof MemberSchema> {}

  interface AddMemberResponse {
    success: boolean;
    message: string;
    data?: any;
  }

  const addMemberMutation = useMutation<AddMemberResponse, unknown, AddMemberVariables>({
    mutationKey: ["addMemberMutation"],
    mutationFn: async (newMember: AddMemberVariables) => {
      const res = await axios.post<AddMemberResponse>(`${TEMP_BACKEND_URI}/users/create`, {
        ...newMember,
        projects: newMember.projects.map((project) => project._id),
      });
      return res.data;
    },
  });

  const handleProjectChange = (selectedIds: string[]) => {
    const selected = (Array.isArray(projects) ? projects : projects.projects).filter((project: IProject) => selectedIds.includes(project._id));

    // Get the tools of deselected projects
    const deselectedTools = selectedProjects.filter((project) => !selectedIds.includes(project._id)).map((project) => project.tool);

    // Clear Jira or Trello IDs if their respective projects are deselected
    if (deselectedTools.includes("jira")) {
      setValue("jiraId", ""); // Clear Jira ID
      clearErrors("jiraId");
    }
    if (deselectedTools.includes("trello")) {
      setValue("trelloId", ""); // Clear Trello ID
      clearErrors("trelloId");
    }

    setValue("projects", selected); // Sync selected projects with form state
    clearErrors("projects"); // Clear validation errors
  };

  const onSubmit = (data: z.infer<typeof MemberSchema>): void => {
    setIsLoading(true);
    addMemberMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Member added successfully!");
        // onClose();
        router.push("/member-list?page=1");
        refetch();
      },
      onError: (error: any) => {
        toast.error("Unable to add the member");
        console.error(error);
      },
      onSettled: () => {
        setIsLoading(false); // Stop loader
      },
    });
  };

  return (
    <div
      className={cn("fixed inset-0 bg-black/10 z-50 transform transition-transform duration-300 ease-in-out translate-x-full", {
        "translate-x-0": isOpen,
      })}
    >
      <div ref={drawerRef} className="bg-white fixed right-0 top-0 bottom-0 max-w-lg w-full md:max-w-lg rounded-lg overflow-hidden shadow-xl">
        <div className="flex flex-col h-full">
          <div className="bg-slate-50 p-5 flex justify-between">
            <h1 className="text-2xl font-bold">Add Member</h1>
            <X onClick={onClose} size={28} className="cursor-pointer" />
          </div>

          <div className="flex-grow bg-white px-5 md:px-10 py-4 overflow-auto">
            <form id="member-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label className="block">
                    Projects <span className="text-destructive">*</span>
                  </label>
                  <select
                    multiple
                    onChange={(e) => {
                      const selectedIds = Array.from(e.target.selectedOptions, (option) => option.value);
                      handleProjectChange(selectedIds);
                    }}
                    className={cn("w-full border px-4 py-2 rounded-md", errors.projects ? "border-red-400" : "")}
                  >
                    {(Array.isArray(projects) ? projects : projects.projects).map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {errors.projects && <p className="text-red-400 text-sm">{errors.projects.message}</p>}
                </div>

                <div>
                  <label className="block">
                    Designation <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register("designation")}
                    className={cn("w-full border px-4 py-2 rounded-md", errors.designation ? "border-red-400" : "")}
                  >
                    <option value="">Select</option>
                    {designations.map((designation, index) => (
                      <option key={index} value={designation}>
                        {designation}
                      </option>
                    ))}
                  </select>
                  {errors.designation && <p className="text-red-400 text-sm">{errors.designation.message}</p>}
                </div>

                {selectedProjects.some((project) => project.tool === "jira") && (
                  <div>
                    <label className="block">
                      Jira ID <span className="text-destructive">*</span>
                    </label>
                    <input {...register("jiraId")} className={cn("w-full border px-4 py-2 rounded-md", errors.jiraId ? "border-red-400" : "")} />
                    {errors.jiraId && <p className="text-red-400 text-sm">{errors.jiraId.message}</p>}
                  </div>
                )}

                {selectedProjects.some((project) => project.tool === "trello") && (
                  <div>
                    <label className="block">
                      Trello ID <span className="text-destructive">*</span>
                    </label>
                    <input {...register("trelloId")} className={cn("w-full border px-4 py-2 rounded-md", errors.trelloId ? "border-red-400" : "")} />
                    {errors.trelloId && <p className="text-red-400 text-sm">{errors.trelloId.message}</p>}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="bg-slate-50 flex justify-end gap-5 p-5">
            <Button variant="secondary" type="button" onClick={onClose} className="w-full">
              Cancel
            </Button>
            <Button type="submit" form="member-form" loading={isLoading} className="w-[90px] hover:opacity-90">
              Create
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default AddMemberDrawer;
