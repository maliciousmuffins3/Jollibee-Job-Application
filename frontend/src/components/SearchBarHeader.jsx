import { Filter } from "lucide-react";

function SearchBarHeader({ children }) {
    return (
        <div className="px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex flex-wrap items-center gap-4">
                {/* Search Bar & Filter Icon (Left Aligned) */}
                <div className="flex items-center gap-2 flex-nowrap">
                    <label className="input flex items-center w-auto max-w-xs min-w-[150px]">
                        <svg
                            className="h-5 opacity-50 shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input
                            type="search"
                            className="ml-2 w-auto max-w-[180px] sm:max-w-xs border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-transparent"
                            placeholder="Search"
                        />
                    </label>
                    <Filter className="cursor-pointer shrink-0 text-gray-600 hover:text-gray-900 transition duration-200" />
                </div>

                {/* Children (Responsive Alignment) */}
                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto ml-0 sm:ml-auto mt-10 md:mt-0">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default SearchBarHeader;
