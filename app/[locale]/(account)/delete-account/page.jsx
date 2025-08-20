import { createPageMetadata } from "@/utils/metadata";
import DeleteAccountClient from "./page.client";

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'deleteAccount');
}
export default function DeleteAccountPage() {
    return (
        <DeleteAccountClient />
    );
}

