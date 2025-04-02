'use client'

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <main className="min-h-screen bg-gray-100">
                <div className="container mx-auto px-4 py-8">
                    {children}
                </div>
            </main>
        </>
    )
} 