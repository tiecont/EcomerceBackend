'use strict'
import { getSelectData, unGetSelect } from './../../utils/index.js';

export const findAllDiscountCodesUnselect = async ({ 
    limit = 50, page = 1, sort = 'ctime',
    filter, unSelect,model}) => {
        const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const document = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelect(unSelect))
    .lean()
    return document
}

export const findAllDiscountCodesSelect = async ({ 
    limit = 50, page = 1, sort = 'ctime',
    filter, select,model}) => {
        const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const document = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    return document
}

export const checkDiscountExists = async ({ model, filter }) => {
    return await model.findOne(filter).lean()
}