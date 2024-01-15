import {useEffect, useState} from 'react';
import {Form, useMatches, useLocation, useFetcher} from '@remix-run/react';
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

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

export function CountrySelector() {
  const [root] = useMatches();
  const selectedLocale = root.data.selectedLocale;

  const {pathname, search} = useLocation();
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Get available countries list
  const fetcher = useFetcher();
  useEffect(() => {
    if (!fetcher.data) {
      fetcher.load('/api/countries');
      return;
    }
    setCountries(fetcher.data);
  }, [countries, fetcher.data]);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const strippedPathname = pathname?.replace(selectedLocale?.pathPrefix, '');

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">
            {selectedLocale.countryText} - {selectedLocale.langText}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="top-0">
          <DrawerHeader className="text-left">
            <DrawerTitle>选择您的国家/地区</DrawerTitle>
          </DrawerHeader>
          <AnimatePresence>
            {open && (
              <ScrollArea className="flex-1">
                <div className="grid gap-4 px-4 py-4">
                  {countries &&
                    Object.keys(countries).map((countryKey) => {
                      const locale = countries[countryKey];
                      const hreflang = `${locale.language}-${locale.country}`;

                      return (
                        <Form method="post" action="/locale" key={hreflang}>
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
                            value={`${strippedPathname}${search}`}
                          />
                          <Button type="submit">
                            {locale.countryText} - {locale.langText}
                          </Button>
                        </Form>
                      );
                    })}
                </div>

                <div className="h-screen bg-pink-600"></div>
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
          {selectedLocale.countryText} - {selectedLocale.langText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>选择您的国家/地区</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-drawer-sm">
          <div className="grid gap-4 px-4 py-4">
            {Object.keys(countries).map((countryKey) => {
              const locale = countries[countryKey];
              const hreflang = `${locale.language}-${locale.country}`;

              return (
                <Form method="post" action="/locale" key={hreflang}>
                  <input
                    type="hidden"
                    name="language"
                    value={locale.language}
                  />
                  <input type="hidden" name="country" value={locale.country} />
                  <input
                    type="hidden"
                    name="path"
                    value={`${strippedPathname}${search}`}
                  />
                  <Button type="submit">
                    {locale.countryText} - {locale.langText}
                  </Button>
                </Form>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
