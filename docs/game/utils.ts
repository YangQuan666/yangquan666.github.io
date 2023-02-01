import { nextTick } from 'vue';

const getKey = (key: string) => `2048_GAME_${key}`;
export const useLocalStorage = () => {
    const getItem = (key: string): any => {
        const rawValue = window.localStorage.getItem(getKey(key));
        return rawValue ? JSON.parse(rawValue) : void 0;
    };

    const setItem = (key: string, value: unknown, sync?: boolean) => {
        const setter = () => {
            window.localStorage.setItem(getKey(key), JSON.stringify(value));
        };

        if (sync) {
            setter();
        } else {
            nextTick(setter);
        }
    };

    return { setItem, getItem };
};

let seed = 1;
export const uuid = () => {
    return seed++;
}
