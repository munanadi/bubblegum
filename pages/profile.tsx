import { useShadowDrive } from "@/hooks/useShadowDrive";
import { useAppState } from "@/store/AppState";
import { FC, ReactNode, useRef, useState } from "react";

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

        const fileData = {
            text_content: text,
            media_data,
        };

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
        const files = event.dataTransfer.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setUploadedFiles([...uploadedFiles, file]);
            if (file.type.includes("image")) {
                const reader = new FileReader();
                reader.onload = function () {
                    setImages([...images, reader.result?.toString()]);
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
                                    <div key={index}>
                                        <img
                                            src={image}
                                            className="max-w-full h-auto mb-4 mr-4"
                                        />
                                    </div>
                                ))}
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
