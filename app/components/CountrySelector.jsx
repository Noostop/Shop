import {useEffect, useState} from 'react';
import {Form, useMatches} from '@remix-run/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {AnimatePresence} from 'framer-motion';
import {isMobileDevice} from '~/lib/utils';
import {areas, countries} from '~/data/countries';
import {useI18n} from 'remix-i18n';

export function CountrySelector() {
  const [root] = useMatches();

  const {t} = useI18n();
  const selectedLocale = root?.data?.selectedLocale || {};
  const [open, setOpen] = useState(false);
  // const [countries, setCountries] = useState({});
  // const [areas, setAreas] = useState([]); // ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania', 'Antarctica']
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">
            {selectedLocale.countryText}/{selectedLocale.langText}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="top-0 mt-9">
          <DrawerHeader>
            <DrawerTitle>{t('localization.country_label')}</DrawerTitle>
          </DrawerHeader>
          <AnimatePresence>
            {open && (
              <ScrollArea className="flex-1">
                <div className="grid gap-4 px-4 py-4">
                  {areas?.map((area) => {
                    return (
                      <div
                        key={area.name}
                        className="flex flex-col gap-6 pb-4 border-b border-gray-200 last:border-b-0"
                      >
                        <h3 className="sticky top-0 py-2 text-lg font-semibold bg-white">
                          {t(`localization.areas.${area.name}`)}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {area?.countries.map((countryKey) => {
                            const locale = countries[countryKey];

                            if (!locale) return null;

                            const hreflang = `${locale.language}-${locale.country}`;

                            return (
                              <Form
                                method="post"
                                action={`/api/locale`}
                                key={hreflang}
                                className="col-span-1"
                              >
                                <input
                                  type="hidden"
                                  name="language"
                                  value={locale.language}
                                />
                                <input
                                  type="hidden"
                                  name="country"
                                  value={locale.country}
                                />
                                <input
                                  type="hidden"
                                  name="path"
                                  value={`${locale.pathPrefix}`}
                                />
                                <Button
                                  type="submit"
                                  variant="secondary"
                                  className="flex justify-between w-full"
                                >
                                  <span>{locale.countryText}</span>
                                  <span className="text-sm text-gray-600">
                                    {locale.langText}
                                  </span>
                                </Button>
                              </Form>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </AnimatePresence>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {selectedLocale.countryText}/{selectedLocale.langText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('localization.country_label')}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="mt-4 max-h-drawer-sm">
          <div className="grid gap-4">
            {areas?.map((area) => {
              return (
                <div
                  key={area.name}
                  className="flex flex-col gap-6 pb-4 border-b border-gray-200 last:border-b-0"
                >
                  <h3 className="py-2 text-lg font-semibold">
                    {t(`localization.areas.${area.name}`)}
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {area?.countries.map((countryKey) => {
                      const locale = countries[countryKey];
                      const hreflang = `${locale?.language}-${locale?.country}`;

                      if (!locale) return null;

                      return (
                        <Form
                          method="post"
                          action={`/api/locale`}
                          key={hreflang}
                          className="col-span-1"
                        >
                          <input
                            type="hidden"
                            name="language"
                            value={locale.language}
                          />
                          <input
                            type="hidden"
                            name="country"
                            value={locale.country}
                          />
                          <input
                            type="hidden"
                            name="path"
                            value={`${locale.pathPrefix}`}
                          />
                          <Button
                            type="submit"
                            variant="secondary"
                            className="flex justify-between w-full"
                          >
                            <span>{locale.countryText}</span>
                            <span className="text-sm text-gray-600">
                              {locale.langText}
                            </span>
                          </Button>
                        </Form>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
