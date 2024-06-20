/*
 * @Author: DiChen
 * @Date: 2024-06-19 14:46:54
 * @LastEditors: DiChen
 * @LastEditTime: 2024-06-20 18:12:40
 */

import { get, post, axiosDelete, put, get_id } from '@/utils/request.js'

/**
 * @description: queryPoint
 * @param {*} params
 * @return {*}
 */
export const queryPoint = (params) => get('/baseFunc/queryPoint', params)
