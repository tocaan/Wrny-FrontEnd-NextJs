import { createPageMetadata } from "@/utils/metadata";
import VerifyPhoneClientPage from "./page.client";

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'verify');
}
export default function VerifyPhonePage() {
    return (
        <VerifyPhoneClientPage />
    );
}
