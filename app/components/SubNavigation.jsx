import {Button} from '@/components/ui/button';
import {Link} from '~/components/Link';

export function SubNavigation({title, nav, className, children}) {
  return (
    <nav className="sticky top-0 z-[4] w-full text-white bg-black/60 backdrop-blur -mb-14">
      <div className="container">
        <div className="flex items-center justify-between h-14">
          <div className="">
            <h2 className="text-lg font-semibold">
              <Link to="/ac180">{title}</Link>
            </h2>
          </div>

          <ul className="flex-col order-2 hidden text-sm font-medium border border-gray-200 rounded-lg md:ml-auto md:flex md:order-1 md:flex-row dark:bg-gray-800 dark:border-gray-700 dark:md:bg-gray-900 md:rounded-none md:border-0">
            {nav?.map(({id, title, url}) => (
              <li key={id}>
                <Link
                  to={url}
                  className="block px-4 py-3 rounded-lg hover:text-gray-300"
                  aria-current="page"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center order-1 ml-8 md:order-2">
            <Button size="sm">立即购买</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
