import { createPageMetadata } from "@/utils/metadata";
import ContactClientPage from "./page.client";

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'contact');
}
export default function ContactPage() {

    return (
        <ContactClientPage />
    );
}
