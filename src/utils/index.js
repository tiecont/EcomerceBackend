'use strict'
import _ from 'lodash';
import { Types } from 'mongoose';

export const convertToObjectIdMongodb = id => new Types.ObjectId(id)

export const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}
// ['a', 'b']  => { a: 1, b: 1}
export const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

export const unGetSelect = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

export const removeUndefinedOject = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === undefined || null) {
            delete obj[key]
        }
    })
    return obj
}

export const updateNestedObjectParser  = obj => {
    const final = {}
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'Object' && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key])
            Object.keys(response).forEach(res => {
                final[`${key}.${res}`] = response[res]
            })
        } else {
            final[key] = obj[key]
        }
    })
    return final
}
