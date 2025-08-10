import { createPageMetadata } from "@/utils/metadata";
import RegisterClientPage from "./page.client";

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'register');
}
export default function RegisterPage() {
    return (
        <RegisterClientPage />
    );
}
