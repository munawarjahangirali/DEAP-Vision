import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import axiosInstance from '@/services/axios';
import toast from 'react-hot-toast';
import ReactPlayer from 'react-player';
import { useQueryClient } from '@tanstack/react-query';
import ImageRenderer from '../common/ImageRenderer';
import DialogImageRenderer from '../common/DialogImageRenderer';
import DialogVideoRenderer from '../common/DialogVideoRenderer';

interface MasterData {
    id: number;
    dataId: string;
    violation_id: string;
    mediaName: string;
    image?: string;
    videoFile?: string;
    summary: string;
    taskSession: string;
    time: string;
    alarmType: string;
    type: string;
    status: string;
    region: string;
    regType: string;
    description: string;
    boardIp: string;
    violationType?: string;
    siteId?: string;
    zoneId?: string;
    categoryId?: string;
    severity?: string;
    activity?: string;
    assignedTo?: string;
    comment?: string;
    violationsStatus?: string;
    _id?: string;
    disableEdit?: number;
    disableDelete?: number;
}

interface MasterDetailsFormProps {
    master: MasterData;
    categories: { id: number; name: string }[];
    // types: { type: string }[];
    zones: { id: number; name: string }[];
    sites: { id: number; name: string }[];
    setIsDialogOpen: (value: boolean) => void;
}

