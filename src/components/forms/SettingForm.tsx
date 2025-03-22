'use client'
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosInstance from '@/services/axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import DeleteDialog from '../common/DeleteDialog';

// Validation schema
const settingSchema = z.object({
    priority: z.union([z.number().min(1, 'Priority is required'), z.nan()]).refine(value => !isNaN(value), {
        message: "Priority is required"
    }),
    objectObservation: z.string().min(1, 'Object Observation is required'),
    camera: z.string().min(1, 'Camera is required'),
    primaryCategory: z.string().min(1, 'Primary Category is required'),
    zone: z.string().min(1, 'Zone is required'),
    secondaryCategory: z.string().min(1, 'Secondary Category is required'),
    timeFrom: z.string().min(1, 'Time From is required'),
    timeUntil: z.string().min(1, 'Time Until is required'),
    eventThreshold: z.union([z.number().min(1, 'Event Threshold is required'), z.nan()]).refine(value => !isNaN(value), {
        message: "Event Threshold is required"
    }),
    solution: z.string().min(1, 'Solution is required'),
});

type SettingFormData = z.infer<typeof settingSchema>;

interface SettingFormProps {
    initialData?: any;
    isEdit?: boolean;
}

const SettingForm = ({ initialData, isEdit }: SettingFormProps) => {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const {push} = useRouter();

    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<SettingFormData>({
        resolver: zodResolver(settingSchema),
        defaultValues: initialData || {}
    });

    const onSubmit = async (data: SettingFormData) => {
        try {
            setIsSubmitting(true);
            const response = await axiosInstance[isEdit ? 'put' : 'post']('/settings', {
                ...data,
                id: initialData?.id,
                priority: isNaN(data.priority) ? null : Number(data.priority),
                eventThreshold: isNaN(data.eventThreshold) ? null : Number(data.eventThreshold),
                createdBy: 1,
                updatedBy: 1
            });
            
            if (response.data.status === (isEdit ? 200 : 201)) {
                // Invalidate queries after successful update
                await queryClient.invalidateQueries({ queryKey: ['setting'] });
                toast.success(`Setting ${isEdit ? 'updated' : 'created'} successfully`);
                router.push('/settings');
            }
        } catch (error) {
            toast.error(`Failed to ${isEdit ? 'update' : 'create'} setting`);
            console.error(`Error ${isEdit ? 'updating' : 'creating'} setting:`, error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await axiosInstance.delete('/settings', {
                data: { id: deleteId }
            });
            if (response.data.status === 200) {
                toast.success('Setting deleted successfully');
                // Refetch the data
                push('/settings');
            }
        } catch (error) {
            toast.error('Failed to delete setting');
            console.error('Error deleting setting:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDeleteId(null);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <Input
                    label="Priority"
                    id="priority"
                    type="number"
                    className="col-span-1"
                    {...register('priority', { 
                        valueAsNumber: true, 
                    })}
                    error={errors.priority?.message}
                    disabled={isSubmitting}
                />
                <Input
                    label="Object Observation"
                    id="objectObservation"
                    type="text"
                    className="col-span-1"
                    {...register('objectObservation')}
                    error={errors.objectObservation?.message}
                    disabled={isSubmitting}
                />
                <Input
                    label="Camera"
                    id="camera"
                    type="text"
                    className="col-span-1"
                    {...register('camera')}
                    error={errors.camera?.message}
                    disabled={isSubmitting}
                />
                <Input
                    label="Primary Category"
                    id="primaryCategory"
                    type="text"
                    className="col-span-1"
                    {...register('primaryCategory')}
                    error={errors.primaryCategory?.message}
                    disabled={isSubmitting}
                />
                <Input
                    label="Zone"
                    id="zone"
                    type="text"
                    className="col-span-1"
                    {...register('zone')}
                    error={errors.zone?.message}
                    disabled={isSubmitting}
                />
                <Input
                    label="Secondary Category"
                    id="secondaryCategory"
                    type="text"
                    className="col-span-1"
                    {...register('secondaryCategory')}
                    error={errors.secondaryCategory?.message}
                    disabled={isSubmitting}
                />
                <Input
                    label="Time From"
                    id="timeFrom"
                    type="text"
                    className="col-span-1"
                    {...register('timeFrom')}
                    error={errors.timeFrom?.message}
                    disabled={isSubmitting}
                />
                <Input
                    label="Time Until"
                    id="timeUntil"
                    type="text"
                    className="col-span-1"
                    {...register('timeUntil')}
                    error={errors.timeUntil?.message}
                    disabled={isSubmitting}
                />
                <Input
                    label="Event Threshold"
                    id="eventThreshold"
                    type="number"
                    className="col-span-1"
                    {...register('eventThreshold', { 
                        valueAsNumber: true, 
                    })}
                    error={errors.eventThreshold?.message}
                    disabled={isSubmitting}
                />
                <Input
                    label="Solution"
                    id="solution"
                    type="text"
                    className="col-span-1"
                    {...register('solution')}
                    error={errors.solution?.message}
                    disabled={isSubmitting}
                />
            </div>
            <div className="flex justify-between items-center mt-6">
            <div className="col-span-2 flex justify-start gap-4 mt-5">
                <Button
                    type="submit"
                    className="text-sm"
                    variant='primary'
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    {isEdit ? 'Update' : 'Create'}
                </Button>
                <Button
                    type="button"
                    className="text-sm"
                    variant='outline'
                    onClick={() => router.push('/settings')}
                    disabled={isSubmitting}
                >
                    Back
                </Button>
            </div>
            {
                isEdit && (
                    <div>
                        <Button
                            type="button"
                            className="text-sm"
                            variant='delete'
                            onClick={() => {
                                setDeleteId(initialData.id);
                                setShowDeleteModal(true);
                            }}
                            isLoading={isDeleting}
                        >
                            Delete
                        </Button>
                    </div>
                )
            }
            </div>
            <DeleteDialog
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                isDeleting={isDeleting}
            />
        </form>
    );
};

export default SettingForm;
