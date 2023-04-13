import { ReactNode, FC, HTMLInputTypeAttribute, forwardRef } from "react";
import { useFormContext } from "react-hook-form";

interface InputFieldProps {
    children?: ReactNode;
    type: HTMLInputTypeAttribute;
    label: string;
    placeHolder?: string;
    rows?: number;
    props?: any;
    name: string;
}

interface FieldErrorProps {
    name?: string;
}

export const FieldError: FC<FieldErrorProps> = ({ name }) => {
    const {
        formState: { errors },
    } = useFormContext();

    if (!name) {
        return null;
    }

    const error = errors[name];

    if (!error) {
        return null;
    }

    return (
        <div className="mt-1 text-sm font-bold text-red-500">
            {error.message as any}
        </div>
    );
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function Input(
    { children, type, name, label, placeHolder, ...props },
    ref
) {
    return (
        <div className="my-2">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-neutral-600"
            >
                {label}
            </label>
            <div className="mt-1">
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeHolder}
                    {...props}
                    ref={ref}
                    className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300  border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                />
            </div>
            {name && <FieldError name={name} />}
        </div>
    );
});

export default InputField;
