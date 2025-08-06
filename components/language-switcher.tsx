'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Switch } from '@/components/ui/switch';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (checked: boolean) => {
    const newLocale = checked ? 'id' : 'en';
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-medium transition-colors ${
        locale === 'en' ? 'text-primary' : 'text-muted-foreground'
      }`}>
        EN
      </span>
      <Switch
        checked={locale === 'id'}
        onCheckedChange={handleLanguageChange}
        className="data-[state=checked]:bg-primary"
      />
      <span className={`text-sm font-medium transition-colors ${
        locale === 'id' ? 'text-primary' : 'text-muted-foreground'
      }`}>
        ID
      </span>
    </div>
  );
}