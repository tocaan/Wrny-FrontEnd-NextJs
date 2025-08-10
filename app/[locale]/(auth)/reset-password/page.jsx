import { createPageMetadata } from "@/utils/metadata";
import ResetClientPasswordPage from "./page.client";

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'reset_password');
}
export default function ResetPasswordPage() {
    return (
        <ResetClientPasswordPage />
    );
}
