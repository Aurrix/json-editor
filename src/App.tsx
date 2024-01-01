import './App.css';
import {Divider} from "@mui/material";
import {useEffect, useState} from "react";
import JSONNode from "./components/JSONNode";
import logo from './assets/logo.png';
import {JsonContext} from "./context/JsonContext";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {Editor} from '@monaco-editor/react';
import theme from "tailwindcss/defaultTheme";

function App() {
    const parseRaw: (str: string) => any = (str: string) => {
        try {
            return JSON.parse(str);
        } catch (e) {
            return {};
        }
    }
    const [rawJson, setRawJson] = useState(localStorage.getItem('json') || '');
    const [json, setJson] = useState(parseRaw(rawJson));
    const [selection, setSelection] = useState([] as object[]);
    useEffect(() => {
        localStorage.setItem('json', rawJson);
    }, [rawJson, setSelection]);
    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <JsonContext.Provider value={({
                    context: {rawJson, json, selection},
                    dispatches: {setSelection, setRawJson, setJson}
                })}>
                    <div className={'flex bg-gray-300 justify-between w-full h-[5vh]'}>
                    <span className='h-2 p-3 font-bold'>
                        <img className={'inline mx-3'} src={logo} width={'30px'}
                             height={'30px'} alt={'logo'}/>JSON Editor</span>
                    </div>
                    <div className={'flex h-[95vh] w-full'}>
                        <div className={'h-full w-4/12 pr-3'}>
                            <JSONNode node={json} parent={json} ident={1}/>
                        </div>
                        <Divider orientation={"vertical"}/>
                        <div className={'h-full w-8/12 pl-3'}>
                            <Editor
                                options={{
                                    theme: 'vs-dark',
                                }}
                                height={'100%'}
                                width={'100%'}
                                defaultLanguage={'json'}
                                defaultValue={rawJson}
                                onChange={(val) => {
                                    setRawJson(val ?? '');
                                    setJson(parseRaw(val ?? ''));
                                }}
                            />
                        </div>
                    </div>
                </JsonContext.Provider>
            </DndProvider>
        </>
    )
        ;
}

export default App;
