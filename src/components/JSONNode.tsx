import {Checkbox, styled} from "@mui/material";
import MuiAccordion, {AccordionProps} from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import {ChangeEvent, ElementRef, useContext} from "react";
import {JsonContext} from "../context/JsonContext";
import {ConnectableElement, useDrag, useDrop} from "react-dnd";
import {json} from "node:stream/consumers";
import JsonUtils from "../utils/JsonUtils";

interface JSONNodeProps {
    node: any;
    parent?: any;
    ident: number;
    nodeKey?: string;
    expandLevel?: number;
}

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({theme}) => ({
    padding: 0,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}}/>}
        {...props}
    />
))(({theme}) => ({
    backgroundColor: 'white',
    border: 0,
    padding: 0,
    margin: 0,
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        padding: 0,
        margin: 0,
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
    margin: 0,
    padding: 0,
    marginLeft: theme.spacing(6),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
export default function JSONNode({
                                     nodeKey = 'root',
                                     node = undefined,
                                     parent = undefined,
                                     ident = 1,
                                     expandLevel = 3
                                 }: JSONNodeProps) {
    console.debug('JSONNode', nodeKey, node, ident, expandLevel);
    const {context: {selection, json}, dispatches: {setSelection, setJson, setRawJson}} = useContext(JsonContext);
    const [{isDragging}, drag] = useDrag(() => ({
        type: 'node',
        item: {key: nodeKey, node: node, parent: parent},
        canDrag: nodeKey !== 'root',
        // end: (item, monitor) => {
        //     alert('drop end ' + JSON.stringify(item) + ' parent ' + JSON.stringify(parent));
        //     const dropResult = monitor.getDropResult();
        //     if (item && dropResult) {
        //         const result = JsonUtils.deepDeleteFromJson(json, item);
        //         setRawJson(JSON.stringify(result));
        //         setJson(result);
        //     }
        // },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));
    const [{isOver}, drop] = useDrop(
        () => ({
            accept: 'node',
            drop: (item: any, monitor) => {
                if (monitor.didDrop()) return;
                alert('dropped ' + JSON.stringify(item) + ' on ' + nodeKey + ' ' + JSON.stringify(node));
                const result = JsonUtils.appendToJsonNode(JsonUtils.deepDeleteFromJson(json, item), node, item.value);
                setJson(result);
                setRawJson(JSON.stringify(result));
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver({shallow: true})
            })
        })
    )
    const attachRef = (el: ConnectableElement) => {
        drag(el);
        drop(el);
    };
    const onSelectionChange = (val: React.ChangeEvent<HTMLInputElement>) => setSelection([...markSelection(val, node, selection)]);
    if (node === undefined) return (<></>);
    let result = [];
    if (nodeKey === 'root' && ident === 1) {
        console.debug('Root node=> ', nodeKey, node);
        result.push(
            <Accordion
                defaultExpanded={ident < expandLevel}>
                <AccordionSummary
                    expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}}/>}>
                    <Checkbox
                        onChange={onSelectionChange}/>
                    <Typography
                        className={'flex items-center'}>{nodeKey} [{Object.keys(node).length} keys]</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {Object.keys(node).map(k =>
                        <JSONNode
                            nodeKey={k}
                            node={node[k]}
                            ident={ident + 1}/>)}
                </AccordionDetails>
            </Accordion>
        )
    } else if (Array.isArray(node)) {
        console.debug('Array node', node);
        result.push(
            <Accordion
                defaultExpanded={ident < expandLevel}>
                <AccordionSummary
                    expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}}/>}>
                    <Checkbox
                        onChange={onSelectionChange}/>
                    <Typography
                        className={'flex items-center'}>{nodeKey} [{node.length} items]</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {node.map((item: any, index: number) =>
                        <JSONNode
                            parent={node}
                            nodeKey={'[' + String(index) + ']'}
                            node={item}
                            ident={ident + 1}/>
                    )}
                </AccordionDetails>
            </Accordion>
        );
    } else if (typeof node === 'object') {
        console.debug('Object node', node)
        result.push(
            <Accordion
                defaultExpanded={ident < expandLevel}>
                <AccordionSummary
                    expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}}/>}>
                    <Checkbox
                        onChange={onSelectionChange}/>
                    <Typography
                        className={'flex items-center'}>{nodeKey} [{Object.keys(node).length} keys]</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {Object.keys(node).map((k: string, index: number) =>
                        <JSONNode
                            nodeKey={k}
                            parent={node}
                            node={node[k]}
                            ident={ident + 1}/>
                    )}
                </AccordionDetails>
            </Accordion>
        );
    } else {
        console.debug('Leaf node', node);
        result.push(
            <div
                className={'flex items-center'}>
                <Checkbox
                    onChange={onSelectionChange}/>
                <Typography>{nodeKey}</Typography>
            </div>)
    }
    return (
        <div
            ref={attachRef}
            key={`/${nodeKey}/${ident}`}
            className={isOver ? `border-amber-300 border-2 bg-amber-200  z-[${ident}]` : ''}
        >{
            result.map((i, index) =>
                <div key={`/${nodeKey}/${ident}/${index}`}>{i}</div>
            )
        }
        </div>
    );
}

function markSelection(checked: ChangeEvent<HTMLInputElement>, node: any, selection: object[]) {
    console.debug('markSelection', checked, node, selection);
    if (checked.target.checked) {
        selection.push(node);
    } else {
        selection = selection.filter((item) => item !== node);
    }
    return selection;
}