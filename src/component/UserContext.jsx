import React, {createContext, useState} from 'react'
import {UserInfo} from "../utils/fakeData";
/**
 * 用来提供上下文的组件
 * @param children
 * @returns {Element}
 * @constructor
 */
export const UserContext = createContext();