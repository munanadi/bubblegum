// Copied from https://github.com/GenesysGo/shadow-drive/blob/main/src/utils/helpers.ts

export function humanSizeToBytes(input: string): number | boolean {
    const UNITS = ["kb", "mb", "gb"];
    let chunk_size = 0;
    let humanReadable = input.toLowerCase();
    let inputNumber = Number(humanReadable.slice(0, humanReadable.length - 2));
    let inputDescriptor = humanReadable.slice(
        humanReadable.length - 2,
        humanReadable.length
    );
    if (!UNITS.includes(inputDescriptor) || !inputNumber) {
        return false;
    }

    switch (inputDescriptor) {
        case "kb":
            chunk_size = 1_024;
            break;
        case "mb":
            chunk_size = 1_048_576;
            break;
        case "gb":
            chunk_size = 1_073_741_824;
            break;

        default:
            break;
    }

    return Math.ceil(inputNumber * chunk_size);
}

export function bytesToHuman(bytes: any, si = false, dp = 1) {
    const thresh = si ? 1024 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + " B";
    }

    const units = si
        ? ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (
        Math.round(Math.abs(bytes) * r) / r >= thresh &&
        u < units.length - 1
    );

    return bytes.toFixed(dp) + " " + units[u];
}
