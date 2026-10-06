'use client';

import React, { useState, useRef } from 'react';

const ImgBBUpload = ({ onUploadSuccess, onUploadError, multiple = false, maxFiles = 5 }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentFile, setCurrentFile] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!uploading) {
            setIsDragOver(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        if (uploading) return;

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            // Create a synthetic event object for the file input
            const syntheticEvent = {
                target: { files }
            };
            handleFileSelect(syntheticEvent);
        }
    };

    const handleFileSelect = async (event) => {
        const files = Array.from(event.target.files);

        if (files.length === 0) return;

        if (files.length > maxFiles) {
            onUploadError && onUploadError(`Maximum ${maxFiles} files allowed`);
            return;
        }

        setUploading(true);
        setProgress(0);
        setCurrentFile('');

        const uploadedUrls = [];
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        if (!apiKey) {
            onUploadError && onUploadError('ImgBB API key is not configured. Please contact administrator.');
            setUploading(false);
            return;
        }

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setCurrentFile(file.name);

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    onUploadError && onUploadError(`File ${file.name} is not an image`);
                    continue;
                }

                // Validate file size (max 32MB - ImgBB limit)
                const maxSize = 32 * 1024 * 1024; // 32MB
                const fileSizeMB = file.size / (1024 * 1024);
                if (file.size > maxSize) {
                    onUploadError && onUploadError(`File "${file.name}" is too large (${fileSizeMB.toFixed(1)}MB). Maximum allowed size is 32MB.`);
                    continue;
                }

                // Additional validation for very small files (less than 1KB might be corrupted)
                if (file.size < 1024) {
                    onUploadError && onUploadError(`File "${file.name}" appears to be corrupted or too small (${file.size} bytes).`);
                    continue;
                }

                const formData = new FormData();
                formData.append('image', file);
                formData.append('key', apiKey);

                const response = await fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Upload failed with status ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                if (data.success) {
                    uploadedUrls.push(data.data.url);
                } else {
                    const errorMsg = data.error?.message || data.error || 'Unknown upload error';
                    onUploadError && onUploadError(`Failed to upload "${file.name}": ${errorMsg}`);
                }

                // Update progress with current file name
                setProgress(Math.round(((i + 1) / files.length) * 100));

                // Show current file being uploaded
                console.log(`Uploading ${file.name} (${fileSizeMB.toFixed(1)}MB)...`);
            }

            if (uploadedUrls.length > 0) {
                onUploadSuccess && onUploadSuccess(uploadedUrls);
            }
        } catch (error) {
            console.error('Upload error:', error);
            onUploadError && onUploadError('Network error during upload');
        } finally {
            setUploading(false);
            setProgress(0);
            setCurrentFile('');
            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="relative">
            <input
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
                id="imgbb-upload"
            />

            {/* Professional Upload Area */}
            <label
                htmlFor="imgbb-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group relative block w-full min-h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${
                    uploading
                        ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
                        : isDragOver
                        ? 'border-green-400 bg-linear-to-br from-green-50 to-emerald-50 shadow-lg scale-[1.02]'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 hover:shadow-lg'
                }`}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-purple-100"></div>
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                {/* Content */}
                <div className="relative flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                    {uploading ? (
                        /* Uploading State */
                        <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                            <div className="relative">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-blue-700 mb-1">
                                    {currentFile ? `Uploading: ${currentFile.length > 20 ? currentFile.substring(0, 20) + '...' : currentFile}` : 'Uploading Images...'}
                                </p>
                                <p className="text-xs text-blue-600">{progress}% complete</p>
                            </div>
                        </div>
                    ) : (
                        /* Default State */
                        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                            <div className="relative">
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${isDragOver ? 'bg-linear-to-br from-green-500 to-emerald-600' : 'bg-linear-to-br from-blue-500 to-purple-600'} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isDragOver ? "M5 13l4 4L19 7" : "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"} />
                                    </svg>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                            </div>

                            <div className="text-center">
                                <h3 className="text-base font-bold text-[#1a2e5a]">
                                    {isDragOver ? 'Drop Photo Here' : 'Select Photo'}
                                </h3>
                                <p className="text-[11px] text-[#6B7280] mt-1 font-medium">
                                    Click to browse or drag & drop
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Hover Effect */}
                {!uploading && (
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                )}
            </label>

            {/* Progress Bar (only shown during upload) */}
            {uploading && (
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Upload Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImgBBUpload;