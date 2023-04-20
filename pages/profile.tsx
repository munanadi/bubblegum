import Photograph from "@/components/Icons/Photograph";
import Spinner from "@/components/Spinner";
import { useShadowDrive } from "@/hooks/useShadowDrive";
import { useAppState } from "@/store/AppState";
import { FC, ReactNode, useRef, useState } from "react";
import { PostMetadata } from "@gumhq/sdk";

const Profile: FC<{ children: ReactNode }> = ({ children }) => {
    const wallet = useAppState(state => state.wallet);
    const connection = useAppState(state => state.connection);

    const userPDA = useAppState(state => state.userPDA);
    const profilePDA = useAppState(state => state.profilePDA);
    const sdk = useAppState(state => state.gumSdk);

    const { drive, getOrCreateStorageAccountByName } = useShadowDrive(
        wallet,
        connection
    );

    const publickey = wallet?.publicKey;

    const showInput = publickey && profilePDA && userPDA;

    const handleBubble = async (e: any) => {
        e.preventDefault();

        let storageAccount;

        storageAccount = await getOrCreateStorageAccountByName("gum_bucket");

        if (
            !drive ||
            !storageAccount?.publicKey ||
            !publickey ||
            !sdk ||
            !profilePDA ||
            !userPDA
        ) {
            return;
        }

        let response;
        // 1. Images need to be uploaded whatever is attached
        for (const file of uploadedFiles) {
            try {
                response = await drive.uploadMultipleFiles(
                    storageAccount.publicKey,
                    uploadedFiles
                );

                for (const res of response) {
                    uploadedFilesUrl.push(res.location);
                }
            } catch (e) {
                console.log(e);
                alert("Uploading files failed");
                return;
            } finally {
                alert("Uploaded all files");
                console.log(
                    `Uploaded all files ${uploadedFilesUrl.toString()}`
                );
            }
        }

        const time = new Date().getTime().toString();
        const identifier = publickey.toString() + "_" + time;
        const fileName = publickey.toString() + "_" + time + ".txt";

        // 2. The text along with its media should be uploaded in a file say unix timestamp_username
        const media_data = uploadedFilesUrl.map(
            (url, index) => `${index}_${identifier}_${url}`
        );

        const fileData = new PostMetadata({
            authorship: {
                publicKey: publickey.toString(),
                signature: "IDK",
            },
            content: { content: "", format: "markdown" },
            type: "text",
        });

        console.log(fileData);

        // Check if profile PDA exists, Create one if not
        // Construct the file to upload
        let file = new File([JSON.stringify(fileData)], fileName, {
            type: "plain/text",
        });

        const upload = await drive.uploadFile(storageAccount.publicKey, file);

        let metadataUri = new URL(upload.finalized_locations[0]).toString();

        console.log(metadataUri);

        // Call the create post thing now.

        const data = await sdk.post.create(
            metadataUri,
            profilePDA,
            userPDA,
            publickey
        );

        const postPDA = data.postPDA;
        console.log(postPDA.toString(), " is the post PDA that was created");

        const res = await data.instructionMethodBuilder.rpc();
        console.log(res);

        alert(res);
    };

    const [text, setText] = useState("");
    const [images, setImages] = useState<any[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const uploadedFilesUrl: string[] = [];

    const inputRef = useRef<any>(null);

    function handleDrop(event: any) {
        event.preventDefault();
        let files;
        if (event.dataTransfer) {
            files = event.dataTransfer.files;
        }
        files = event.target.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setUploadedFiles(uploadedFiles => [...uploadedFiles, file]);
            if (file.type.includes("image")) {
                const reader = new FileReader();
                reader.onload = function () {
                    setImages(images => [...images, reader.result?.toString()]);
                };
                reader.readAsDataURL(file);
            }
        }
    }

    function handleTextChange(event: any) {
        setText(event.target.value);
    }

    return (
        <>
            <div className="bg-white p-3 w-full">
                <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                    {!publickey && `Please Connect your Wallet`}
                    {publickey &&
                        (!profilePDA || !userPDA) &&
                        `Head to create profile to create profile`}
                </h1>
                {showInput && (
                    <>
                        <div
                            className="border-dashed border-2 border-gray-300 p-6"
                            onDrop={handleDrop}
                            onClick={() => {
                                if (inputRef.current) {
                                    inputRef.current.focus();
                                }
                            }}
                        >
                            <textarea
                                className="w-full p-2 mb-4 border-0"
                                value={text}
                                ref={inputRef}
                                onChange={handleTextChange}
                            />
                            <div className="flex flex-wrap">
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative self-start"
                                    >
                                        <div
                                            className="absolute left-1 top-1 cursor-pointer m-0.5 p-0.5 
                                                border-1 rounded-md bg-black text-sm text-white opacity-50"
                                            onClick={e => {
                                                e.stopPropagation();

                                                console.log(
                                                    "This should delete the file or stop uploading"
                                                );
                                            }}
                                        >
                                            X
                                        </div>
                                        <img
                                            src={image}
                                            className="max-w-sm h-auto m-1 border-black border-2"
                                        />
                                        {/* Success - Check for the uploaded URL and show this */}
                                        <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700 absolute bottom-1 left-1 opacity-70">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                className="-ms-1 me-1.5 h-4 w-4"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>

                                            <p className="whitespace-nowrap text-sm">
                                                Uploaded
                                            </p>
                                        </span>

                                        {/* Loading - Show spinner when media is uploaded */}
                                        <span className="inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-700 absolute bottom-1 left-1 opacity-70">
                                            <Spinner className="bg-amber-100 text-amber-600" />

                                            <p className="whitespace-nowrap text-sm">
                                                Loading
                                            </p>
                                        </span>

                                        {/* Error - Shown when upload fails for some reason */}
                                        <span className="inline-flex items-center justify-center rounded-full bg-red-100 px-2.5 py-0.5 text-red-700 absolute bottom-1 left-1 opacity-70">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                className="-ms-1 me-1.5 h-4 w-4"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                                />
                                            </svg>

                                            <p className="whitespace-nowrap text-sm">
                                                Failed
                                            </p>
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10">
                                <label>
                                    <Photograph className="w-6 cursor-pointer" />
                                    <input
                                        className="hidden"
                                        type="file"
                                        multiple
                                        onInputCapture={handleDrop}
                                    />
                                </label>
                            </div>
                        </div>

                        <button
                            className="m-2 p-0.5 border-black border-2 rounded-md"
                            type="submit"
                            onClick={handleBubble}
                        >
                            Bubble
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default Profile;
