import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import axiosInstance from '@/services/axios';
import toast from 'react-hot-toast';
import { useCommon } from '@/context/CommonContext';
import { useQueryClient } from '@tanstack/react-query';
import DialogImageRenderer from '../common/DialogImageRenderer';
import DialogVideoRenderer from '../common/DialogVideoRenderer';

interface ReportData {
    id: number;
    masterDataId: string;
    summary: string;
    violationType?: string;
    categoryId?: number;
    time: string;
    imageFile?: string;
    videoFile?: string;
    severity?: string;
    activity?: string;
    siteId?: number;
    zoneId?: number;
    violationStatus?: string;
    _id?: string;
    disableEdit?: number;
    disableDelete?: number;
    assignedTo?: string;
    comment?: string;
    reviewedAt?: string;
}

interface ViolationDetailsFormProps {
    data: ReportData;
    setIsDialogOpen: (value: boolean) => void;
}

const ViolationDetailsForm: React.FC<ViolationDetailsFormProps> = ({ data, setIsDialogOpen }) => {
    const { categories, sites, zones } = useCommon();
    console.log("🚀 ~ categories:", categories)

    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const statusOptions = [
        { value: 'PENDING', label: 'PENDING' },
        { value: 'CLOSED', label: 'CLOSED' },
    ];

    const severityOptions = [
        { value: 'CATASTROPHIC', label: 'CATASTROPHIC' },
        { value: 'CRITICAL', label: 'CRITICAL' },
        { value: 'MODERATE', label: 'MODERATE' },
        { value: 'MINOR', label: 'MINOR' },
        { value: 'HAZARDOUS', label: 'HAZARDOUS' },
    ];

    const activityOptions = [
        { value: 'Drilling', label: 'Drilling' },
        { value: 'Work Over', label: 'Work Over' },
    ];

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
        "Line of Fire Intrusion"
    ].map(type => ({ value: type, label: type }));

    const siteOptions = sites.map((site: any) => ({ value: site.id, label: site.name }));
    const zoneOptions = zones.map((zone: any) => ({ value: zone.id, label: zone.name }));
    // const typeOptions = types.map((type: any) => ({ value: type.type, label: type.type }));
    const categoryOptions = categories.map((category: any) => ({ value: category.id, label: category.name }));

    const { control, handleSubmit } = useForm({
        defaultValues: {
            id: data.id,
            siteId: data.siteId,
            zoneId: data.zoneId,
            violationStatus: data.violationStatus,
            severity: data.severity,
            activity: data.activity,
            categoryId: data.categoryId,
            violationType: data.violationType,
            assignedTo: data.assignedTo,
            comment: data.comment,
        }
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        const postData = {
            ...data,
            categoryId: parseInt(data.categoryId),
            siteId: parseInt(data.siteId),
            zoneId: parseInt(data.zoneId),
        };

        try {
            const response = await axiosInstance.put(`/violations?id=${data.id}`, postData);
            if (response.status === 200) {
                toast.success('Violation Record Updated successfully');
                await queryClient.invalidateQueries({ queryKey: ['violations'] });
                await queryClient.invalidateQueries({ queryKey: ['violationStats'] });
                setLoading(false);
                setIsDialogOpen(false);
            } else {
                toast.error('Unexpected response status');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('An error occurred while submitting the form');
            setLoading(false);
        }
    };

    const NEXT_PUBLIC_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    {/* <InfoRow label="TYPE" value={data?.type} /> */}
                    <InfoRow label="Reviewed At" value={
                        data?.reviewedAt ? new Date(data.reviewedAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }) : "Not Reviewed"} />
                    <InfoRow label="AI Violation ID" value={data?.masterDataId?.toString()} />
                    <InfoRow
                        label="AI Violation Type"
                        value={data?.summary === "CurrentPeopleNum" ? "Line of Fire" : data?.summary ?? ''}
                    />
                    {/* <InfoRow label="DEPARTMENT" value={data?.status } /> */}
                    <InfoRow label="DATE & TIME" value={data?.time} />
                    {/* <StatusRow value={data?.status} /> */}

                    <div className="">
                        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-2">
                            <div className="text-primary text-xs my-auto">SITE ID</div>
                            <Controller
                                name="siteId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={field.value?.toString()}
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
                                        value={field.value?.toString()}
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
                                        value={field.value?.toString()}
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
                        data.imageFile && (
                            <DialogImageRenderer src={`${NEXT_PUBLIC_CDN_URL}${data.imageFile}`} style={{ width: '100%', height: 'auto' }} />
                        )
                    }
                    {
                        data.videoFile && (
                            <DialogVideoRenderer src={`${NEXT_PUBLIC_CDN_URL}${data.videoFile}`} style={{ width: '100%', height: 'auto' }} />
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

export default ViolationDetailsForm;
