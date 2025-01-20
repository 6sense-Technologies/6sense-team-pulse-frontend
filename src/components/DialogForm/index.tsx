import { BACKEND_URI } from '@/app/utils/constants/constants';
import { cn } from '@/app/utils/tailwindMerge';
import { zodResolver } from '@hookform/resolvers/zod';
import { Warning } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ButtonComponent';
import { BugReportSchema } from '../../../Zodschema/memberInformationSchema';

interface IDialogFormProps {
    isOpen: boolean;
    onClose: () => void;
    accountId: string;
    currentDate: string;
}

interface IFormData {
    noOfBug: number;
    token: string;
    comment: string;
}


const DialogForm: React.FC<IDialogFormProps> = ({ isOpen, onClose, currentDate, accountId }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [submissionError, setSubmissionError] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm<IFormData>({
        resolver: zodResolver(BugReportSchema)
    });

    const handleCloseDialog = (): void => {
        onClose();
    };

    const handleBugReport = async (data: IFormData): Promise<void> => {
        const res = await axios.put(`${BACKEND_URI}/users/bug-report/${accountId}/${currentDate}`, {
            noOfBugs: data?.noOfBug,
            comment: data?.comment ?? "",
            token: data?.token
        });

        return res.data;
    }

    const bugReportMutation = useMutation({
        mutationKey: ["bugReport", accountId, currentDate],
        mutationFn: handleBugReport
    })

    const handleFormSubmit = (data: IFormData): void => {
        setSubmissionError("");
        setIsLoading(true);
        bugReportMutation.mutate(data, {
            onSuccess: (data) => {
                handleCloseDialog();
                console.log(data);
            },
            onError: (error) => {
                console.log(error);
                setSubmissionError("Bug report failed!");
            },
            onSettled: () => {
                setIsLoading(false);
                // setSubmissionError("");
            }
        });
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={handleCloseDialog}>
            <div className="relative p-4 w-full max-w-lg max-h-full bg-white rounded-lg shadow" onClick={(e) => { e.stopPropagation(); }}>
                <button
                    type="button"
                    className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                    onClick={handleCloseDialog}
                >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close</span>
                </button>
                <div className="my-10 px-4">
                    <form onSubmit={handleSubmit(handleFormSubmit)} id="submitForm">
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <label className="w-[200px] text-nowrap">
                                    No. Of Bug<span className="text-red-500"> *</span>
                                </label>
                                <div className="w-full">
                                    <input
                                        {...register("noOfBug")}
                                        placeholder="Enter no. of bug"
                                        className={cn("w-full border outline-none px-4 py-2 rounded-md")}
                                    />
                                    {errors.noOfBug && <p className="flex items-center  gap-1 text-red-500 text-sm"><Warning />{errors.noOfBug.message}</p>}
                                </div>
                            </div>

                            <div className="flex items-start">
                                <label className="w-[200px] text-nowrap">
                                    Token<span className="text-red-500"> *</span>
                                </label>
                                <div className="w-full">
                                    <input
                                        {...register("token")}
                                        placeholder="Enter the token"
                                        className={cn("w-full border outline-none px-4 py-2 rounded-md")}
                                    />
                                    {errors.token && <p className="flex items-center  gap-1 text-red-500 text-sm"><Warning /> {errors.token.message}</p>}
                                </div>
                            </div>

                            <div className="flex items-start">
                                <label className="w-[200px] text-nowrap">
                                    Comment
                                </label>
                                <div className="w-full">
                                    <textarea
                                        {...register("comment")}
                                        placeholder="Enter comment"
                                        className={cn("w-full border outline-none px-4 py-2 rounded-md")}
                                    />
                                    {submissionError && <p className="flex items-center  gap-1 text-red-500 text-sm"><Warning /> {submissionError}</p>}
                                </div>
                            </div>

                        </div>
                    </form>
                    <div className="flex gap-4 justify-end mt-8">
                        <Button onClick={handleCloseDialog} variant="outline" className="font-normal focus:outline-[0px]">Cancel</Button>
                        <Button
                            aria-label="create"
                            prefixIcon="PlusCircle"
                            type="submit"
                            className="w-[90px] hover:opacity-90"
                            prefixIconClassName="plusIcon"
                            form="submitForm"
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

export default DialogForm;
