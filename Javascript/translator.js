import { formatString } from './FuncTools';

class Translate {
    static _lang = ''
    static langData = {}
    static get lang () {
        return Translate._lang
    }
    static set lang (newLang) {
        return Translate._lang = newLang
    }
    static get langDataMap () {
        return Translate.langData[Translate.lang]
    }
    static set langMap (newData) {
        Translate.langData = newData
    }
    static changeLang (newLang) {
        Translate.lang = newLang
    }
    static $t(chars, options) {
        return formatString(Translate.langDataMap[chars], options)
    }

    static $tc (data) {
        (chars, options) => formatString(data[Translate.lang][chars], options)
    }
}

export default Translate
