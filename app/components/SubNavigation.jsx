import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Link} from '~/components/Link';
import {isMobileDevice} from '~/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {ChevronDownIcon} from '@heroicons/react/24/solid';
import {ScrollArea} from '@radix-ui/react-scroll-area';

export function SubNavigation({
  title,
  handle,
  navBars: {navs, actions},
  className,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  if (isMobile) {
    return (
      <nav className="sticky top-0 z-[4] w-full text-white bg-black/80 backdrop-blur -mb-14 h-16">
        <div className="container">
          <div className="flex items-center justify-between gap-2 py-4">
            <h2 className="flex items-center gap-2 basis-3/5">
              <Link
                to={handle}
                className="text-sm font-semibold leading-4 line-clamp-2"
                reloadDocument
              >
                {title}
              </Link>
              <DropdownMenu side="top">
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent hover:text-transparent"
                  >
                    <span className="sr-only">Open {title}</span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  sideOffset={12}
                  className="w-screen text-white bg-black border-none rounded-none"
                >
                  <div className="container">
                    {navs?.map(({id, title, url}) => (
                      <DropdownMenuItem key={id} asChild>
                        <Link to={url} reloadDocument>
                          {title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </h2>

            <div className="flex items-center justify-end ml-auto gap-x-2">
              {actions?.map(({id, title, url, type}) =>
                type === 'buy' ? (
                  <Button size="sm" key={id} asChild>
                    <Link to={url}>{title}</Link>
                  </Button>
                ) : (
                  <Button
                    key={id}
                    size="sm"
                    asChild
                    variant="outline"
                    className="text-black"
                  >
                    <Link to={url}>{title}</Link>
                  </Button>
                ),
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-[4] w-full text-white bg-black/80 backdrop-blur -mb-14">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between lg:flex-nowrap">
          <div className="flex items-center flex-shrink-0 h-14">
            <h2 className="text-lg font-semibold">
              <Link to={handle} reloadDocument>
                {title}
              </Link>
            </h2>
          </div>

          <div className="flex-row order-2 w-full text-sm font-medium lg:flex-1 lg:ml-auto md:flex md:order-2">
            <ScrollArea className="w-full">
              <ul className="flex justify-end w-full text-sm font-medium">
                {navs?.map(({id, title, url}) => (
                  <li key={id}>
                    <Link
                      to={url}
                      className="flex-1 block px-4 py-3 rounded-lg hover:text-gray-300"
                      reloadDocument
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>

          <div className="flex items-center order-2 gap-2 ml-8 lg:order-3">
            {actions?.map(({id, title, url, type}) =>
              type === 'buy' ? (
                <Button size="sm" key={id} asChild>
                  <Link to={url} reloadDocument>
                    {title}
                  </Link>
                </Button>
              ) : (
                <Button
                  key={id}
                  size="sm"
                  asChild
                  variant="outline"
                  className="text-black"
                >
                  <Link to={url} reloadDocument>
                    {title}
                  </Link>
                </Button>
              ),
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
