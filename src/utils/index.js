'use strict'
import _ from 'lodash'
const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

export default getInfoData