import InputField from "@/components/InputField";
import { getShortAddress } from "@/helpers/stuff";
import { useGumStuff } from "@/hooks/useGumStuff";
import { useAppState } from "@/store/AppState";

import * as z from "zod";
import { Form, useZodForm } from "@/components/Form";
import { ChangeEvent, useEffect, useState } from "react";
import ChooseFile from "@/components/ChooseFile";
import { useShadowDrive } from "@/hooks/useShadowDrive";

const Create = () => {
    const [fileUrl, setFileUrl] = useState<string>();
    const [fileName, setFileName] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const userPDA = useAppState(state => state.userPDA);
    const profilePDA = useAppState(state => state.profilePDA);
    const wallet = useAppState(state => state.wallet);
    const connection = useAppState(state => state.connection);
    const setStroageAccount = useAppState(state => state.setStroageAccount);

    const { getOrCreateUser, getOrCreateProfile } = useGumStuff();
    const { drive, getOrCreateStorageAccountByName } = useShadowDrive(
        wallet,
        connection
    );

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

    const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(false);
        const file = event.target.files?.[0];
        const fileName = file?.name;

        // TODO: Definitely need a better name for the buckert
        let storageAccount;

        storageAccount = await getOrCreateStorageAccountByName("firstBucket");

        if (!file || !drive || !storageAccount?.publicKey) {
            return;
        }

        let response;
        try {
            response = await drive.uploadFile(storageAccount.publicKey, file);
        } catch (e) {
            console.log(e);
            setError(true);
            setLoading(false);
            return;
        }
        console.log({ response });

        if (response.upload_errors.length !== 0) {
            setLoading(false);
            setError(true);
        }

        if (response.finalized_locations[0]) {
            setLoading(false);
            setFileUrl(response.finalized_locations[0]);
            setFileName(fileName);
        }

        // Clear input
        (event.target as HTMLInputElement).value = "";
        setLoading(false); // This should not happen though
        setStroageAccount(storageAccount);
    };

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

                <ChooseFile
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleUpload(event)
                    }
                    loading={loading}
                    error={error}
                    fileName={fileName}
                    fileUrl={fileUrl}
                />

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
