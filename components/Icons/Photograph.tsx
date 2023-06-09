import { FC } from "react";

interface Props {
    [key: string]: any;
}

const Photograph: FC<Props> = props => {
    return (
        <div {...props}>
            <svg
                fill="#000000"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
            >
                <g>
                    <g>
                        <g>
                            <path
                                d="M501.551,36.571h-41.796V10.449C459.755,4.678,455.077,0,449.306,0H10.449C4.678,0,0,4.678,0,10.449v429.143
       c0,5.771,4.678,10.449,10.449,10.449h52.245v51.51c0,5.771,4.678,10.449,10.449,10.449h428.408
       c5.771,0,10.449-4.678,10.449-10.449V47.02C512,41.249,507.322,36.571,501.551,36.571z M20.898,20.898h417.959v160.139
       l-52.516-28.278c-3.175-1.709-7.007-1.661-10.139,0.128l-66.456,37.975l-128.043-54.198c-3.285-1.39-7.052-1.008-9.992,1.011
       l-114,78.368l-36.814,25.316V20.898z M438.857,204.772v40.689l-104.904-44.362l47.585-27.191L438.857,204.772z M20.898,266.721
       l45.981-31.619h6.264c20.62,0,30.262,4.407,41.427,9.512C126.245,249.951,139.477,256,164.571,256
       c25.094,0,38.327-6.049,50-11.386c11.166-5.104,20.808-9.512,41.428-9.512v-20.898c-25.171,0-38.424,6.058-50.115,11.404
       c-11.145,5.094-20.769,9.494-41.313,9.494c-20.544,0-30.168-4.4-41.313-9.494c-7.798-3.565-16.295-7.445-28.554-9.635
       l84.128-57.833l127.536,53.984l132.489,56.027v76.665H20.898V266.721z M20.898,429.143v-63.428h417.959v63.428H20.898z
        M491.102,491.102H83.592v-41.061h365.714c5.771,0,10.449-4.678,10.449-10.449V57.469h31.347V491.102z"
                            />
                            <rect
                                x="381.388"
                                y="386.612"
                                width="31.347"
                                height="20.898"
                            />
                            <rect
                                x="334.367"
                                y="386.612"
                                width="31.347"
                                height="20.898"
                            />
                            <rect
                                x="47.02"
                                y="386.612"
                                width="73.143"
                                height="20.898"
                            />
                            <path
                                d="M292.571,146.286c28.808,0,52.245-23.437,52.245-52.245c0-28.808-23.437-52.245-52.245-52.245
       c-28.808,0-52.245,23.437-52.245,52.245C240.327,122.849,263.764,146.286,292.571,146.286z M292.571,62.694
       c17.285,0,31.347,14.062,31.347,31.347c0,17.285-14.062,31.347-31.347,31.347c-17.285,0-31.347-14.062-31.347-31.347
       C261.224,76.756,275.287,62.694,292.571,62.694z"
                            />
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default Photograph;
