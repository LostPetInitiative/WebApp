import {resources as translations} from './i18n'


function flattenObjectKeys(o: object | string, prefix:string ,result: string[]) {
    // doing pre-order object traversal

    result.push(prefix)
    if (typeof(o) === 'string')
        return

    const dict = o as {[idx:string]:object}
    var keys = Object.keys(o)
    for(var i=0; i< keys.length; i++) {
        const key = keys[i]
        flattenObjectKeys(dict[key],prefix+"."+key,result)
    }
}

describe("Localization", () => {
    test("flat func (test utility)",() => {
        const list:string[] = []
        flattenObjectKeys({a:{b:{c:"1",d:"2"},c:"0"},qqq:"2"},"",list)
        expect(list).toEqual([ "",".a",".a.b",".a.b.c",".a.b.d",".a.c",".qqq"])
    })

    test('Same localization keys in different languages', () => {
        const ruKeys:string[] = []
        flattenObjectKeys(translations.ru,"",ruKeys)
        const enKeys:string[] = []
        flattenObjectKeys(translations.en,"",enKeys)

        expect(ruKeys).toEqual(enKeys)
      });
})

