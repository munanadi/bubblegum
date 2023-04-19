import { ReactNode, FC } from "react";

interface Props {
    [key: string]: any;
}
const Spinner: FC<Props> = props => {
    let classname =
        "animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-gray-600 rounded-full";
    classname += " " + props.className;

    return (
        <div className={classname} role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;
