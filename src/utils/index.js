'use strict'
import _ from 'lodash'
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