const MasterDetailsForm: React.FC<MasterDetailsFormProps> = ({ master, categories, setIsDialogOpen, zones, sites }) => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            siteId: master?.siteId,
            zoneId: master?.zoneId,
            violationStatus: master?.violationsStatus,
            severity: master?.severity,
            activity: master?.activity,
            categoryId: master?.categoryId,
            violationType: master?.violationType,
            assignedTo: master?.assignedTo,
            comment: master?.comment,
        },
    });
    const [loading, setLoading] = useState(false);

    const queryClient = useQueryClient();

    const statusOptions = [
        { value: 'PENDING', label: 'PENDING' },
        { value: 'CLOSED', label: 'CLOSED' },
    ];

    const severityOptions = [
        { value: 'CATASTROPHIC', label: 'CATASTROPHIC' },
        { value: 'MINOR', label: 'MINOR' },
        { value: 'MODERATE', label: 'MODERATE' },
        { value: 'CRITICAL', label: 'CRITICAL' },
        { value: 'HAZARDOUS', label: 'HAZARDOUS' },
    ];
    const activityOptions = [
        { value: 'Drilling', label: 'Drilling' },
        { value: 'Work Over', label: 'Work Over' },
    ];
    const categoryOptions = categories.map(category => ({
        value: category.id.toString(),
        label: category.name,
    }));

    const typeOptions = [
        "Glove (PPE)",
        "Helmet (PPE)",
        "Cap (PPE)",
        "Hood (PPE)",
        "Sheld (PPE)",
        "Glass (PPE)",
        "Vest (PPE)",
        "Pents (PPE)",
        "Dropped Object",
        "Injury/illness",
        "Line of Fire Intrusion",
    ].map(type => ({ value: type, label: type }));

    const siteOptions = sites.map(site => ({
        value: site.id?.toString(),
        label: site?.name,
    }));

    const zoneOptions = zones.map(zone => ({
        value: zone.id?.toString(),
        label: zone.name,
    }));

    const onSubmit = async (data: any) => {
        setLoading(true);
        const postData = {
            ...data,
            masterDataId: master.id,
            categoryId: parseInt(data.categoryId),
            siteId: parseInt(data.siteId),
            zoneId: parseInt(data.zoneId),
        };

        try {
            const response = await axiosInstance.post('/violations', postData);
            const responseData = response.data;

            if (responseData.status === 201) {
                toast.success(responseData.message || 'Violation Record Added successfully');
                await queryClient.invalidateQueries({ queryKey: ['masterData'] })
                setIsDialogOpen(false);
            } else if (responseData.status === 200) {
                toast.success(responseData.message || 'Violation Record Updated successfully');
                await queryClient.invalidateQueries({ queryKey: ['masterData'] })
                setIsDialogOpen(false);
            } else {
                toast.error(responseData.error || 'Failed to process request');
            }
        } catch (error: any) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.error || 'An error occurred while submitting the form';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const NEXT_PUBLIC_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    {/* <InfoRow label="TYPE" value={master?.type} /> */}
                    <InfoRow label="ID" value={master?.id.toString()} />
                    <InfoRow label="Data ID" value={master?.dataId.toString()} />
                    <InfoRow
                        label="AI Violation Type"
                        value={master?.summary === "CurrentPeopleNum" ? "Line of Fire" : master?.summary}
                    />
                    {/* <InfoRow label="DEPARTMENT" value={master?.status } /> */}
                    <InfoRow label="DATE & TIME" value={master?.time} />
                    {/* <StatusRow value={master?.status} /> */}

                    <div className="">
                        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-2">
                            <div className="text-primary text-xs my-auto">SITE ID</div>
                            <Controller
                                name="siteId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={siteOptions}
                                        placeholder="Select Site"
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-2">
                            <div className="text-primary text-xs my-auto">ZONE ID</div>
                            <Controller
                                name="zoneId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={zoneOptions}
                                        placeholder="Select Zone"
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-2">
                            <div className="text-primary text-xs my-auto">STATUS</div>
                            <Controller
                                name="violationStatus"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={statusOptions}
                                        placeholder="Select Status"
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-2">
                            <div className="text-primary text-xs my-auto">SEVERITY</div>
                            <Controller
                                name="severity"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={severityOptions}
                                        placeholder="Select Severity"
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-2">
                            <div className="text-primary text-xs my-auto">ACTIVITY</div>
                            <Controller
                                name="activity"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={activityOptions}
                                        placeholder="Select Activity"
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-2">
                            <div className="text-primary text-xs my-auto">CATEGORY</div>
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={categoryOptions || []}
                                        placeholder="Select Category"
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-2">
                            <div className="text-primary text-xs my-auto">TYPE</div>
                            <Controller
                                name="violationType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={typeOptions || []}
                                        placeholder="Select Types"
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-2">
                            <div className="text-primary text-xs my-auto">ASSIGNED TO</div>
                            <Controller
                                name="assignedTo"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Assigned To"
                                        className="w-full h-8"
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2 border-b border-gray-200 py-2">
                            {/* <div className="text-primary text-xs my-auto">COMMENT</div> */}
                            <Controller
                                name="comment"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        placeholder="Comment"
                                        className="w-full h-20 p-2 border border-gray-300 rounded"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full" variant="primary" isLoading={loading}>
                            SAVE CHANGES
                        </Button>
                    </div>
                </div>

                <div>
                    {
                        master?.image && (
                            <DialogImageRenderer src={`${NEXT_PUBLIC_CDN_URL}${master.image}`} style={{ width: '100%', height: 'auto' }} />
                        )
                    }
                    {
                        master?.videoFile && (
                            <DialogVideoRenderer src={`${NEXT_PUBLIC_CDN_URL}${master.videoFile}`} style={{ width: '100%', height: 'auto' }} />
                        )
                    }
                </div>
            </div>
        </form>
    );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-2">
        <div className="text-primary text-xs">{label}</div>
        <div className="text-secondary text-xs">{value}</div>
    </div>
);

const StatusRow = ({ value }: { value: string }) => (
    <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-2">
        <div className="text-primary text-xs">STATUS</div>
        <div className="text-xs">
            <span className={`
        inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
        ${value === "Active"
                    ? "bg-green-50 text-green-700"
                    : "bg-yellow-50 text-yellow-700"
                }
      `}>
                {value}
            </span>
        </div>
    </div>
);

export default MasterDetailsForm;
