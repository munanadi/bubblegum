import { useAppState } from "@/store/AppState";
import { FC, ReactNode, useRef, useState } from "react";

const Profile: FC<{ children: ReactNode }> = ({ children }) => {
    const wallet = useAppState(state => state.wallet);

    const userPDA = useAppState(state => state.userPDA);
    const profilePDA = useAppState(state => state.profilePDA);

    const publickey = wallet?.publicKey;

    const showInput = publickey && profilePDA && userPDA;

    const handleBubble = (e: any) => {
        e.preventDefault();
        console.log(text);
        console.log(imagesName);
        console.log(images);
    };

    const [text, setText] = useState("");
    const [images, setImages] = useState<any[]>([]);
    const [imagesName, setImagesNames] = useState<any[]>([]);
    const inputRef = useRef<any>(null);

    function handleDrop(event: any) {
        event.preventDefault();
        const files = event.dataTransfer.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(file);
            setImagesNames([...imagesName, file.name]);
            if (file.type.includes("image")) {
                const reader = new FileReader();
                reader.onload = function () {
                    setImages([...images, reader.result?.toString()]);
                };
                reader.readAsDataURL(file);
            }
        }

        console.log("Uploaded", images);
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
                                    <img
                                        src={image}
                                        alt={`Uploaded file ${index}`}
                                        key={index}
                                        className="max-w-full h-auto mb-4 mr-4"
                                    />
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
