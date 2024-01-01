export default class JsonUtils {
    static deepDeleteFromJson(json: any, object: object): any {
        if (typeof json !== 'object') {
            return json;
        }
        if (Array.isArray(json)) {
            return json.map((item) => JsonUtils.deepDeleteFromJson(item, object));
        }
        return Object.keys(json).reduce((acc, key) => {
            if (json[key] === object) {
                return acc;
            }
            return {
                ...acc,
                [key]: JsonUtils.deepDeleteFromJson(json[key], object),
            };
        }, {});
    }

    static appendToJsonNode(json: any, toNode: any, item: any): any {
        if (json === toNode) {
            return {
                ...json,
                ...item,
            };
        }
        if (typeof json !== 'object') {
            return json;
        }
        if (Array.isArray(json)) {
            return json.map((arrItem) => {
                if (Array.isArray(arrItem)) {
                    return JsonUtils.appendToJsonNode(arrItem, toNode, arrItem);
                }
                if (arrItem === toNode) {
                    return {
                        ...arrItem,
                        ...arrItem,
                    };
                } else {
                    return arrItem;
                }
            });
        }
        return Object.keys(json).map((key) => {
            const objItem = json[key];
            if (objItem === toNode) {
                return {
                    ...json[key],
                    ...item,
                };
            }
            if (Array.isArray(objItem)) {
                return JsonUtils.appendToJsonNode(objItem, toNode, item);
            }
            return objItem;
        });
    }
}