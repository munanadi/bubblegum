import { ReactNode, FC, HTMLInputTypeAttribute } from "react";

interface InputFieldProps {
    children?: ReactNode;
    type: HTMLInputTypeAttribute;
    htmlFor?: string;
    label: string;
    placeHolder?: string;
    rows?: number;
}

const InputField: FC<InputFieldProps> = ({
    children,
    type,
    htmlFor,
    label,
    placeHolder,
}) => {
    return (
        <div className="my-2">
            <label
                htmlFor={htmlFor}
                className="block text-sm font-medium text-neutral-600"
            >
                {label}
            </label>
            <div className="mt-1">
                <input
                    id={htmlFor}
                    name={htmlFor}
                    type={type}
                    placeholder={placeHolder}
                    className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300  border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                />
            </div>
        </div>
    );
};

export default InputField;
