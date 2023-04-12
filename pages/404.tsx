import Link from "next/link";
import type { FC } from "react";

const Custom404: FC = () => {
    return (
        <div className="page-center flex-col">
            <div className="py-10 text-center">
                <h1 className="mb-4 text-3xl font-bold">Lost?</h1>
                <div className="mb-4">This page could not be found</div>
                <Link href="/">
                    <button className="item-center mx-auto flex bg-black text-gray-300 p-4 rounded-md hover:bg-gray-700 hover:text-white">
                        Go to home
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Custom404;
