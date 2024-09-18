"use client";
import { Button } from "@/app/components/UI/ButtonComponent";
import { BACKEND_URI } from "@/app/utils/constants/constants";
import { cn } from "@/app/utils/tailwindMerge";
import { zodResolver } from "@hookform/resolvers/zod";
import { Warning, X } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from 'zod';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

interface IFormData {
  jiraOrTrello: string;
  jiraId: string;
  trelloId: string;
  designation: string;
}

const MemberSchema = z.object({
  jiraOrTrello: z.string().min(1, "Jira/Trello is required"),
  // designation: z.string().min(1, "Designation is required"),
  jiraId: z.string().optional(),
  trelloId: z.string().optional()
}).superRefine((data, ctx) => {
  // Check if 'jiraOrTrello' is 'jira' and 'jiraId' is not provided
  if (data.jiraOrTrello === 'jira' && !data.jiraId) {
    ctx.addIssue({
      path: ['jiraId'],
      message: "Jira ID is required!",
      code: z.ZodIssueCode.custom
    });
  }

  // Check if 'jiraOrTrello' is 'trello' and 'trelloId' is not provided
  if (data.jiraOrTrello === 'trello' && !data.trelloId) {
    ctx.addIssue({
      path: ['trelloId'],
      message: "Trello ID is required!",
      code: z.ZodIssueCode.custom
    });
  }
});

const AddMemberDrawer = ({ isOpen, onClose, refetch }: IProps): JSX.Element => {
  const [jiraOrTrello, setJiraOrTrello] = useState("");
  const [userExistError, setUserExistError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

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

  const { handleSubmit, register, formState: { errors } } = useForm<IFormData>({
    resolver: zodResolver(MemberSchema)
  });

  const addMemberMutation = useMutation({
    mutationKey: ["addMemberMutation", jiraOrTrello],
    mutationFn: async (newMember: IFormData) => {
      if (newMember.jiraOrTrello && newMember.jiraOrTrello === "jira") {
        const res = await axios.post(`${BACKEND_URI}/jira/users/create`, { accountId: newMember.jiraId });
        return res.data;
      }
      if (newMember.jiraOrTrello && newMember.jiraOrTrello === "trello") {
        const res = await axios.post(`${BACKEND_URI}/jira/users/create`, { accountId: newMember.trelloId });
        return res.data;
      }
    },
  });

  const onsubmit = (data: IFormData): void => {
    setIsLoading(true);
    addMemberMutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data);
        onClose();
        router.push("/member-list?page=1");
        refetch();
      },
      onError: (error) => {
        const axiosError = error as AxiosError;
        if (axiosError && axiosError?.response?.status === 409) {
          setUserExistError("User already exist!");
        }
        if (axiosError && axiosError?.response?.status === 404) {
          setUserExistError("Invalid credentials!");
        }
      },
      onSettled: () => {
        setIsLoading(false);
      }
    })
  };

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/10 z-50 transform transition-transform duration-300 ease-in-out translate-x-full",
        {
          "translate-x-0": isOpen,
        }
      )}
    >
      <div
        ref={drawerRef}
        className="bg-white fixed right-0 top-0 bottom-0 max-w-lg w-full md:max-w-lg rounded-lg overflow-hidden shadow-xl"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-slate-50 p-5 flex justify-between">
            <div>
              <h1 className="text-2xl font-bold">Add Member</h1>
              <p className="text-slate-400">
                Get started by filling in the information to add a new team member
              </p>
            </div>
            <X onClick={onClose} size={28} className="cursor-pointer" />
          </div>

          {/* Main Content */}
          <div className="flex-grow bg-white px-5 md:px-10 py-4 overflow-auto">
            <h2 className="text-xl font-bold">Member Information</h2>
            <form id="member-form" onSubmit={handleSubmit(onsubmit)} className="mt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-start">
                    <label className="w-[200px] text-nowrap">
                      Jira/Trello <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                      <select {...register("jiraOrTrello")} onChange={(e) => { setJiraOrTrello(e.target.value) }} className={cn("w-full border outline-none px-4 py-2 rounded-md", { "border border-red-400": errors.jiraOrTrello })}>
                        <option value="">Select</option>
                        <option value="jira">Jira</option>
                        <option value="trello">Trello</option>
                      </select>
                      {
                        errors && errors.jiraOrTrello && <p className="text-red-400 flex md:items-center gap-1 text-xs"><Warning className="mt-1 md:mt-0" /> {errors?.jiraOrTrello?.message}</p>
                      }
                    </div>
                  </div>
                </div>
                {jiraOrTrello === "jira" && (
                  <div>
                    <div className="flex items-start">
                      <label className="w-[200px] text-nowrap">
                        Jira ID <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full">
                        <input {...register("jiraId")} onChange={(e) => { register("jiraId").onChange(e); setUserExistError(""); }} placeholder="Enter Jira ID" className={cn("w-full border outline-none px-4 py-2 rounded-md", { "border border-red-400": errors.jiraId })} />
                        {
                          errors && errors.jiraId && <p className="text-red-400 flex items-center gap-1 text-xs"><Warning /> {errors?.jiraId?.message}</p>
                        }
                        {
                          userExistError && <p className="text-red-400 flex items-center gap-1 text-xs"><Warning /> {userExistError}</p>
                        }
                      </div>
                    </div>
                  </div>
                )}
                {jiraOrTrello === "trello" && (
                  <div>
                    <div className="flex items-start">
                      <label className="w-[200px] text-nowrap">
                        Trello ID <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full">
                        <input {...register("trelloId")} onChange={(e) => { register("trelloId").onChange(e); setUserExistError(""); }} placeholder="Enter Trello ID" className={cn("w-full border outline-none px-4 py-2 rounded-md", { "border border-red-400": errors.trelloId })} />
                        {
                          errors && errors.trelloId && <p className="text-red-400 flex items-center gap-1 text-xs"><Warning /> {errors?.trelloId?.message}</p>
                        }
                        {
                          userExistError && <p className="text-red-400 flex items-center gap-1 text-xs"><Warning /> {userExistError}</p>
                        }
                      </div>
                    </div>
                  </div>
                )}
                {/* {jiraOrTrello && (
                  <div>
                    <div className="flex items-start">
                      <label className="w-[200px] text-nowrap">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full">
                        <input {...register("designation")} placeholder="Enter your designation" className={cn("w-full border outline-none px-4 py-2 rounded-md", { "border border-red-400": errors.designation })} />
                        {
                          errors && errors.designation && <p className="text-red-400 flex items-center gap-1 text-xs"><Warning /> {errors?.designation?.message}</p>
                        }
                      </div>
                    </div>
                  </div>
                )} */}
              </div>
            </form>
          </div>

          {/* Button Section */}
          <div className="bg-slate-50 flex justify-end gap-5 p-5">
            <Button variant={"secondary"} type="button" onClick={onClose} className="w-full">
              Cancel
            </Button>
            <Button
              prefixIcon="PlusCircle"
              type="submit"
              className="w-[90px] hover:opacity-90"
              prefixIconClassName="plusIcon"
              form="member-form"
              loading={isLoading}
            >
              {!isLoading && "Create"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberDrawer;
