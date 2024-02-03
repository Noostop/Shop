import {useState, useEffect} from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Button} from '@/components/ui/button';
import {Bars3Icon} from '@heroicons/react/24/outline';
import {Logo} from '~/components/Logo';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isTablet,
  isMobile,
} from 'react-device-detect';
import {CountrySelector} from '~/components/CountrySelector';
import {Link} from '~/components/Link';

export function MobileMenuAside({menu}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isTablet || isMobile) {
      setShow(true);
    }
  }, []);

  return (
    show && (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="px-2">
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-11/12 md:w-[400px]">
          <SheetHeader className="sticky top-0 z-10 bg-white">
            <SheetTitle className="flex items-center px-4 border-b border-gray-200 h-14">
              <Logo className="w-auto h-6" />
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[100vh] pb-28">
            <Accordion type="multiple">
              {menu.items.map((item) => {
                if (!item.url) return null;

                // 如果 url 是内部的，我们会删除域名
                // const url =
                //   item.url.includes('myshopify.com') ||
                //   item.url.includes(publicStoreDomain) ||
                //   item.url.includes(primaryDomainUrl)
                //     ? new URL(item.url).pathname
                //     : item.url;
                return (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="px-4 hover:no-underline hover:text-parimary">
                      {item.title}
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="container">
                        <ul className="grid gap-3 py-6 px-4 bg-gray-100 rounded-lg w-full lg:grid-cols-[.75fr_1fr]">
                          <li className="row-span-3">
                            <div>
                              <Link
                                className="text-sm font-semibold leading-6 text-primary"
                                key={item.id}
                                prefetch="intent"
                                // style={activeLinkStyle}
                                reloadDocument
                                to={item.to}
                              >
                                {item.title}
                              </Link>
                            </div>
                          </li>
                          <li>
                            Re-usable components built using Radix UI and
                            Tailwind CSS.
                          </li>
                          <li>
                            How to install dependencies and structure your app.
                          </li>
                          <li>Styles for headings, paragraphs, lists...etc</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </ScrollArea>
          <SheetFooter className="sticky bottom-0 z-10 bg-white border-t border-gray-200 h-14">
            <div className="flex items-center h-full px-4">
              <CountrySelector />
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  );
}
