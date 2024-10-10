import { Button } from '@/app/components/UI/ButtonComponent';
import { BACKEND_URI } from '@/app/utils/constants/constants';
import { cn } from '@/app/utils/tailwindMerge';
import { zodResolver } from '@hookform/resolvers/zod';
import { Warning } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface ICommentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    accountId: string;
    currentDate: string;
    commentAdded: () => void;
}

interface IFormData {
    comment: string;
}

const CommentSchema = z.object({
    comment: z
        .string()
        .min(1, "Comment is required!")
});

const CommentDialog: React.FC<ICommentDialogProps> = ({ commentAdded, isOpen, onClose, currentDate, accountId }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [submissionError, setSubmissionError] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm<IFormData>({
        resolver: zodResolver(CommentSchema)
    });

    const handleCloseDialog = (): void => {
        onClose();
    };

    const handleComment = async (data: IFormData): Promise<void> => {
        const res = await axios.put(`${BACKEND_URI}/users/bug-report/${accountId}/${currentDate}`, {
            comment: data?.comment,
        });

        return res.data;
    }

    const commentMutation = useMutation({
        mutationKey: ["comment", accountId, currentDate],
        mutationFn: handleComment
    })

    const handleFormSubmit = (data: IFormData): void => {
        setSubmissionError("");
        setIsLoading(true);
        commentMutation.mutate(data, {
            onSuccess: (data) => {
                handleCloseDialog();
                commentAdded();
                console.log(data);
            },
            onError: (error) => {
                console.log(error);
                setSubmissionError("Adding comment failed!");
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
                                    Comment <span className="text-red-500"> *</span>
                                </label>
                                <div className="w-full">
                                    <textarea
                                        {...register("comment")}
                                        placeholder="Enter comment"
                                        className={cn("w-full border outline-none px-4 py-2 rounded-md", {
                                            "border border-red-400": errors?.comment
                                        })}
                                    />
                                    {errors && errors?.comment && <p className="flex items-center  gap-1 text-red-500 text-sm"><Warning /> {errors?.comment?.message}</p>}
                                    {submissionError && <p className="flex items-center  gap-1 text-red-500 text-sm"><Warning /> {submissionError}</p>}
                                </div>
                            </div>

                        </div>
                    </form>
                    <div className="flex gap-4 justify-end mt-8">
                        <Button data-testid="Cancel" onClick={handleCloseDialog} variant="outline" className="font-normal focus:outline-[0px]">Cancel</Button>
                        <Button
                            data-testid="post"
                            prefixIcon="PlusCircle"
                            type="submit"
                            className="w-[90px] hover:opacity-90"
                            prefixIconClassName="plusIcon"
                            form="submitForm"
                            loading={isLoading}
                        >
                            {!isLoading && "Post"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentDialog;
