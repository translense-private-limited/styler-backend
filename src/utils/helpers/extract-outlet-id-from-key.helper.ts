export function extractOutletIdFromKey(key:string):number{
    return parseInt(key.split('/')[0], 10);
}