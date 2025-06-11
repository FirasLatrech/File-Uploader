import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, Text, Icon, LegacyStack, Button } from "@shopify/polaris";
import { UploadMajor } from "@shopify/polaris-icons";

interface FileDropzoneProps {
    onFilesAdded: (files: File[]) => void;
    disabled?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
    onFilesAdded,
    disabled = false,
}) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            onFilesAdded(acceptedFiles);
        },
        [onFilesAdded]
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        disabled,
        noClick: true,
        noKeyboard: true,
    });

    return (
        <Card>
            <div
                {...getRootProps()}
                style={{
                    padding: "2rem",
                    border: isDragActive
                        ? "2px dashed #008060"
                        : "2px dashed #ddd",
                    borderRadius: "8px",
                    backgroundColor: isDragActive ? "#f0f9ff" : "#fafafa",
                    textAlign: "center",
                    cursor: disabled ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    opacity: disabled ? 0.6 : 1,
                }}
            >
                <input {...getInputProps()} />
                <LegacyStack vertical alignment="center" spacing="loose">
                    <Icon source={UploadMajor} tone="subdued" />
                    <LegacyStack vertical alignment="center" spacing="tight">
                        <Text variant="headingMd" as="h3">
                            {isDragActive
                                ? "Drop files here"
                                : "Drag and drop files here"}
                        </Text>
                        <Text variant="bodyMd" tone="subdued" as="p">
                            or
                        </Text>
                        <Button onClick={open} disabled={disabled}>
                            Choose files
                        </Button>
                    </LegacyStack>
                    <Text variant="bodySm" tone="subdued" as="p">
                        Upload multiple files at once. Files will be processed 3
                        at a time.
                    </Text>
                </LegacyStack>
            </div>
        </Card>
    );
};
