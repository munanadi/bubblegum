import { ReactNode, FC, ChangeEvent } from "react";
import Spinner from "../Spinner";

// TODO: Figure out to make this more intuative
interface ChooseFileProps {
    children?: ReactNode;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    fileUrl: string | undefined;
    error: boolean;
    fileName: string | undefined;
}
const ChooseFile: FC<ChooseFileProps> = ({
    children,
    onChange,
    loading,
    fileUrl,
    fileName,
    error,
}) => {
    return (
        <div className="flex flex-col w-full h-full p-1 overflow-auto">
            <div className="flex justify-between overflow-clip">
                <div className="space-y-2">
                    <label
                        htmlFor="avatar"
                        className="block text-sm font-medium text-neutral-600"
                    >
                        Upload your avatar
                    </label>

                    <input
                        id="avatar"
                        name="avatar"
                        type="file"
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-500 file:text-white
                          hover:file:bg-blue-600"
                        onChange={onChange}
                        onClick={event => {
                            (event.target as HTMLInputElement).value = "";
                        }}
                    />
                </div>

                {loading && <Spinner />}
            </div>

            {/* Success alert */}
            {fileUrl && fileName && (
                <div className="flex justify-between bg-green-50 border border-green-200 rounded-md p-4 mt-2">
                    <div className="flex">
                        <svg
                            className="h-4 w-4 text-green-400 mt-0.5"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                        </svg>
                        <div className="ml-3">
                            <div className="text-sm text-green-800 font-medium">
                                {fileName} has been successfully uploaded.
                            </div>
                        </div>
                    </div>
                    <a href={fileUrl} target="_blank">
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-800"
                            >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </div>
                    </a>
                </div>
            )}

            {/* Failure Alert */}
            {error && (
                <div className="flex bg-red-50 border border-red-200 rounded-md p-4 mt-2 ">
                    <svg
                        className="h-4 w-4 text-red-400 mt-0.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                    </svg>

                    <div className="ml-4">
                        <h3 className="text-sm text-red-800 font-semibold">
                            File upload failed, try again
                        </h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChooseFile;
