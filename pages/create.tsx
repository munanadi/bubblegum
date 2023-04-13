import InputField from "@/components/InputField";
import { getShortAddress } from "@/helpers/stuff";
import { useGumStuff } from "@/hooks/useGumStuff";
import { useAppState } from "@/store/AppState";

import * as z from "zod";
import { Form, useZodForm } from "@/components/Form";

const Create = () => {
    const userPDA = useAppState(state => state.userPDA);
    const profilePDA = useAppState(state => state.profilePDA);

    const { getOrCreateUser, getOrCreateProfile } = useGumStuff();

    const schema = z.object({
        name: z.string().min(3, { message: "min of 3 character" }),
        username: z.string().min(3, { message: "min of 3 character" }),
        bio: z.string().min(10, { message: "min of 10 character" }),
    });

    const form = useZodForm({
        schema: schema,
        defaultValues: {
            name: "",
            username: "",
            bio: "",
        },
    });

    return (
        <>
            <div className="max-w-lg mt-4 mx-auto flex items-end justify-between bg-white">
                <div className="rounded-lg border border-gray-100 p-2">
                    <p className="text-sm text-gray-500">user PDA</p>

                    <p className="text-2xl font-medium text-gray-900">
                        {userPDA
                            ? getShortAddress(userPDA)
                            : "No user profile found"}
                    </p>

                    {userPDA ? (
                        <div className="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
                            <span className="text-xs font-medium">Present</span>
                        </div>
                    ) : (
                        <div className="inline-flex gap-2 rounded bg-red-100 p-1 text-red-600">
                            <span className="text-xs font-medium">
                                Not Present
                            </span>
                        </div>
                    )}
                </div>

                <div className="rounded-lg border border-gray-100 p-2">
                    <p className="text-sm text-gray-500">profile PDA</p>

                    <p className="text-2xl font-medium text-gray-900">
                        {profilePDA
                            ? getShortAddress(profilePDA)
                            : "No user profile found"}
                    </p>

                    {profilePDA ? (
                        <div className="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
                            <span className="text-xs font-medium">Present</span>
                        </div>
                    ) : (
                        <div className="inline-flex gap-2 rounded bg-red-100 p-1 text-red-600">
                            <span className="text-xs font-medium">
                                Not Present
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <Form
                form={form}
                className="page-center flex-col rounded-lg max-w-lg mx-auto mt-6"
                onSubmit={({ name, username, bio }) => {
                    console.log(name, username, bio);
                }}
            >
                <InputField
                    type="text"
                    label="Name"
                    placeHolder="Enter Name"
                    {...form.register("name")}
                ></InputField>

                <InputField
                    type="text"
                    label="Username"
                    placeHolder="Enter Username"
                    {...form.register("username")}
                ></InputField>

                <InputField
                    type="textarea"
                    label="Bio"
                    placeHolder="Enter Bio"
                    {...form.register("bio")}
                ></InputField>

                {/* <div className="flex flex-col w-full h-full p-1 overflow-auto">
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
                </div> */}

                <button
                    type="submit"
                    className="flex mt-4 items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white  bg-gray-600 rounded-xl hover:bg-gray-700 "
                >
                    Create User
                </button>
            </Form>
        </>
    );
};

export default Create;
