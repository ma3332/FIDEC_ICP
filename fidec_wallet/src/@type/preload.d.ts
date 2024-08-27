import {api} from "../../process/electron/preload"

declare global {
    interface Window {
        Main: typeof api;
    }
}