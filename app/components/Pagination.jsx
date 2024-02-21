import clsx from 'clsx';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Link} from '~/components/Link';
import {ArrowLeftIcon, ArrowRightIcon} from '@heroicons/react/24/outline';

export const Paginations = ({totalItems, itemsPerPage, onPageChange}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i}>
          <Button
            className={clsx('h-6', i === currentPage ? 'bg-gray-200' : null)}
            size="icon"
            variant="ghost"
            disabled={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Button>
        </li>,
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex justify-center gap-2 mt-10">
      <Button
        className="h-6"
        size="icon"
        variant="outline"
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
      >
        <span className="sr-only">Previous</span>
        <ArrowLeftIcon className="w-4 h-4" />
      </Button>

      <ul className="flex gap-2">{renderPageNumbers()}</ul>

      <Button
        className="h-6"
        size="icon"
        variant="outline"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <span className="sr-only">Next</span>
        <ArrowRightIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};

export function Pagination({totalItems, page = 1, params}) {
  const {size, keyword, tagid} = params;
  const totalPages = totalItems;

  const [inputPage, setInputPage] = useState(page);

  const handleInputChange = (event) => {
    setInputPage(event.target.value);
  };

  const handlePageSubmit = (event) => {
    event.preventDefault();
    if (inputPage !== '' && inputPage > 0 && inputPage <= totalPages) {
      // 更新页面 URL，跳转到用户输入的页码
      return (
        <Link
          to={`/help?current=${inputPage}&tagID=${tagid}&key=${keyword}&size=${size}`}
        >
          Go
        </Link>
      );
    }
    return null;
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      // 更新页面 URL，切换到上一页
      return (
        <Button
          className="h-6"
          size="icon"
          variant="outline"
          // onClick={handlePreviousPage}
          // disabled={currentPage === 1}
          asChild
        >
          <Link
            to={`/help?current=${
              page - 1
            }&tagID=${tagid}&key=${keyword}&size=${size}`}
          >
            <span className="sr-only">Previous</span>
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
        </Button>
      );
    }
    return null;
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      // 更新页面 URL，切换到下一页
      return (
        <Button
          className="h-6"
          size="icon"
          variant="outline"
          // onClick={handlePreviousPage}
          // disabled={currentPage === 1}
          asChild
        >
          <Link
            to={`/help?current=${
              page + 1
            }&tagID=${tagid}&key=${keyword}&size=${size}`}
          >
            <span className="sr-only">Next</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="flex justify-center gap-2 mt-10">
      {/* 上一页按钮 */}
      {handlePreviousPage()}

      {/* 输入框 */}
      <form onSubmit={handlePageSubmit}>
        <input
          className="w-12 h-6 text-sm font-medium text-center transition-colors border rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background hover:bg-accent hover:text-accent-foreground"
          type="text"
          value={page}
          onChange={handleInputChange}
        />
      </form>

      {/* 下一页按钮 */}
      {handleNextPage()}
    </div>
  );
}
