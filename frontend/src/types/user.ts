interface User {
    id?: number;
    username: string;
    password: string;
    role: string;
}

interface UserRequest {
    username: string;
    password: string;
    role: string;
}

export type { User, UserRequest };
