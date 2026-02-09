import { Calendar, MapPin, User } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from "@/components/ui/modal"

interface PlanCardProps {
    plan: {
        id: string
        title: string
        description: string
        date: string
        location: string
        organizer: string
        avatar?: string
    }
}

export function PlanCard({ plan }: PlanCardProps) {
    return (
        <Card className="h-full flex flex-col hover:border-primary/50 transition-colors">
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    {plan.avatar ? (
                        <Image src={plan.avatar} alt={plan.organizer} width={32} height={32} className="rounded-full" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                        </div>
                    )}
                </div>
                <div className="text-sm text-muted-foreground">by {plan.organizer}</div>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex-1 space-y-3">
                <p className="text-sm">{plan.description}</p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{plan.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{plan.location}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Modal>
                    <ModalTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">Join Plan</Button>
                    </ModalTrigger>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>Join {plan.title}</ModalTitle>
                            <ModalDescription>
                                Reach out to {plan.organizer} to join this plan.
                            </ModalDescription>
                        </ModalHeader>
                        <div className="grid gap-4 py-4">
                            <p>
                                Detailed contact info or external link would go here.
                            </p>
                        </div>
                        <ModalFooter>
                            <Button type="submit">Contact Organizer</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </CardFooter>
        </Card>
    )
}
