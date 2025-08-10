import EventsClientPage from "./page.client";
import { createPageMetadata } from "@/utils/metadata";

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'events');
}
export default function EventsPage() {

    return (
        <EventsClientPage />
    );
}
