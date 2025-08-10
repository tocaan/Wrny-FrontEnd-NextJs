import { createPageMetadata } from "@/utils/metadata";
import ForgotClientPage from "./page.client";

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'forgot_password');
}
export default function ForgotPage() {
    return (
        <ForgotClientPage />
    );
}
