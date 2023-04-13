import InputField from "@/components/InputField";

const Create = () => {
    return (
        <div className="page-center flex-col rounded-lg max-w-lg mx-auto mt-6">
            <InputField
                type="text"
                label="Name"
                placeHolder="Enter Name"
            ></InputField>
            <InputField
                type="text"
                label="Username"
                placeHolder="Enter Username"
            ></InputField>
            <InputField
                type="textarea"
                label="Bio"
                placeHolder="Enter Bio"
            ></InputField>
            <div className="flex flex-col w-full h-full p-1 overflow-auto">
                <label
                    htmlFor="avatar"
                    className="block text-sm font-medium text-neutral-600"
                >
                    Upload your avatar
                </label>
                <div className="flex flex-col items-center justify-center py-6 text-base bg-white border border-dashed rounded-lg text-gray-500 mt-2 focus:border-gray-500 focus:outline-none ">
                    <button className="w-auto my-2 py-2 px-1 border rounded-md text-gray-500 hover:text-gray-600 text-md hover:bg-gray-100">
                        Upload a file
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="flex mt-4 items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white  bg-gray-600 rounded-xl hover:bg-gray-700 "
            >
                Create User
            </button>
        </div>
    );
};

export default Create;
