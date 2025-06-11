import React from "react";
import { AppProvider, Page, Layout, LegacyStack, Text } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";

import { useFileUpload } from "@/hooks/useFileUpload";
import { FileDropzone } from "@/components/FileDropzone";
import { UploadQueueStatus } from "@/components/UploadQueueStatus";
import { FileList } from "@/components/FileList";

function App() {
    const {
        files,
        queueStatus,
        addFiles,
        retryFailedFiles,
        clearCompleted,
        removeFile,
        getStatusColor,
        getStatusText,
    } = useFileUpload({
        maxConcurrent: 3,
        maxRetries: 3,
        retryDelay: 2000,
    });

    return (
        <AppProvider i18n={{}}>
            <Page
                title="File Uploader Challenge"
                subtitle="Upload multiple files with queue management (max 3 concurrent uploads)"
            >
                <Layout>
                    <Layout.Section>
                        <LegacyStack vertical spacing="loose">
                            <FileDropzone onFilesAdded={addFiles} />

                            <UploadQueueStatus
                                queueStatus={queueStatus}
                                onRetryFailed={retryFailedFiles}
                                onClearCompleted={clearCompleted}
                            />

                            <FileList
                                files={files}
                                onRemoveFile={removeFile}
                                getStatusColor={getStatusColor}
                                getStatusText={getStatusText}
                            />
                        </LegacyStack>
                    </Layout.Section>

                    <Layout.Section variant="oneThird">
                        <LegacyStack vertical spacing="loose">
                            <Text variant="headingMd" as="h3">
                                Features
                            </Text>
                            <div style={{ paddingLeft: "1rem" }}>
                                <ul>
                                    <li>Drag and drop multiple files</li>
                                    <li>
                                        Queue management (max 3 concurrent
                                        uploads)
                                    </li>
                                    <li>Progress tracking for each file</li>
                                    <li>
                                        Automatic retry on failure (max 3
                                        retries)
                                    </li>
                                    <li>File preview for images</li>
                                    <li>
                                        Clean and responsive UI with Shopify
                                        Polaris
                                    </li>
                                </ul>
                            </div>
                        </LegacyStack>
                    </Layout.Section>
                </Layout>
            </Page>
        </AppProvider>
    );
}

export default App;
