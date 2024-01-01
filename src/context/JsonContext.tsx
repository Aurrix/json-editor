import React, {createContext} from "react";

interface SelectionContextProps {
    context: {
        rawJson: string,
        json: object,
        selection: object[]
    };
    dispatches: {
        setSelection: React.Dispatch<React.SetStateAction<Array<object>>>;
        setJson: React.Dispatch<React.SetStateAction<object>>;
        setRawJson: React.Dispatch<React.SetStateAction<string>>;
    };
}

export const JsonContext = createContext<SelectionContextProps>({
    context: {
        selection: [],
        json: {},
        rawJson: '',
    },
    dispatches: {
        setSelection: () => {
        },
        setJson: () => {
        },
        setRawJson: () => {
        }
    }
});