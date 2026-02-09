import { OrganizerApplicationForm } from "@/components/forms/organizer-application"

export default function ApplyPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Become an Organizer</h1>
                <p className="text-muted-foreground">
                    Apply to host public events and reach a wider audience.
                </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <OrganizerApplicationForm />
            </div>
        </div>
    )
}
