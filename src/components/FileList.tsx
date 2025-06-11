import {
    Card,
    ResourceList,
    ResourceItem,
    Text,
    LegacyStack,
    Badge,
    ProgressBar,
    Button,
    Thumbnail,
} from "@shopify/polaris";
import { DeleteMajor, ViewMajor } from "@shopify/polaris-icons";
import { UploadFile, UploadStatus } from "../types/upload";

interface FileListProps {
    files: UploadFile[];
    onRemoveFile: (fileId: string) => void;
    getStatusColor: (status: UploadStatus) => string;
    getStatusText: (status: UploadStatus) => string;
}

export const FileList: React.FC<FileListProps> = ({
    files,
    onRemoveFile,
    getStatusColor,
    getStatusText,
}) => {
    if (files.length === 0) {
        return null;
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith("image/")) {
            try {
                return (
                    <Thumbnail
                        source={URL.createObjectURL(file)}
                        alt={file.name}
                        size="small"
                    />
                );
            } catch {
                return <Thumbnail source="" alt={file.name} size="small" />;
            }
        }
        return <Thumbnail source="" alt={file.name} size="small" />;
    };

    const renderItem = (file: UploadFile) => {
        const { id, file: originalFile, status, progress, error, url } = file;
        const statusColor = getStatusColor(status) as any;
        const statusText = getStatusText(status);

        return (
            <ResourceItem
                id={id}
                key={id}
                onClick={() => url && window.open(url, "_blank")}
            >
                <LegacyStack alignment="center" spacing="loose">
                    {getFileIcon(originalFile)}

                    <div style={{ flex: 1 }}>
                        <LegacyStack
                            alignment="center"
                            distribution="equalSpacing"
                        >
                            <LegacyStack vertical spacing="extraTight">
                                <Text
                                    variant="bodyMd"
                                    fontWeight="medium"
                                    as="p"
                                >
                                    {originalFile.name}
                                </Text>
                                <Text variant="bodySm" tone="subdued" as="p">
                                    {formatFileSize(originalFile.size)}
                                </Text>
                            </LegacyStack>

                            <LegacyStack alignment="center" spacing="tight">
                                <Badge tone={statusColor}>{statusText}</Badge>
                                {status === UploadStatus.UPLOADING && (
                                    <Text variant="bodySm" as="p">
                                        {progress}%
                                    </Text>
                                )}
                            </LegacyStack>
                        </LegacyStack>

                        {status === UploadStatus.UPLOADING && (
                            <ProgressBar progress={progress} size="small" />
                        )}

                        {error && (
                            <Text variant="bodySm" tone="critical" as="p">
                                Error: {error}
                            </Text>
                        )}

                        <LegacyStack alignment="center" spacing="tight">
                            {url && status === UploadStatus.COMPLETED && (
                                <Button
                                    size="slim"
                                    icon={ViewMajor}
                                    onClick={() => window.open(url, "_blank")}
                                >
                                    View
                                </Button>
                            )}
                            <Button
                                size="slim"
                                icon={DeleteMajor}
                                variant="secondary"
                                tone="critical"
                                onClick={() => onRemoveFile(id)}
                            >
                                Remove
                            </Button>
                        </LegacyStack>
                    </div>
                </LegacyStack>
            </ResourceItem>
        );
    };

    return (
        <Card>
            <LegacyStack vertical spacing="loose">
                <Text variant="headingMd" as="h3">
                    Files ({files.length})
                </Text>
                <ResourceList
                    resourceName={{ singular: "file", plural: "files" }}
                    items={files}
                    renderItem={renderItem}
                />
            </LegacyStack>
        </Card>
    );
};
