'use client';

import React, { useState, useEffect } from 'react';

interface PDFPanelProps {
    pdfUrl: string;
}

export const PDFPanel: React.FC<PDFPanelProps> = ({ pdfUrl }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (pdfUrl) {
            setIsLoading(true);
        }
    }, [pdfUrl]);

    if (!pdfUrl) {
        return (
            <div className="flex h-full w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                <div className="text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <p className="mt-2 text-sm font-medium">No PDF loaded</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-950">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-800 dark:border-t-indigo-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading PDF...</span>
                    </div>
                </div>
            )}
            <iframe
                src={pdfUrl}
                title="PDF Viewer"
                className="w-full h-full border-none"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};
