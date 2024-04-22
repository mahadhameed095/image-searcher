import { useState } from "react";

export default function useSelect<T>(){
    const [selected, setSelected] = useState<T[]>([]);

    const select = (...items : T[]) => {
        setSelected(prev => [...new Set([...prev, ...items])]);
    }

    const unSelect = (...items : T[]) => {
        setSelected(prev => prev.filter(item => !items.includes(item)))
    }

    const toggle = (...items : T[]) => {
        setSelected(prev => {
            const toBeAdded = items.filter(item => !prev.includes(item));
            const toBeRemoved = items.filter(item => prev.includes(item));
            const newSelection = [...prev.filter(item => !toBeRemoved.includes(item)), ...toBeAdded]; 
            // console.log({prev, items, toBeAdded, toBeRemoved, newSelection});
            return newSelection;
        });
    }

    const unSelectAll = () => setSelected([]);

    const isSelected = (item : T) => selected.includes(item);
    return { isSelected, select, unSelect, unSelectAll, toggle, selected}
}