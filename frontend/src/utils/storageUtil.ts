class StorageUtil {
    static setItem(key: string, value: any) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    static getItem(key: string) {
        const value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    static removeItem(key: string) {
        sessionStorage.removeItem(key);
    }

    static clear() {
        sessionStorage.clear();
    }
}

export default StorageUtil;
