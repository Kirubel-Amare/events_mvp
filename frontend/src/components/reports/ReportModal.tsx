"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { apiClient } from "@/lib/api/client"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

interface ReportModalProps {
    isOpen: boolean
    onClose: () => void
    type: "user" | "event" | "plan" | "comment" | "other"
    contentId: string
}

export function ReportModal({ isOpen, onClose, type, contentId }: ReportModalProps) {
    const [reason, setReason] = useState("")
    const [details, setDetails] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!reason) {
            toast.error("Please select a reason for reporting")
            return
        }

        setIsSubmitting(true)
        try {
            await apiClient.post("/reports", {
                type,
                contentId,
                reason,
                details
            })
            toast.success("Report submitted successfully")
            onClose()
            setReason("")
            setDetails("")
        } catch (error) {
            console.error("Report submission error:", error)
            toast.error("Failed to submit report. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Report Content</DialogTitle>
                    <DialogDescription>
                        Please let us know why you are reporting this content. Your report will be reviewed by our team.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Reason</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                                <SelectItem value="spam">Spam or Misleading</SelectItem>
                                <SelectItem value="harassment">Harassment or Hate Speech</SelectItem>
                                <SelectItem value="violence">Violence or Illegal content</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Additional Details (Optional)</Label>
                        <Textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Please provide any specific details..."
                            className="resize-none h-24"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !reason} className="bg-red-600 hover:bg-red-700 text-white">
                        {isSubmitting && <LoadingSpinner className="mr-2 h-4 w-4" />}
                        Submit Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
