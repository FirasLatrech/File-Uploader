import {
    Card,
    Text,
    LegacyStack,
    Button,
    Badge,
    ProgressBar,
} from "@shopify/polaris";

interface QueueStatus {
    total: number;
    pending: number;
    uploading: number;
    completed: number;
    failed: number;
    retrying: number;
}

interface UploadQueueStatusProps {
    queueStatus: QueueStatus;
    onRetryFailed: () => void;
    onClearCompleted: () => void;
}

export const UploadQueueStatus: React.FC<UploadQueueStatusProps> = ({
    queueStatus,
    onRetryFailed,
    onClearCompleted,
}) => {
    const { total, pending, uploading, completed, failed, retrying } =
        queueStatus;

    if (total === 0) {
        return null;
    }

    const progress = total > 0 ? (completed / total) * 100 : 0;

    return (
        <Card>
            <LegacyStack vertical spacing="loose">
                <Text variant="headingMd" as="h3">
                    Upload Queue Status
                </Text>

                <ProgressBar progress={progress} size="small" />

                <LegacyStack wrap spacing="tight">
                    <Badge tone="info">{`Total: ${total}`}</Badge>
                    {pending > 0 && (
                        <Badge tone="info">{`Pending: ${pending}`}</Badge>
                    )}
                    {uploading > 0 && (
                        <Badge tone="attention">{`Uploading: ${uploading}`}</Badge>
                    )}
                    {completed > 0 && (
                        <Badge tone="success">{`Completed: ${completed}`}</Badge>
                    )}
                    {failed > 0 && (
                        <Badge tone="critical">{`Failed: ${failed}`}</Badge>
                    )}
                    {retrying > 0 && (
                        <Badge tone="warning">{`Retrying: ${retrying}`}</Badge>
                    )}
                </LegacyStack>

                <LegacyStack spacing="tight">
                    {failed > 0 && (
                        <Button onClick={onRetryFailed} size="slim">
                            {`Retry Failed (${failed})`}
                        </Button>
                    )}
                    {completed > 0 && (
                        <Button
                            onClick={onClearCompleted}
                            size="slim"
                            variant="secondary"
                        >
                            {`Clear Completed (${completed})`}
                        </Button>
                    )}
                </LegacyStack>
            </LegacyStack>
        </Card>
    );
};
