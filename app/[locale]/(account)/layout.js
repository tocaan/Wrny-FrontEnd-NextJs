import Layout from "@/components/layouts/Layout";
export const dynamic = "force-dynamic";

export default function AccountLayout({ children }) {
    return (
        <Layout>
            {children}
        </Layout>
    );
}
