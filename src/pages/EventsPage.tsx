import React, { useEffect, useState } from 'react';
import { EcosystemService } from '@/services/ecosystem';
import { Event } from '@/types/ecosystem';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const data = await EcosystemService.getEvents();
            setEvents(data);
        } catch (error) {
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId: string) => {
        try {
            await EcosystemService.registerForEvent(eventId);
            toast.success("Successfully registered for event!");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Registration failed";
            toast.error(message);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col mb-8 gap-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                    Community Events
                </h1>
                <p className="text-muted-foreground">
                    Join lectures, workshops, and gatherings in your area.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <p>Loading events...</p>
                ) : events.map((event) => (
                    <Card key={event.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl">{event.title}</CardTitle>
                                <div className="flex flex-col items-end text-sm text-primary font-medium">
                                    <span>{format(new Date(event.start_time), 'MMM d, yyyy')}</span>
                                    <span>{format(new Date(event.start_time), 'h:mm a')}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground mb-4">{event.description}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-primary" />
                                    <span>{event.location_name || 'Online'}</span>
                                </div>
                                {event.max_attendees && (
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-primary" />
                                        <span>Max Capacity: {event.max_attendees}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handleRegister(event.id)}>
                                <Calendar className="mr-2 h-4 w-4" /> Register Now
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
