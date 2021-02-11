import { typeOf } from './FuncTools';

const strFindAll = (str='', reg='') => {
    const result = [];
    reg && str && str.replace(reg, (item) => {
        result.push(item);
    })
    return result;
}

const isDatetime = (obj) => {
    const sType = typeOf(obj);
    if (sType === 'number' ||
        sType === 'Date'
    ) {
        return true
    } else if (
        sType === 'string' &&
        /^[/- :\d]$/g.test(obj)
    ) {
        return true
    } else {
        return false
    }
}

const getListDatetime = (obj) => {
    let strDate = typeOf(obj) === 'string' ? obj : new Date(obj).toLocaleString();
    let result = strFindAll(strDate, /[\d+]/g);

    if (result.length === 6 || result.length === 3) {
        return result;
    }
    return false;
}

const disintegrator = (obj, action, args) => {
    if (action === 'range') {
        const [max='', min=''] = args;
        let operator;

        if (max !== '' && min !== '') {
            operator = obj <= max && obj >= min;
        } else if (max !== '') {
            operator = obj <= max;
        } else if (min !== '') {
            operator = obj >= min;
        } else {
            throw new Error(`args (${args}) is not validated`);
        }
        return operator;
    } else if (action === 'reg') {

    }
}

const handleDateime = () => {

}

const v_date = (obj, opt) => {
    const {action, args: [max='', min='']} = opt;
    if (isDatetime(obj)) {
        const tmpDatetime = new Date()
        if (action === 'range') {
            const maxDate = max !== '' && isDatetime(max) && new Date(...getListDatetime(max));
            const minDate = min !== '' && isDatetime(min) && new Date(...getListDatetime(min));
            const midDate = new Date(...getListDatetime(obj));
        } else if (action === 'datedelta') {
            const maxDate = max !== '' && isDatetime(max) && new Date(new Date(...getListDatetime(tmpDatetime).slice(0, 3)).getTime() + new Date(...getListDatetime(max)).getTime());
            const minDate = min !== '' && isDatetime(min) && new Date(new Date(...getListDatetime(tmpDatetime).slice(0, 3)).getTime() + new Date(...getListDatetime(min)).getTime());
            const midDate = new Date(...getListDatetime(obj));
        }

        return midDate.toLocaleDateString() <= maxDate.toLocaleDateString()
            && minDate.toLocaleDateString() >= minDate.toLocaleDateString();
    }
    return false;
}