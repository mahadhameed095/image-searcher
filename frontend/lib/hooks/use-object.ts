import { useState } from "react";

export default function useObject<T extends Record<string, any>>(initialState : T){
    const [object, setObject] = useState<T>(initialState);
    const update = (partial : Partial<T>) => {
        const newObject = {
            ...object,
            ...partial
        };
        setObject(newObject);
        return newObject;
    };

    return [object, update] as const;
}