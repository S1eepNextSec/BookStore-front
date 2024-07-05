/**
 * 防抖函数
 * @param func
 * @param delay
 * @returns {(function(...[*]): void)|*}
 */
export function debounce(func, delay) {
    let timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, arguments);
        }, delay);
    };
}