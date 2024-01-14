import {useEffect, useState} from 'react';
import {Form, useMatches, useLocation, useFetcher} from '@remix-run/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';

export function CountrySelector() {
  const [root] = useMatches();
  const selectedLocale = root.data.selectedLocale;
  const {pathname, search} = useLocation();

  const [countries, setCountries] = useState({});

  // Get available countries list
  const fetcher = useFetcher();
  useEffect(() => {
    if (!fetcher.data) {
      fetcher.load('/api/countries');
      return;
    }
    setCountries(fetcher.data);
  }, [countries, fetcher.data]);

  const strippedPathname = pathname.replace(
    selectedLocale.pathPrefix !== '/' ? '/' + selectedLocale.pathPrefix : '/',
    '',
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{selectedLocale.label}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>选择您的国家/地区</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96">
          <div className="grid gap-4 py-4">
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
                      name="prefix"
                      value={locale.pathPrefix}
                    />
                    <input
                      type="hidden"
                      name="path"
                      value={`${strippedPathname}${search}`}
                    />
                    <button type="submit">{locale.label}</button>
                  </Form>
                );
              })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
