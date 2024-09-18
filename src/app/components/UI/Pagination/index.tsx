import { Button } from "@/app/components/UI/ButtonComponent";
import IconComponent from "@/app/components/UI/IconComponent";

interface IPaginationProps {
    currentPage: number;
    totalPage: number;
    onPageChange: (page: number) => void;
}

const PaginationComponent = ({ currentPage, totalPage, onPageChange }: IPaginationProps): JSX.Element => {
    const getPagination = (): (number | string)[] => {
        const pagination: (number | string)[] = [];
        const maxPagesToShow = 3;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(
            totalPage,
            currentPage + Math.floor(maxPagesToShow / 2)
        );

        if (endPage - startPage + 1 < maxPagesToShow) {
            if (currentPage < Math.ceil(maxPagesToShow / 2)) {
                endPage = Math.min(maxPagesToShow, totalPage);
            } else if (currentPage > totalPage - Math.floor(maxPagesToShow / 2)) {
                startPage = Math.max(totalPage - maxPagesToShow + 1, 1);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pagination.push(i);
        }

        if (startPage > 1) {
            pagination.unshift("...");
            pagination.unshift(1);
        }

        if (endPage < totalPage) {
            pagination.push("...");
            pagination.push(totalPage);
        }

        return pagination;
    };

    const pagination = getPagination();

    return (
        <nav className="flex justify-center md:justify-end mt-10 items-center space-x-2 px-6 md:px-0">
            <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                onClick={() => { onPageChange(currentPage - 1); }}
                disabled={currentPage === 1}
            >
                <IconComponent name="CaretLeft" color="" />
            </button>
            {pagination.map((page, index) => {
                return typeof page === "number" ? (
                    <Button
                        key={index}
                        className={`px-4 py-2 rounded ${currentPage === page
                            ? "bg-primary text-white"
                            : "bg-white text-black"
                            }`}
                        onClick={() => { onPageChange(page); }}
                    >
                        {page}
                    </Button>
                ) : (
                    <span key={index} className="px-2 py-2">
                        {page}
                    </span>
                )
            }
            )}
            <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                onClick={() => { onPageChange(currentPage + 1); }}
                disabled={currentPage === totalPage}
            >
                <IconComponent name="CaretRight" color="" />
            </button>
        </nav>
    );
};

export default PaginationComponent;
