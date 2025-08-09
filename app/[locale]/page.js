import { getTranslations } from 'next-intl/server';
import HomePage from './home/page';
import { createPageMetadata } from '@/utils/metadata';

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'companies');
}
export default function Page() {
    return <HomePage />;
}
